<script>
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";
  import PanelLayout from "@layouts/Panel.svelte";
  import GraphQLProgress from "@components/GraphQLProgress.svelte";
  import {
    open as openModal,
    close as closeModal
  } from "@components/Modal.svelte";
  import Hotwire from "@components/Hotwire.svelte";
  import Network, { fetchAll } from "./store.js";
  import Providers, { count } from "@archetypes/Providers/store.js";
  import Add from "./Add.svelte";
  import Teaser from "./Teaser.svelte";
  import { dialog } from "@components/Dialog.svelte";

  import NoResults from "@components/NoResults.svelte";
  import NotFound from "@assets/NotFound.svelte";

  let networks;
  let chainspecCount = 0;

  const fetchNetworks = () =>
    Network.query(fetchAll).then(_networks => (networks = _networks));
  const handleAddNetwork = () => {
    if (chainspecCount <= 0) {
      dialog.notification({
        title: "No provider credentials",
        subtitle:
          "Before adding a new network you'll need to configure some credentials on the providers page.",
        confirmButton: "Add credentials",
        onConfirm: () => push("/dashboard/providers"),
        cancelButton: `No Thanks`
      });
    } else {
      openModal(Add, {
        onSuccess: () => {
          closeModal();
          window.location.reload();
        }
      });
    }
  };

  onMount(() => {
    fetchNetworks();
    Providers.query(count).then(_count => {
      chainspecCount = _count;
    });
  });
</script>

<Hotwire
  subscriptions={[{ name: 'NETWORK', event: 'ADD', callback: () => fetchNetworks() }, { name: 'NETWORK', event: 'DELETE', callback: () => fetchNetworks() }]}>
  <PanelLayout
    header={{ title: 'Networks', icon: 'blur_on', actions: [{ text: 'Add Network', icon: 'add', callback: handleAddNetwork }] }}
    showBreadcrumbs>
    {#if !networks}
      <GraphQLProgress />
    {:else}
      {#each networks as network}
        <Teaser _id={network._id} />
      {:else}
        <NoResults graphic={NotFound} title="No networks available">
          Start by installing
          <a href="https://github.com/gantree-io/gantree-node-watchdog">
            Gantree Monitor
          </a>
          on one or more of your nodes.
        </NoResults>
      {/each}
    {/if}
  </PanelLayout>
</Hotwire>

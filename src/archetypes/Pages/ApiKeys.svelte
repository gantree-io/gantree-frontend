<script>
  import { onMount } from "svelte";
  import Account, { fetchUserByApiKey } from "@archetypes/Account/store";
  import PanelLayout from "@layouts/Panel.svelte";
  import { query } from "@util/graphql";

  let _me;
  onMount(() => {
    Account.subscribe(({ user }) => {
      _me = user;
    });
  });
</script>

<style>
  pre {
    background-color: #d6d6d6;
    color: black;
    font-size: 1.2rem;
    padding: 10px;
  }
</style>

<PanelLayout header={{ title: 'ApiKeys', icon: 'receipt' }} showBreadcrumbs>
  <h2 class="mdc-typography--headline6">Your API Key</h2>
  <p class="mdc-typography--body1 -content">
    At the moment you have a single, unmodifiable API Key. You should use this
    when you set up the
    <a href="https://github.com/gantree-io/gantree-node-watchdog" target="_blank">
      Gantree Node Watchdog
    </a>
    on each of your nodes.
  </p>
  <pre>
    {#if _me}{_me.apiKey}{:else}Loading...{/if}
  </pre>
  <p class="mdc-typography--body1 -content">
    Copy this key and paste it when prompted by Gantree Node Watchdog.
  </p>
</PanelLayout>

<script>
  import GraphQLProgress from "@components/GraphQLProgress.svelte"
  import PanelLayout from "@layouts/Panel.svelte"
  import Node from "@archetypes/Node/Teaser.svelte"
  import Button from "@components/Form/buttons/Submit.svelte"
  import Network, { fetchOne, createDashboard } from "./store.js"
  import {
    Filterable,
    FilterItem,
    Filters,
    Option,
    Icon,
    Text,
  } from "@components/Filterable"
  import Chainspec, {
    fetchOne as fetchOneChainspec,
  } from "@archetypes/Chainspec/store.js"
  import { toast } from "@components/Toaster.svelte"
  import Hotwire from "@components/Hotwire.svelte"

  export let _id
  let title
  let status
  let chainspecName
  let nodes
  let dashboardUrl
  let dashboardStatus
  let provisioningDashboard = false

  const fetch = () =>
    Network.query(fetchOne, { _id: _id }).then((data) => {
      title = data.projectId
      status = data.status // TODO: make all references to network "status" -> "health"
      nodes = data.nodes
      dashboardUrl = data.dashboardUrl // TODO: address redundancy
      dashboardStatus = data.dashboardStatus // HACK: temporary alternative to relying on URL
      console.log({ dashboardStatus })
      if (dashboardStatus === undefined) {
        console.error("Dashboard status is undefined")
      }
      if (dashboardStatus !== "PROVISIONING") provisioningDashboard = false

      // if (data.chainspec === "new") {
      //   chainspecName = "New Chainspec";
      // } else if (data.chainspec === "default") {
      //   chainspecName = "Default Chainspec";
      // } else {
      //   Chainspec.query(fetchOneChainspec, { _id: data.chainspec }).then(
      //     _chainspec => {
      //       chainspecName = _chainspec.name;
      //     }
      //   );
      // }
    })

  const provisionDashboard = async () => {
    // do something where we query the backend and put the dash url into a
    // loading state
    toast.success(
      `Provisioning monitoring dashboard. This might take a few minutes`
    )
    provisioningDashboard = true // TODO: instead of relying on this flag, poll back-end every n seconds if done or perhaps hotwire
    await Network.query(createDashboard, { _id: _id })
  }

  const openDashboard = () => {
    window.open(dashboardUrl)
  }

  fetch()
</script>

<style lang="scss">
  :global(.filter-list) {
    margin-bottom: 1em;
  }

  .mdc-typography--caption.-status {
    &[data-status="DEPLOYING"] {
      color: var(--color-white);
    }
    &[data-status="CONFIGURING"] {
      color: var(--color-status-warning);
    }
    &[data-status="ONLINE"] {
      color: var(--color-status-success);
    }
    &[data-status="SHUTDOWN"] {
      color: var(--color-status-error);
    }
    &[data-status="ERROR"] {
      color: var(--color-status-error);
    }
  }
</style>

<!-- HACK: needs to be rewritten with dashboardStatus in mind -->
<Hotwire
  subscriptions={[{ name: _id, event: 'UPDATE', callback: (data) => fetch(data) }]}>
  <PanelLayout header={{ title: title }}>
    {#if !nodes}
      <GraphQLProgress />
    {:else}
      <div class="flex justify-start mb3">
        {#if provisioningDashboard || dashboardStatus === 'PROVISIONING'}
          <Button class="disabled">Provisioning...</Button>
        {:else if dashboardStatus === "DESTROYING"}
          <Button class="disabled">Destroying...</Button>
        {:else if dashboardStatus === 'REQUIRES-PROVISIONING'}
          <Button onClick={provisionDashboard}>
            + Create Monitoring Dashboard
          </Button>
        {:else if dashboardStatus === 'READY'}
          <div>
            <Button onClick={openDashboard}>View Monitoring Dashboard</Button>
            <Button onClick={provisionDashboard}>Force Update Dashboard</Button>
          </div>
        {:else if dashboardStatus === 'ERROR'}
          <Button onClick={provisionDashboard}>
            + Create Monitoring Dashboard (Last Attempt Failed)
          </Button>
        {:else}
          <Button onClick={provisionDashboard}>
            + Create Monitoring Dashboard (Error Reading Status)
          </Button>
        {/if}
      </div>
      <Filterable>
        <Filters>
          <Option key="validator">
            <Icon>find_in_page</Icon>
            <Text>Validators</Text>
          </Option>
          <Option key="full">
            <Icon>dns</Icon>
            <Text>Full Nodes</Text>
          </Option>
        </Filters>

        {#each nodes as node}
          <FilterItem key={node.validator ? 'validator' : 'full'}>
            <Node {...node} />
          </FilterItem>
        {/each}
      </Filterable>
    {/if}

    <span
      class="mdc-typography--caption -status"
      data-status={status}
      slot="info">
      Network status: {status}
    </span>
  </PanelLayout>
</Hotwire>

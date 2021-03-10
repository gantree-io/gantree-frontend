<script>
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";
  import _ from 'lodash'
  import PanelLayout from "@layouts/Panel.svelte";
  import GraphQLProgress from "@components/GraphQLProgress.svelte";
  import {
    open as openModal,
    close as closeModal,
  } from "@components/Modal.svelte";
  import Hotwire from "@components/Hotwire.svelte";
  import PCK, { pckCollections } from "./store";
  import Add from "./Add.svelte";
  import AddCollection from "./AddCollection.svelte";
  import Teaser from "./Teaser.svelte";
  import Paper, { Title } from "@smui/paper";
  import Expanda from "@components/Expanda.svelte";
  import { dialog } from "@components/Dialog.svelte";
  import Link from "@components/Link.svelte";
  import NoResults from "@components/NoResults.svelte";
  import NotFound from "@assets/NotFound.svelte";
  import Form, { Field } from '@components/Form'
  import Button, { Label, Icon } from '@smui/button';

  let collections
  let collectionOptions = {};
  let selectedCollectionId
  let selectedCollectionDashboardUrl

  const hydrateCollections = () => PCK.query(pckCollections).then(_collections => {
    collections = _collections
   
    // set the collection options
    _collections.forEach(_c => collectionOptions[_c._id] = _c.name)

    // set the selected collection
    selectedCollectionId = !selectedCollectionId
      ? collections[0]._id
      : _.find(collections, {_id: selectedCollectionId})._id

      // set the collection dashboard url
      selectedCollectionDashboardUrl = !selectedCollectionDashboardUrl
        ? collections[0].dashboardUrl
        : _.find(collections, {_id: selectedCollectionId}).dashboardUrl
  });

  const handleAddPckCollection = () => {
    openModal(
      AddCollection, 
      {
        onSuccess: () => {
          closeModal();
        }
      }
    );
  };    

  const handleAddPck = () => {
    openModal(
      Add, 
      {
        pckCollectionId: selectedCollectionId,
        onSuccess: () => {
          closeModal();
        }
      }
    );
  };

  const openPckCollectionDashboard = () => {
    window.open(selectedCollectionDashboardUrl)
  }

  onMount(() => {
    hydrateCollections()
  });
</script>

<style lang="scss">
  .controls{
    margin-bottom: 1em;
    display: flex;
    justify-content: space-between;
  }
</style>

<Hotwire
  subscriptions={[
      { 
        name: 'PCK', 
        event: 'ADD', 
        callback: () => hydrateCollections() 
      }, 
      { 
        name: 'PCK', 
        event: 'DELETE', 
        callback: () => hydrateCollections() 
      },
      { 
        name: 'PCK_COLLECTION', 
        event: 'ADD', 
        callback: () => hydrateCollections() 
      }, 
      { 
        name: 'PCK_COLLECTION', 
        event: 'DELETE', 
        callback: () => hydrateCollections() 
      }
  ]}
  >
  <PanelLayout
    header={{ 
      title: 'Protocol Client Keys', 
      icon: 'mediation', 
       // actions: [
       //   { 
       //     text: 'Add Collection', 
       //     icon: 'add', 
       //     callback: handleAddPckCollection 
       //   }
       // ] 
    }}
    showBreadcrumbs
    >

    {#if !collections}
      <GraphQLProgress />
    {:else}
      
      {#if selectedCollectionId}
        <div class="controls">
          <Form
            onChange={({fields}) => selectedCollectionId = fields.collection}
            >
            <Field
              title='COLLECTION:'
              inline={true}
              disabled={Object.keys(collectionOptions).length <= 1}
              input={{
                id: 'collection',
                type: 'select',
                options: collectionOptions,
                value: selectedCollectionId,
                disabled: Object.keys(collectionOptions).length <= 1 ? 'disabled' : '',
              }}
            />
          </Form>

          <Button
            on:click={openPckCollectionDashboard}
            >
            <Icon class="material-icons">insert_chart</Icon>
            <Label>View Monitoring Dashboard</Label>
          </Button>

          <Button
            on:click={handleAddPck}
            class='add-button'
            >
            <Icon class="material-icons">add</Icon>
            <Label>Add new PCK</Label>
          </Button>
        </div>          

        <!-- HACK(Denver): re-using node-teaser class here, also styling directly. -->
        <Paper class="node-teaser" style={`border-width: 5px !important; border-color: green;`} elevation=0>
          <div class="title">
            <Icon class="material-icons">info</Icon>
            <Title style="margin-right: 1em;">
              Information
            </Title>  
          </div>
          <Expanda
            class="-telemetry"
            openTrigger={{ text: '', icon: 'expand_more' }}
            closeTrigger={{ text: '', icon: 'expand_less' }}>
            <p class="mdc-typography--body1 -content">
              Once node operators have registered their nodes with your PCKRC and provisioned their network monitoring dashboards, you'll begin seeing metrics in your protocol monitoring dashboard.
            </p>
          </Expanda> 
        </Paper>
    
        {#if _.get(_.find(collections, {_id: selectedCollectionId}), 'pcks', []).length > 0}
          {#each _.get(_.find(collections, {_id: selectedCollectionId}), 'pcks', []) as pck}
            <Teaser
              {...pck}
            />
          {/each}
        
        {:else}
          <NoResults graphic={NotFound} title="No PCKs found">
            Start by
            <a on:click={handleAddPck}>
              adding a PCK
            </a>
            to this collection
          </NoResults>
        {/if}
      {:else}
        <NoResults graphic={NotFound} title="No managed protocol found">
          Become a protocol management team by
          <!-- HACK(Denver): use a config/const so consistent with sidebar link -->
          <a on:click={() => {window.open("https://www.notion.so/flexdapps/Get-In-Touch-a4e8c3461eed4cbe835b3e2f98ea0c69")}}>
            contacting us
          </a>
        </NoResults>
      {/if}
    {/if}
  </PanelLayout>
</Hotwire>

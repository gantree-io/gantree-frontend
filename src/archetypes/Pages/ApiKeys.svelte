<script>
  import { onMount } from 'svelte'
  import Account, { fetchUserByApiKey } from '@archetypes/Account/store'
  import PanelLayout from '@layouts/Panel.svelte'
  import { query } from '@util/graphql'

  let _me
  onMount(() => {
    Account.subscribe(({user}) => {
      _me = user
    })
  })
</script>

<style>
  pre {
    background-color: #d6d6d6;
    color: black;
    font-size: 1.2rem;
    padding: 10px;
  }
</style>

<PanelLayout
	header={{
		title: 'ApiKeys',
		icon: 'receipt',
	}}
	showBreadcrumbs
	>
	<h2 class="mdc-typography--headline6">Your API Key</h2>
	<p class="mdc-typography--body1 -content">
		At the moment you have a single, unmodifiable API Key. You can use this in the <a href="https://github.com/flex-dapps/gantree-cli" target="_blank">Gantree-CLI</a> to ensure that we hook your network up to our monitoring and alerting services. When you deploy networks via the CLI with your API Key, they'll show up in your dashboard.
	</p>
  <pre>
    {#if _me}{_me.apiKey}{:else}Loading...{/if}
  </pre>
  <p class="mdc-typography--body1 -content">
		Copy this key and paste it into the relevant section into your Gantree Config. You don't need to do this if you're deploying networks from the dashboard (this website) instead.
  </p>
  <p class="mdc-typography--body1 -content">
		The example below shows the place in the config file that you should add your key.
	</p>
</PanelLayout>

<script>
	import { onMount } from 'svelte';
	import ChainspecTeaser from '@archetypes/Chainspec/Teaser.svelte'
	import PanelLayout from '@layouts/Panel.svelte'
	import { open as openModal, close as closeModal } from '@components/Modal.svelte'
	import ChainspecAdd from './Add.svelte'
	import Hotwire from '@components/Hotwire.svelte'
	import GraphQLProgress from '@components/GraphQLProgress.svelte'
	import Chainspec, { fetchAll } from './store.js'
	import NoResults from '@components/NoResults.svelte'

  	let chainspecs
  	
  	const _fetchAll = () => Chainspec
  		.query(fetchAll, {withCount: true})
  		.then(_chainspecs => chainspecs = _chainspecs)
  	
  	const handleChainspecAdd = () => openModal(ChainspecAdd, { 
  		onSuccess: () => closeModal() ,
  		onCancel: () => closeModal() 
  	})
  	
  	onMount(() => _fetchAll())
</script>

<Hotwire
	subscriptions={[
		{
			name: 'CHAINSPEC',
			event: 'ADD',
			callback: () => _fetchAll()
		},
		{
			name: 'CHAINSPEC',
			event: 'DELETE',
			callback: () => _fetchAll()
		}
	]}
	>
	<PanelLayout 
		header={{
			title: 'Chainspecs',
			icon: 'settings',
			actions: [
		 		{
					text: 'Add Chainspec',
					icon: 'add',
					callback: handleChainspecAdd
		 		}
			]
		}}
		showBreadcrumbs
		>
		{#if !chainspecs}
			<GraphQLProgress/>
		{:else}
			{#each chainspecs as chainspec}
				<ChainspecTeaser {...chainspec}/>
			{:else}
				<NoResults 
					title='You have no custom chainspecs'
					disclaimer='A network can still be configured by using the default chainspec, available when creating a new network.'
					>
					Start by adding a <span class='inline-link' on:click={handleChainspecAdd}>new chainspec</span> now.<br/>
				</NoResults>
			{/each}
		{/if}
	</PanelLayout>
</Hotwire>
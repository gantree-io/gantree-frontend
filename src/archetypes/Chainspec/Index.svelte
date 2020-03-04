<script>
	import { onMount } from 'svelte';
	import ChainspecTeaser from '@archetypes/Chainspec/Teaser.svelte'
	import PanelLayout from '@layouts/Panel.svelte'
	import { open as openModal, close as closeModal } from '@components/Modal.svelte'
	import ChainspecAdd from './Add.svelte'
	import Hotwire from '@components/Hotwire.svelte'
	import GraphQLProgress from '@components/GraphQLProgress.svelte'
	import Chainspec, { fetchAll } from './store.js'

  	let chainspecs
  	const _fetchAll = () => Chainspec.query(fetchAll).then(_chainspecs => chainspecs = _chainspecs)
  	onMount(() => _fetchAll())
</script>

<Hotwire
	subscriptions={[
		{
			event: 'CHAINSPEC.ADD',
			callback: () => _fetchAll()
		},
		{
			event: 'CHAINSPEC.DELETE',
			callback: () => _fetchAll()
		}
	]}
	>
	<PanelLayout 
		header={{
			title: 'Config',
			icon: 'settings',
			actions: [
		 		{
					text: 'Add Chainspec',
					icon: 'add',
					callback: () => {
						openModal(ChainspecAdd, 
							{
								onSuccess: () => closeModal()
							}
						)
					}
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
				...nothing 
			{/each}
		{/if}
	</PanelLayout>
</Hotwire>
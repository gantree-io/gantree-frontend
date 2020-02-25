<script>
	import { onMount } from 'svelte';
	import GraphQLProgress from '@components/GraphQLProgress.svelte'
	import PanelLayout from '@layouts/Panel.svelte'
	import { open as openModal, close as closeModal } from '@components/Modal.svelte'
	import Hotwire from '@components/Hotwire.svelte'
	import Network, { fetchAll } from './store.js'
	import NetworkAdd from './Add.svelte'
	import NetworkTeaser from '@archetypes/Network/Teaser.svelte'
	
 	let networks
	const _fetchAll = () => Network.query(fetchAll).then(_networks => networks = _networks)
	onMount(() => _fetchAll())
</script>

<Hotwire
	subscriptions={[
		{
			event: `NETWORK.ADD`,
			callback: () => _fetchAll()
		},
		{
			event: `NETWORK.DELETE`,
			callback: () => _fetchAll()
		}
	]}
	>
	<PanelLayout 
		header={{
			title: 'Neworks',
			icon: 'blur_on',
			actions: [
		 		{
					text: 'Add Network',
					icon: 'add',
					callback: () => {
						openModal(NetworkAdd, {
							onSuccess: () => closeModal()
						})
					}
		 		}
		 	]
		}}
		showBreadcrumbs
		>
		{#if !networks}
			<GraphQLProgress/>
		{:else}
			{#each networks as network}
				<NetworkTeaser {...network}/>
			{:else}
				...nothing 
			{/each}
		{/if}
	</PanelLayout>
</Hotwire>
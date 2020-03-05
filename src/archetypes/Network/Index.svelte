<script>
	import { onMount } from 'svelte';
	import PanelLayout from '@layouts/Panel.svelte'
	import GraphQLProgress from '@components/GraphQLProgress.svelte'
	import NoResults from '@components/NoResults.svelte'
	import { open as openModal, close as closeModal } from '@components/Modal.svelte'
	import Hotwire from '@components/Hotwire.svelte'
	import Network, { fetchAll } from './store.js'
	import Add from './Add.svelte'
	import Teaser from './Teaser.svelte'
	
 	let networks
	const _fetchAll = () => Network.query(fetchAll).then(_networks => networks = _networks)
	
	onMount(() => _fetchAll())

	const handleOpenAddModal = () => {
		openModal(Add, {
			onSuccess: () => closeModal()
		})
	}
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
		},
		{
			event: `NETWORK.UPDATE`,
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
					callback: handleOpenAddModal
		 		}
		 	]
		}}
		showBreadcrumbs
		>
		{#if !networks}
			<GraphQLProgress/>
		{:else}
			{#each networks as network}
				<Teaser {...network}/>
			{:else}
				<NoResults title='No networks available'>
					Start by adding a <span class='inline-link' on:click={handleOpenAddModal}>new network</span> now
				</NoResults>
			{/each}
		{/if}
	</PanelLayout>
</Hotwire>
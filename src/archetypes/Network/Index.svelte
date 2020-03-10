<script>
	import { onMount } from 'svelte';
	import { push } from 'svelte-spa-router'
	import PanelLayout from '@layouts/Panel.svelte'
	import GraphQLProgress from '@components/GraphQLProgress.svelte'
	import NoResults from '@components/NoResults.svelte'
	import { open as openModal, close as closeModal } from '@components/Modal.svelte'
	import Hotwire from '@components/Hotwire.svelte'
	import Network, { fetchAll } from './store.js'
	import Providers, { count } from '@archetypes/Providers/store.js'
	import Add from './Add.svelte'
	import Teaser from './Teaser.svelte'
	import { dialog } from '@components/Dialog.svelte'
	
 	let networks
 	let chainspecCount = 0

	const fetchNetworks = () => Network.query(fetchAll).then(_networks => networks = _networks)
	const handleAddNetwork = () => {
		if(chainspecCount <= 0){
			dialog.notification({
				title: "No provider credentials",
				subtitle: 'Before adding a new network you\'ll need to configure some credentials on the providers page.',
				confirmButton: 'Add credentials',
				onConfirm: () => push('#/dashboard/keys'),
				cancelButton: `I'm good`,
			})
		}else{
			openModal(Add, {onSuccess: () => closeModal()})
		}
	}
	
	onMount(() => {
		fetchNetworks()
		Providers.query(count).then(_count => {
			chainspecCount = _count
		})
	})
</script>

<Hotwire
	subscriptions={[
		{
			name: 'NETWORK',
			event: 'ADD',
			callback: () => fetchNetworks()
		},
		{
			name: 'NETWORK',
			event: 'DELETE',
			callback: () => fetchNetworks()
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
					callback: handleAddNetwork
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
					Start by deploying a <span class='inline-link' on:click={handleAddNetwork}>new network</span> now
				</NoResults>
			{/each}
		{/if}
	</PanelLayout>
</Hotwire>
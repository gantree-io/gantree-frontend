<script>
	import { onMount, onDestroy } from 'svelte';
	import NetworkTeaser from '@archetypes/Network/Teaser.svelte'
	import GraphQueryWrapper from '@components/GraphQueryWrapper.svelte'
	import PanelLayout from '@layouts/Panel.svelte'
	import { open as openModal, close as closeModal } from '@components/Modal.svelte'
	import NetworkAdd from './Add.svelte'
	
	const query = `
 		query networks {
			networks{
				_id
				name
				nodes{
					status
				}
			}
 		}
 	`

 	let triggerRefetch;

 	onMount(() => {
 		PubSub.subscribe('NETWORK.DELETE', () => triggerRefetch());
 		PubSub.subscribe('NETWORK.ADD', () => triggerRefetch());
 	})

 	onDestroy(() => {
 		PubSub.unsubscribe('NETWORK.DELETE');
 		PubSub.unsubscribe('NETWORK.ADD');
 	})
</script>

<PanelLayout 
	header={{
		title: 'Neworks',
		icon: 'blur_on',
		actions: [
	 		{
				text: 'Add New',
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
	<GraphQueryWrapper
		query={query}
		component={NetworkTeaser}
		afterInit={({refetch}) => {
			triggerRefetch = refetch
		}}
	/>
</PanelLayout>
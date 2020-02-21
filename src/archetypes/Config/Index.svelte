<script>
	import { onMount, onDestroy } from 'svelte';
	import PubSub from 'pubsub-js'
	import ConfigTeaser from '@archetypes/Config/Teaser.svelte'
	import GraphQueryWrapper from '@components/GraphQueryWrapper.svelte'
	import PanelLayout from '@layouts/Panel.svelte'
	import { open as openModal, close as closeModal } from '@components/Modal.svelte'
	import ConfigAdd from './Add.svelte'

  	const query = `
 		query configs {
			configs{
				_id
				name
			}
 		}
 	`;

 	onMount(() => {
 		PubSub.subscribe('CONFIG.DELETE', () => triggerRefetch());
 		PubSub.subscribe('CONFIG.ADD', () => triggerRefetch());
 	})

 	onDestroy(() => {
 		PubSub.unsubscribe('CONFIG.DELETE');
 		PubSub.unsubscribe('CONFIG.ADD');
 	})

 	let triggerRefetch;
</script>

<PanelLayout 
	header={{
		title: 'Config',
		icon: 'settings',
		actions: [
	 		{
				text: 'Add Config',
				icon: 'add',
				callback: () => {
					openModal(ConfigAdd, 
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
	<GraphQueryWrapper
		query={query}
		component={ConfigTeaser}
		afterInit={({refetch}) => {
			triggerRefetch = refetch
		}}
	/>
</PanelLayout>
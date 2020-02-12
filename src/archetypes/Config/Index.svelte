<script>
	import { onMount, onDestroy } from 'svelte';
	import PubSub from 'pubsub-js'
	import ConfigTeaser from '@archetypes/Config/Teaser.svelte'
	import GraphQueryWrapper from '@components/GraphQueryWrapper.svelte'
	import PanelLayout from '@layouts/Panel.svelte'
	import { modal } from '@app/store.js';
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

 	// TESTING
 	modal.open(ConfigAdd, 
 		{
 			onSuccess: () => modal.close()
 		}
 	)
</script>

<PanelLayout 
	header={{
		title: 'Config',
		actions: [
	 		{
				text: 'Add Config',
				icon: 'add',
				callback: () => {
					modal.open(ConfigAdd, 
						{
							onSuccess: () => modal.close()
						}, 
						{
							title: `Add Config`,
							subtitle: `chainspec.json`,
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
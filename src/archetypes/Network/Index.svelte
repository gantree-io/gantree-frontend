<script>
	import NetworkTeaser from '@archetypes/Network/Teaser.svelte'
	import GraphQueryWrapper from '@components/GraphQueryWrapper.svelte'
	import PanelLayout from '@layouts/Panel.svelte'
	import { modal } from '@app/store.js'
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

 	 //TESTING
 	modal.open(NetworkAdd, {
		onSuccess: () => modal.close()
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
					modal.open(NetworkAdd, {
						onSuccess: () => modal.close()
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
	/>
</PanelLayout>

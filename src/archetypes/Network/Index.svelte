<script>
	import NetworkTeaser from '@archetypes/Network/Teaser.svelte'
	import GraphQueryWrapper from '@components/GraphQueryWrapper.svelte'
	import PanelLayout from '@layouts/Panel.svelte'
	
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
</script>

<PanelLayout 
	header={{
		title: 'Neworks',
		icon: 'blur_on',
		actions: [
	 		{
				text: 'Add New',
				icon: 'add'
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

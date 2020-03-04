<script>
	import GraphQLProgress from '@components/GraphQLProgress.svelte'
	import PanelLayout from '@layouts/Panel.svelte'
	import Node from '@archetypes/Node/Teaser.svelte'
	import Network, { fetchOne } from './store.js'
	import Filterable from '@components/Filterable.svelte'
	import { NodeFilterOptions } from './util'

	export let _id;
	let title;
	let chainspecName;
	let nodes
	
	// fetch items
	Network.query(fetchOne, {_id: _id}).then(data => {
		title = data.name
		chainspecName = data.chainspec.name
		nodes = data.nodes
	})
</script>

<style lang="scss">
	:global(.filter-list){
		margin-bottom: 1em;
	}
</style>

<PanelLayout 
	header={{
		title: title,
		subtitle: chainspecName && `Config: ${chainspecName}`,
		actions: [
	 		{
				text: 'Delete',
				icon: 'delete',
	 		}
	 	]
	}}
	>
	{#if !nodes}
		<GraphQLProgress/>
	{:else if !nodes.length}
		[no items]
	{:else}
		<Filterable
			{...NodeFilterOptions}
			items={nodes}
			component={Node}
			>
			<p>All items hidden by filters</p>
		</Filterable>
	{/if}
</PanelLayout>
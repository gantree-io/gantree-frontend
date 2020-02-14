<script>
	import _ from 'lodash'
	import GraphQLProgress from '@components/GraphQLProgress.svelte'
	import PanelLayout from '@layouts/Panel.svelte'
	import Node from '@archetypes/Node/Teaser.svelte'
	import NetworkStore from './store.js'
	import FilterList from '@components/FilterList.svelte'
	import { NodeFilterOptions } from './util'

	export let _id;
	let title;
	let configName;
	let nodes = []
	let filter = NodeFilterOptions.slice();
	
	// fetch items
	NetworkStore.fetchOne(_id).then(data => {
		console.log(data)
		title = data.name
		configName = data.config.name
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
		subtitle: configName && `Config: ${configName}`,
		actions: [
	 		{
				text: 'Delete',
				icon: 'delete',
	 		}
	 	]
	}}
	>
	{#if nodes.length}
		<FilterList 
			options={NodeFilterOptions}
			count={item => _.filter(nodes||[], {type: item.key}).length}
			on:change={({detail}) => filter = detail}
		/>

		{#each nodes as node}
			{#if _.some(filter, ['key', node.type])}
				<Node {...node}/>
			{/if}
		{/each}
	{:else}
		<GraphQLProgress/>
	{/if}
</PanelLayout>
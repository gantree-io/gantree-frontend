<script>
	import GraphQLProgress from '@components/GraphQLProgress.svelte'
	import PanelLayout from '@layouts/Panel.svelte'
	import Node from '@archetypes/Node/Teaser.svelte'
	import Network, { fetchOne } from './store.js'
	import { Filterable, FilterItem, Filters, Option, Icon, Text } from '@components/Filterable'
	import Chainspec, { fetchOne as fetchOneChainspec } from '@archetypes/Chainspec/store.js'

	export let _id;
	let title;
	let chainspecName;
	let nodes
	
	// fetch items
	Network.query(fetchOne, {_id: _id}).then(data => {
		title = data.name
		nodes = data.nodes

		if(data.chainspec === 'new'){
			chainspecName = '[TODO: new]'
		}else if(data.chainspec === 'default'){
			chainspecName = '[TODO: default]'
		}else{
			Chainspec.query(fetchOneChainspec, {_id: data.chainspec}).then(_chainspec => {
				chainspecName = _chainspec.name
			})
		}
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
		subtitle: chainspecName && `Chainspec: ${chainspecName}`,
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
	{:else}
		<Filterable>
			<Filters>
				<Option key='validator'>
					<Icon>find_in_page</Icon>
					<Text>Validators</Text>
				</Option>
				<Option key='full'>
					<Icon>dns</Icon>
					<Text>Full Nodes</Text>
				</Option>
			</Filters>
			
			{#each nodes as node}
				<FilterItem key={node.validator ? 'validator' : 'full'}>	
					<Node {...node}/>
				</FilterItem>
			{/each}
		</Filterable>
	{/if}
</PanelLayout>
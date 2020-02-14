<script context="module">
	import ConfigDetail from '@archetypes/Config/Detail.svelte'
	import { Drawer } from '@app/store.js';
 	let config;
 	
 	export const actions = [
 		{
			text: 'View Config',
			icon: 'code',
			callback: () => {
				 Drawer.open(ConfigDetail, 
				 	{
				 		configId: config._id
				 	}, 
				 	{
				 		title: config.name,
				 		subtitle: `chainspec.json`,
				 		//actions: ConfigDetailActions
				 	}
				 )

				console.log(configId)
			}
 		},
 		{
			text: 'Delete Network',
			icon: 'delete'
 		}
 	]
</script>

<script>
	import _ from 'lodash'
	import { awaitQuery } from '@util/graphql' 
	import PanelLayout from '@layouts/Panel.svelte'
	import NodeTeaser from '@archetypes/Node/Teaser.svelte'
	import GraphQueryWrapper from '@components/GraphQueryWrapper.svelte'
	import FilterList from '@components/FilterList.svelte'
	import Button, { Label } from '@smui/button';
	import { Icon } from '@smui/common';

	export let networkId;

	let filterOptions = [
		{
			key: 'VALIDATOR', 
			value: 'Vaildators',
			showCount: true,
			icon: 'find_in_page'

		}, 
		{
			key: 'FULL', 
			value: 'Full Nodes',
			showCount: true,
			icon: 'dns'
		}, 
		// {
		// 	key: 'TELEMETRY', 
		// 	value: 'Telemetry',
		// 	showCount: true,
		// 	icon: 'settings_input_antenna'
		// }
	];
	let filter = filterOptions.slice();

  	const query = `
 		query network($id: String!) {
 			network(id: $id) {
 				config{
 					_id
 					name
 				}
 				nodes{
 					_id
 					name
 					ip
 					provider
 					status
 					type
 				}
 			}
 		}
 	`;
</script>

<style lang="scss">
	> .mdc-linear-progress{
		position: absolute;
		top: 0;
		left: 0;
	}

	header{
		padding: 0 0 1em 0;
		display: flex;
		justify-content: space-between;
		align-items: center;

		>*{
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		.left{
			>:global(*){
				margin-right: 0.5em;
			}
		}

		.right{
			>:global(*){
				margin-left: 0.5em;
			}

			.config{
				font-weight: 100;
			}
		}
	}
</style>


<PanelLayout 
	header={{
		title: 'Config',
		actions: [
	 		{
				text: 'Add Nodes',
				icon: 'add',
	 		}
		]
	}}
	showBreadcrumbs
	>
	<GraphQueryWrapper
		query={query}
		component={NetworkDetail}
		afterInit={({refetch}) => {
			//triggerRefetch = refetch
		}}
	/>
</PanelLayout>


<!-- {#await fetchNodes()}
	<GraphQLProgress/>
{:then network}
	{config = network.config}
	<header>
		<span class="left">
			<FilterList 
				options={filterOptions}
				count={item => _.filter(network.nodes||[], {type: item.key}).length}
				on:change={({detail}) => filter = detail}
			/>
		</span>
		<span class="right">
			<Button variant='text' dense>
				<Icon class="material-icons">add</Icon> 
				<Label>Add Nodes</Label>
			</Button>
		</span>
	</header>
	{#each network.nodes as node}
		{#if _.some(filter, ['key', node.type])}
			<NodeTeaser {...node}/>
		{/if}
	{:else}
		TODO: no nodes. Add above
	{/each}
{:catch e}
	TODO: error... {e.message}
{/await}
 -->
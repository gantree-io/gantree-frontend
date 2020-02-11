<script context="module">
	import ConfigDetail from '@archetypes/Config/Detail.svelte'
	import { panel } from '@app/store.js';
 	let config;
 	
 	export const actions = [
 		{
			text: 'View Config',
			icon: 'code',
			callback: () => {
				 panel.open(ConfigDetail, 
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
	import NodeTeaser from '@archetypes/Node/Teaser.svelte'
	import GraphQLProgress from '@components/GraphQLProgress.svelte'
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
 		query network($_id: String!) {
 			network(_id: $_id) {
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

 	let fetchNodes = awaitQuery(query, {variables: {_id: networkId}})
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

{#await fetchNodes()}
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

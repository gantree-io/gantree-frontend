<script>
	import _ from 'lodash'
	import { query, gql } from '@util/graphql' 
	import NodeTeaser from '@archetypes/Node/Teaser.svelte'
	import GraphQLProgress from '@components/GraphQLProgress.svelte'
	import FilterList from '@components/FilterList.svelte'
	import Button, { Label } from '@smui/button';
	import { Icon } from '@smui/common';
	import Chip, { Set, Checkmark, Text } from '@smui/chips';

	// TESTING
	export let networkId = '111';

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
		{
			key: 'TELEMETRY', 
			value: 'Telemetry',
			showCount: true,
			icon: 'settings_input_antenna'
		}
	];
	let filter = filterOptions.slice();

  	const NODELIST = gql`
 		query nodeList($networkId: String!) {
 			nodeList(networkId: $networkId) {
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

 	let fetchNodes = query(NODELIST, {variables: {networkId: networkId}})
</script>

<script context="module">
 	export const actions = [
 		{
			text: 'Delete Network',
			icon: 'delete'
 		}
 	]
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
{:then nodes}
	<header>
		<span class="left">
			<FilterList 
				options={filterOptions}
				count={item => _.filter(nodes||[], {type: item.key}).length}
				on:change={({detail}) => filter = detail}
			/>
		</span>
		<span class="right">
			<span class="mdc-typography--caption config">Config: ecommerce-genesis-config</span>
			<Button variant='text' dense>
				<Icon class="material-icons">add</Icon> 
				<Label>Add Nodes</Label>
			</Button>
		</span>
	</header>
	{#each nodes as node}
		{#if _.some(filter, ['key', node.type])}
			<NodeTeaser {...node}/>
		{/if}
	{:else}
		TODO: no nodes. Add above
	{/each}
{:catch e}
	TODO: error... {e.message}
{/await}

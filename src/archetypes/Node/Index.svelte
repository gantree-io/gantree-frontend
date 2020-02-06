<script>
	import _ from 'lodash'
	import { query, gql } from '@util/graphql' 
	import NodeTeaser from '@archetypes/Node/Teaser.svelte'
	import GraphQLProgress from '@components/GraphQLProgress.svelte'
	import Button, { Label } from '@smui/button';
	import { Icon } from '@smui/common';
	import Chip, {Set, Checkmark, Text} from '@smui/chips';

	export let networkId = '111';

	let filterOptions = [{k: 'VALIDATOR', v: 'Vaildators'}, {k: 'FULL', v: 'Full Nodes'}, {k: 'TELEMETRY', v: 'Telemetry'}];
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

		:global(.mdc-chip){
			opacity: 1;
			border: 1px solid var(--color-highlight);
			background: transparent;
			color: var(--color-highlight);
			filter: saturate(15%) brightness(140%);
			
			&.mdc-chip--selected{
				filter: saturate(100%);
			}

			&:before{
				background: var(--color-highlight);
			}

			> :global(.material-icons){
				font-size: 1.2em;
				margin: 0 0.2em 0 0;
			}
		}

		
	}
</style>

{#await fetchNodes()}
	<GraphQLProgress/>
{:then nodes}
	
	<header>
		<span class="left">
			<Set 
				chips={filterOptions} 
				let:chip 
				key={chip => chip.k} 
				filter 
				bind:selected={filter}
				>
				{#if _.filter(nodes, {type: chip.k}).length}
					<Chip>
						<Icon class={`material-icons`}>
							{
								chip.k === 'VALIDATOR' 
									? 'find_in_page' 
									: (chip.k === 'FULL'
										? 'dns'
										: 'settings_input_antenna'
									)
							}
						</Icon>
						<Text>{chip.v} ({_.filter(nodes, {type: chip.k}).length})</Text>
					</Chip>
				{/if}
		    </Set>
			
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
		{#if _.some(filter, ['k', node.type])}
			<NodeTeaser {...node}/>
		{/if}
	{:else}
		TODO: no nodes. Add above
	{/each}
{:catch e}
	TODO: error... {e.message}
{/await}

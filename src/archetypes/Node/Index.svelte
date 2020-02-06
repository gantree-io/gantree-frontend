<script>
	import { query, gql } from '@util/graphql' 
	import NodeTeaser from '@archetypes/Node/Teaser.svelte'
	import GraphQLProgress from '@components/GraphQLProgress.svelte'
	import Button, {Label} from '@smui/button';
	import { Icon } from '@smui/common';

	export let networkId;

	console.log(networkId)

  	const NODELIST = gql`
 		query nodeList($networkId: String!) {
 			nodeList(networkId: $networkId) {
 				nodes{
 					_id
 					name
 					ip
 					provider
 					status
 				}
 			}
 		}
 	`;

 	let fetchNodes = query(NODELIST, {variables: {networkId: networkId}})
</script>

<script context="module">
 	export const actions = [
 		{
			text: 'Add Node',
			icon: 'add'
 		}
 	]
</script>

<style lang="scss">
	> .mdc-linear-progress{
		position: absolute;
		top: 0;
		left: 0;
	}
</style>

{#await fetchNodes()}
	<GraphQLProgress/>
{:then nodes}
	{#each nodes as node}
		<NodeTeaser {...node}/>
	{:else}
		TODO: no nodes. Add above
	{/each}
{:catch e}
	TODO: error... {e.message}
{/await}

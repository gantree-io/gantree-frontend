<script>
	import { query, gql } from '@util/graphql' 
	import NetworkTeaser from '@archetypes/Network/Teaser.svelte'
	import GraphQLProgress from '@components/GraphQLProgress.svelte'
	import Button, {Label} from '@smui/button';
	import { Icon } from '@smui/common';
	

  	const NETWORKLIST = gql`
 		query networkList {
 			networkList {
 				networks{
 					_id
 					name
 					nodes{
 						status
 					}
 				}
 			}
 		}
 	`;

 	let fetchNetworks = query(NETWORKLIST)

 	export const actions = [
 		{
			text: 'Create Network',
			icon: 'add'
 		}
 	]
</script>

<script context="module">
 	export const actions = [
 		{
			text: 'Add New',
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


{#await fetchNetworks()}
	<GraphQLProgress/>
{:then networks}
	{#each networks as network}
		<NetworkTeaser {...network}/>
	{:else}
		TODO: no networks. Add above
	{/each}
{:catch e}
	TODO: error... {e.message}
{/await}

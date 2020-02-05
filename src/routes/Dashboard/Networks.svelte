<script>
	import { query, gql } from '@util/graphql' 

	import NetworkTeaser from '@archetypes/Network/Teaser.svelte'
	import Button, {Label} from '@smui/button';
	import { Icon } from '@smui/common';
	import LinearProgress from '@smui/linear-progress';

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

	> .network-teaser{
		margin-bottom: 0.6em;
	}

	> .mdc-linear-progress{
		position: absolute;
		top: 0;
		left: 0;
	}
	
</style>


{#await fetchNetworks()}
	<LinearProgress progress={.5} buffer={.75} />
{:then networks}
	{#each networks as network}
		<NetworkTeaser {...network}/>
	{:else}
		No networks available. Start by adding one above.
	{/each}
{:catch e}
	Error: {e}
{/await}

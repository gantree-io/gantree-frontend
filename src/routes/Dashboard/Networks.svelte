<script>
	import { query } from '@util/graphql' 
	import { gql } from "apollo-boost";

	import NetworkTeaser from '@archetypes/Network/Teaser.svelte'
	import Button from '@components/Button.svelte'
	import Icon from '@components/Icon.svelte'

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

</script>

<style lang="scss">
	hr{
		margin: 1.2em 0;
	}

	:global(.network-teaser){
		margin-bottom: 0.7em;
	}
</style>

<section>
	<header>
		<Button small>
			<Icon type='plus'/>
			Create Network
		</Button>
	</header>
	<hr/>
	<section>
		{#await fetchNetworks()}
			<Icon type='spinner'/>
		{:then networks}
			{#each networks as network}
				<NetworkTeaser {...network}/>
			{:else}
				No networks available. Start by adding one above.
			{/each}
		{:catch e}
			{console.log(333)}
			Error: {e}
		{/await}
	</section>
</section>
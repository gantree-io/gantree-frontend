<script>
	import { query, gql } from '@util/graphql' 
	import ConfigTeaser from '@archetypes/Config/Teaser.svelte'
	import GraphQLProgress from '@components/GraphQLProgress.svelte'
	import Button, {Label} from '@smui/button';
	import { Icon } from '@smui/common';
	
  	const CONFIGS = gql`
 		query configs {
			configs{
				_id
				name
			}
 		}
 	`;

 	let fetchcConfigs = query(CONFIGS)
</script>

<script context="module">
 	export const actions = [
 		{
			text: 'Add Config',
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


{#await fetchcConfigs()}
	<GraphQLProgress/>
{:then configs}
	{#each configs as config}
		<ConfigTeaser {...config}/>
	{:else}
		TODO: no configs. Add above
	{/each}
{:catch e}
	TODO: error... {e.message}
{/await}
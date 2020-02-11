<script>
	import { query, gql } from '@util/graphql' 
	import Button, {Label} from '@smui/button';
	import { Icon } from '@smui/common';
	import ConfigTeaser from '@archetypes/Config/Teaser.svelte'
	import GraphQLProgress from '@components/GraphQLProgress.svelte'
	import Json from '@components/Json.svelte'

	export let configId;
	
  	const CONFIG = gql`
 		query config($_id: String!) {
 			config(_id: $_id) {
				_id
				name
				chainspec
 			}
 		}
 	`;

	let fetchcConfigs = query(CONFIG, {variables: {_id: configId}})
</script>

<script context="module">
 	export const actions = [
 		{
			text: 'Copy',
			icon: 'file_copy'
 		},
 		{
			text: 'Download',
			icon: 'get_app'
 		}
 	]
</script>

<style lang="scss">
</style>


{#await fetchcConfigs()}
	<GraphQLProgress/>
{:then config}
	<Json data={config.chainspec} highlight darktheme/>
{:catch e}
	TODO: error... {e.message}
{/await}
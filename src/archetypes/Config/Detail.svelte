<script>
	import { onMount } from 'svelte';
	import _ from 'lodash'
	import { close as CloseDrawer } from '@components/Drawer.svelte';
	import PanelLayout from '@layouts/Panel.svelte'
	import Button, {Label} from '@smui/button';
	import { Icon } from '@smui/common';
	import Json from '@components/Json.svelte'
	import { toast } from '@components/Toaster.svelte'
	import Hotwire from '@components/Hotwire.svelte'
	import Config, { fetchOne } from './store.js'
	import GraphQLProgress from '@components/GraphQLProgress.svelte'

	export let _id;

	let config
	const _fetchAll = () => Config.query(fetchOne, {_id: _id}).then(_config => config = _config)
	onMount(() => _fetchAll())
</script>

<style lang="scss">
</style>

<Hotwire
	subscriptions={[
		{
			event: 'CONFIG.ADD',
			callback: () => _fetchAll()
		},
		{
			event: 'CONFIG.DELETE',
			callback: () => _fetchAll()
		}
	]}
	>
	<PanelLayout 
		header={{
			title: _.get(config, 'name'),
			subtitle: 'chainspec.json',
			actions: [
		 		{
					text: 'Copy',
					icon: 'file_copy'
		 		},
		 		{
					text: 'Download',
					icon: 'get_app'
		 		}
		 	]
		}}
		>
		
		{#if !config}
			<GraphQLProgress/>
		{:else}
			<Json data={config.chainspec} highlight darktheme/>
		{/if}
	</PanelLayout>
</Hotwire>
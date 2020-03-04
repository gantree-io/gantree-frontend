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
	import Chainspec, { fetchOne } from './store.js'
	import GraphQLProgress from '@components/GraphQLProgress.svelte'

	export let _id;

	let detail
	const _fetchAll = () => Chainspec.query(fetchOne, {_id: _id}).then(chainspec => detail = chainspec)
	onMount(() => _fetchAll())
</script>

<style lang="scss">
</style>

<Hotwire
	subscriptions={[
		{
			event: 'CHAINSPEC.ADD',
			callback: () => _fetchAll()
		},
		{
			event: 'CHAINSPEC.DELETE',
			callback: () => _fetchAll()
		}
	]}
	>
	<PanelLayout 
		header={{
			title: _.get(detail, 'name'),
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
		
		{#if !detail}
			<GraphQLProgress/>
		{:else}
			<Json data={detail.chainspec} highlight darktheme/>
		{/if}
	</PanelLayout>
</Hotwire>
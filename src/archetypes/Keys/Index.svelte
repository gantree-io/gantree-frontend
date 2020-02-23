<script>
	import { onMount } from 'svelte';
	import _ from 'lodash'
	import GraphQLProgress from '@components/GraphQLProgress.svelte'
	import PanelLayout from '@layouts/Panel.svelte'
	import Keys, { fetchAll } from './store.js'
	import Hotwire from '@util/hotwire.js'
	import KeyTeaser from './Teaser.svelte'
	
	let keys

	//const _fetchAll = () => Keys.query(fetchAll).then(_keys => keys = _keys)

	onMount(async () => {
		const _fetchAll = () => Keys.query(fetchAll).then(_keys => keys = _keys)
		
		_fetchAll()

		// hotwire subscriptions
		const unwatchAdd = await Hotwire.subscribe(`KEY.ADD`, () => _fetchAll())
		const unwatchDelete = await Hotwire.subscribe(`KEY.DELETE`, () => _fetchAll())

		return () => {
			unwatchAdd()
			unwatchDelete()
		}
	})
</script>

<style>
	:global(h2){
		margin: 2em 0 1em 0;
	}

	:global(h2:first-child){
		margin-top: 0
	}
</style>

<PanelLayout 
	header={{
		title: 'Keys',
		//subtitle: _.get(team, 'name'),
		icon: 'vpn_key',
	}}
	showBreadcrumbs
	>
	<p class="mdc-typography--body1">In order to deploy blockchain nodes on your own infrastructure, Paraplant needs access to your cloud accounts.</p>
	{#if !keys}
		<GraphQLProgress/>
	{:else}
		<KeyTeaser provider="DO" name='Digital Ocean' {..._.find(keys, {provider: 'DO'})}/>
		<KeyTeaser provider="AWS" name='Amazon Web Services' {..._.find(keys, {provider: 'AWS'})}/>
		<KeyTeaser provider="GCP" name='Google Cloud Services' {..._.find(keys, {provider: 'GCP'})}/>
	{/if}
</PanelLayout>
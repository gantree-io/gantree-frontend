<script>
	import { onMount } from 'svelte';
	import _ from 'lodash'
	import GraphQLProgress from '@components/GraphQLProgress.svelte'
	import PanelLayout from '@layouts/Panel.svelte'
	import Providers, { fetchAll } from './store.js'
	import Hotwire from '@components/Hotwire.svelte'
	import Teaser from './Teaser.svelte'

	let providers

	const _fetchAll = () => Providers.query(fetchAll, {withCount: true}).then(_providers => providers = _providers)

	onMount(() => _fetchAll())
</script>

<style>
	:global(h2){
		margin: 2em 0 1em 0;
	}

	:global(h2:first-child){
		margin-top: 0
	}
</style>

<Hotwire
	subscriptions={[
		{
			name: 'CREDENTIALS',
			event: 'ADD',
			callback: () => _fetchAll()
		},
		{
			name: 'CREDENTIALS',
			event: 'DELETE',
			callback: () => _fetchAll()
		}
	]}
	>

	<PanelLayout
		header={{
			title: 'Providers',
			//subtitle: _.get(team, 'name'),
			icon: 'vpn_key',
		}}
		showBreadcrumbs
		>
		<p class="mdc-typography--body1">In order to deploy blockchain nodes on your own infrastructure, Paraplant needs access to your cloud accounts.</p>
		{#if !providers}
			<GraphQLProgress/>
		{:else}
			<Teaser provider="DO" name='Digital Ocean' {..._.find(providers, {provider: 'DO'})}/>
			<Teaser provider="AWS" name='Amazon Web Services' {..._.find(providers, {provider: 'AWS'})}/>
			<Teaser provider="GCP" name='Google Cloud Platform' {..._.find(providers, {provider: 'GCP'})}/>
		{/if}
	</PanelLayout>
</Hotwire>
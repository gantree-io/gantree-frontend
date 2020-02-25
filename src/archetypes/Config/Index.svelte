<script>
	import { onMount } from 'svelte';
	import ConfigTeaser from '@archetypes/Config/Teaser.svelte'
	import PanelLayout from '@layouts/Panel.svelte'
	import { open as openModal, close as closeModal } from '@components/Modal.svelte'
	import ConfigAdd from './Add.svelte'
	import Hotwire from '@components/Hotwire.svelte'
	import GraphQLProgress from '@components/GraphQLProgress.svelte'
	import Config, { fetchAll } from './store.js'

  	let configs
  	const _fetchAll = () => Config.query(fetchAll).then(_configs => configs = _configs)
  	onMount(() => _fetchAll())
</script>

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
			title: 'Config',
			icon: 'settings',
			actions: [
		 		{
					text: 'Add Config',
					icon: 'add',
					callback: () => {
						openModal(ConfigAdd, 
							{
								onSuccess: () => closeModal()
							}
						)
					}
		 		}
			]
		}}
		showBreadcrumbs
		>
		{#if !configs}
			<GraphQLProgress/>
		{:else}
			{#each configs as config}
				<ConfigTeaser {...config}/>
			{:else}
				...nothing 
			{/each}
		{/if}
	</PanelLayout>
</Hotwire>
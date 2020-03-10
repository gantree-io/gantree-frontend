<script>
	import GraphQLProgress from '@components/GraphQLProgress.svelte'
	import PanelLayout from '@layouts/Panel.svelte'
	import Node from '@archetypes/Node/Teaser.svelte'
	import Network, { fetchOne } from './store.js'
	import { Filterable, FilterItem, Filters, Option, Icon, Text } from '@components/Filterable'
	import Chainspec, { fetchOne as fetchOneChainspec } from '@archetypes/Chainspec/store.js'
	import { toast } from '@components/Toaster.svelte'
	import Hotwire from '@components/Hotwire.svelte'

	export let _id
	let title
	let status
	let chainspecName
	let nodes
	
	const fetch = () => Network.query(fetchOne, {_id: _id}).then(data => {
		title = data.name
		status = data.status
		nodes = data.nodes

		if(data.chainspec === 'new'){
			chainspecName = '[TODO: new]'
		}else if(data.chainspec === 'default'){
			chainspecName = '[TODO: default]'
		}else{
			Chainspec.query(fetchOneChainspec, {_id: data.chainspec}).then(_chainspec => {
				chainspecName = _chainspec.name
			})
		}
	})

	fetch()
</script>

<style lang="scss">
	:global(.filter-list){
		margin-bottom: 1em;
	}

	.mdc-typography--caption.-status{
		&[data-status='DEPLOYING']{ color: var(--color-status-warning) }
		&[data-status='ONLINE']{ color: var(--color-status-success) }
		&[data-status='SHUTDOWN']{ color: var(--color-status-error) }
	}
</style>

<Hotwire
	subscriptions={[
		{
			name: _id,
			event: 'UPDATE',
			callback: data => {
				console.log(data)
				fetch(data)
			}
		}
	]}
	>
	<PanelLayout 
		header={{
			title: title,
			subtitle: chainspecName && `Chainspec: ${chainspecName}`,
			actions: [
		 		{
					text: 'Add Nodes',
					icon: 'add',
					callback: () => toast.notification(`Feature coming soon`)
		 		}
		 	]
		}}
		>
		{#if !nodes}
			<GraphQLProgress/>
		{:else}
			<Filterable>
				<Filters>
					<Option key='validator'>
						<Icon>find_in_page</Icon>
						<Text>Validators</Text>
					</Option>
					<Option key='full'>
						<Icon>dns</Icon>
						<Text>Full Nodes</Text>
					</Option>
				</Filters>
				
				{#each nodes as node}
					<FilterItem key={node.validator ? 'validator' : 'full'}>	
						<Node {...node}/>
					</FilterItem>
				{/each}
			</Filterable>
		{/if}

		<span class="mdc-typography--caption -status" data-status={status} slot='info'>Network status: {status}</span>
	</PanelLayout>
</Hotwire>
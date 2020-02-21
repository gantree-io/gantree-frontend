<script>
	import PubSub from 'pubsub-js'
	import config from './actions.js' 
	import { close as CloseDrawer } from '@components/Drawer.svelte';
	import GraphQueryWrapper from '@components/GraphQueryWrapper.svelte'
	import PanelLayout from '@layouts/Panel.svelte'
	import Button, {Label} from '@smui/button';
	import { Icon } from '@smui/common';
	import Json from '@components/Json.svelte'
	import { toast } from '@components/Toaster.svelte'

	export let configId;

	let title = '';
	let chainspec = '234';
	
	const query = `
		query config($id: String!) {
			config(id: $id) {
				_id
				name
				chainspec
			}
		}
	`;
</script>

<style lang="scss">
</style>

<PanelLayout 
	header={{
		title: title,
		subtitle: 'chainspec.json',
		actions: [
	 		{
				text: 'Copy',
				icon: 'file_copy'
	 		},
	 		{
				text: 'Download',
				icon: 'get_app'
	 		},
	 		{
				text: 'Delete',
				icon: 'delete',
				callback: () => {
					config.delete(configId)
						.then(result => {
							toast.warning(`Config deleted`)
							CloseDrawer()
							PubSub.publish('CONFIG.DELETE');
						})

				}
	 		}
	 	]
	}}
	>
	<GraphQueryWrapper
		query={query}
		variables={{
			id: configId
		}}
		component={Json}
		props={{
			highlight: true,
			darktheme: true,
			data: chainspec
		}}
		afterInit={({refetch, data}) => {
			//triggerRefetch = refetch
			title = data.name
			chainspec = data.chainspec
		}}
	/>
</PanelLayout>
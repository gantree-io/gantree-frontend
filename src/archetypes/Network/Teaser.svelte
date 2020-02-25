<script>
	import Paper, { Title } from '@smui/paper';
	import { Icon } from '@smui/common';
	import Menu from '@smui/menu';
	import List, {Item, Text, Separator, Graphic} from '@smui/list';
	import IconButton, { Icon as IconButtonIcon } from '@smui/icon-button';
	import { open as OpenDrawer } from '@components/Drawer.svelte';
	import Badge from '@components/Badge.svelte'
	import NetworkDetail from './Detail.svelte'
	import Hotwire from '@components/Hotwire.svelte'
	import { toast } from '@components/Toaster.svelte'
	import { dialog } from '@components/Dialog.svelte'
	import Network, { deleteNetwork } from './store.js'

	export let _id = null
	export let name = null

	let onlineCount = 0
	let pendingCount = 0
	let offlineCount = 0
	let menu;
	let menuAnchor;
</script>

<style lang="scss">
	:global(.network-teaser.smui-paper){
		background-color: var(--color-dark-grey);
		color: var(--color-light);
		display: flex;
		justify-content: space-between;
		align-items: center;
		cursor: pointer;
		transition: all 0.2s ease-in-out;
		margin-bottom: 0.6em;

		* :global(.smui-paper__title){
			margin: 0;
			display: flex;
			align-items: center;
		}

		* :global(.badge){
			display: inline-flex;
			margin-left: 0.5em;

			:global(.value){
				color: var(--color-dark)
			}

			:global(.label){
				text-transform: uppercase;
				color: var(--color-grey)
			}
		}

		.controls{
			display: flex;
			align-items: center;
		}

		&:hover{
			background-color: var(--color-dark);
			box-shadow: none
		}
	}
</style>

<Hotwire
	subscriptions={[
		{
			event: `${_id}.NODESTATUS`,
			callback: ({nodes}) => {
				onlineCount = nodes.online
				pendingCount = nodes.pending
				offlineCount = nodes.offline
			}
		}
	]}
	>
	<Paper class='network-teaser' on:click={() => OpenDrawer(NetworkDetail, {_id: _id})} elevation="4">
		<div>
			<Title><Icon class="material-icons">blur_on</Icon>&nbsp;{name}</Title>
		</div>
		<div class='controls'>
			<Badge value={onlineCount} success disabled={!onlineCount}/>
			<Badge value={pendingCount} warning disabled={!pendingCount}/>
			<Badge value={offlineCount} error disabled={!offlineCount}/>

			<div 
				class='menu' 
				bind:this={menuAnchor} 
				on:click={e => {
					e.preventDefault()
					e.stopPropagation()
				}}
				>
				<IconButton on:click={() => menu.setOpen(true)}>
					<IconButtonIcon class="material-icons">menu</IconButtonIcon>
				</IconButton>
				<Menu 
					bind:this={menu} 
					bind:anchorElement={menuAnchor} 
					anchorCorner="BOTTOM_LEFT"
					>
					<List dense>
						<Item 
							on:click={e => {
								e.preventDefault()
								e.stopPropagation()
								dialog.warning({
									title: "Confirm network deletion",
									subtitle: 'Deleting this network will remove the network and all nodes. This cannot be undone',
									confirmButton: 'Confirm Network Deletion',
									onConfirm: () => Network.query(deleteNetwork, {_id: _id}).then(() => toast.success(`Network deleted`)),
									cancelButton: 'Take me back!',
									confirmWord: 'DELETE'
								})
							}}
							>
							<Graphic class="material-icons">delete</Graphic>
							<Text>Delete</Text>
						</Item>
					</List>
				</Menu>
			</div>
		</div>
	</Paper>
</Hotwire>
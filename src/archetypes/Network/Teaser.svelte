<script>
	import _ from 'lodash'
	import Paper, { Title, Subtitle, Content  } from '@smui/paper';
	import { Icon } from '@smui/common';
	import Menu from '@smui/menu';
	import List, {Item, Text, Separator, Graphic} from '@smui/list';
	import IconButton, { Icon as IconButtonIcon } from '@smui/icon-button';
	import Chainspec, { fetchOne as fetchOneChainspec } from '@archetypes/Chainspec/store.js'
	import { open as OpenDrawer } from '@components/Drawer.svelte';
	import Badge from '@components/Badge.svelte'
	import NetworkDetail from './Detail.svelte'
	import Hotwire from '@components/Hotwire.svelte'
	import Pender from '@components/Pender.svelte'
	import { toast } from '@components/Toaster.svelte'
	import { dialog } from '@components/Dialog.svelte'
	import Network, { fetchOneTeaser, deleteOne } from './store.js'

	export let _id = null

	let name
	let status
	let nodeCount
	let deployingCount = 0
	let onlineCount = 0
	let shutdownCount = 0
	let errorCount = 0
	let menu;
	let menuAnchor;
	let chainspecName = 'Loading chainspec...'

	const handleUpdate = props => {
		name = props.name
		status = props.status
		nodeCount = props.nodes ? props.nodes.length : 0

		deployingCount = _.filter(props.nodes, {status: "DEPLOYING"}).length + _.filter(props.nodes, {status: "CONFIGURING"}).length
		onlineCount = _.filter(props.nodes, {status: "ONLINE"}).length
		shutdownCount = _.filter(props.nodes, {status: "SHUTDOWN"}).length
		errorCount = _.filter(props.nodes, {status: "ERROR"}).length

		if(props.chainspec === 'new'){
			chainspecName = 'New Chainspec'
		}else if(props.chainspec === 'default'){
			chainspecName = 'Default Chainspec'
		}else{
			Chainspec.query(fetchOneChainspec, {_id: props.chainspec}).then(_chainspec => {
				chainspecName = _chainspec.name
			})
		}
	}

	// fetch network
	Network.query(fetchOneTeaser, {_id: _id}).then(handleUpdate)
</script>

<style lang="scss">
	:global(.network-teaser.smui-paper){
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

		&[data-status='DEPLOYING']{
			.title{
				:global(.smui-paper__content > .status){ color: var(--color-white) }
			}
		}

		&[data-status='CONFIGURING']{
			.title{
				:global(.smui-paper__content > .status){ color: var(--color-status-warning) }
			}
		}

		&[data-status='ONLINE']{
			.title{
				:global(.smui-paper__content > .status){ color: var(--color-status-success) }
			}
		}

		&[data-status='DEPLOYING'],
		&[data-status='SHUTDOWN']{
			filter: contrast(0.6);
			pointer-events: none;
			cursor: not-allowed;
			box-shadow: none;
		}

		&[data-status='SHUTDOWN'],
		&[data-status='ERROR']{
			.title{
				:global(.smui-paper__content > .status){ color: var(--color-status-error) }
			}
		}
	}
</style>

<Hotwire
	subscriptions={[
		{
			name: _id,
			event: `NODESTATUS`,
			callback: ({nodes}) => {
				deployingCount = nodes.DEPLOYING + nodes.CONFIGURING
				onlineCount = nodes.ONLINE
				shutdownCount = nodes.SHUTDOWN
				errorCount = nodes.ERROR
			}
		},
		{
			name: _id,
			event: `UPDATE`,
			callback: handleUpdate
		}
	]}
	>
	<Paper class='network-teaser' on:click={() => OpenDrawer(NetworkDetail, {_id: _id})} elevation="0" data-status={status}>
		<div class='title'>
			<Title>
				<Icon class="material-icons">blur_on</Icon>&nbsp;
				<Pender val={name}/>
			</Title>
			<Content>
				<span class="status">{status}</span>
				<div class="mdc-typography--caption">{chainspecName}</div>
			</Content>
		</div>

		<div class='controls'>
			<div class={`mdc-typography--caption`}>
				<Pender val={nodeCount}/> node{nodeCount > 1 ? 's' : ''}
			</div>

			<Badge value={deployingCount} neutral disabled={!deployingCount}/>
			<Badge value={onlineCount} success disabled={!onlineCount}/>
			<Badge value={shutdownCount} warning disabled={!shutdownCount}/>
			<Badge value={errorCount} error disabled={!errorCount}/>

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
									onConfirm: () => Network.query(deleteOne, {_id: _id}).then(() => toast.success(`Network pending deletion`)),
									cancelButton: 'Take me back!',
									confirmWord: 'DELETE'
								})
							}}
							>
							<Graphic class="material-icons">delete</Graphic>
							<Text>Delete Network</Text>
						</Item>
					</List>
				</Menu>
			</div>
		</div>
	</Paper>
</Hotwire>
<script>
	import Paper, { Title } from '@smui/paper';
	import Badge from '@components/Badge.svelte'
	import { Icon } from '@smui/common';
	import { open as OpenDrawer } from '@components/Drawer.svelte';
	import NetworkDetail from './Detail.svelte'
	import Hotwire from '@components/Hotwire.svelte'

	export let _id = null
	export let name = null

	let onlineCount = 0
	let pendingCount = 0
	let offlineCount = 0
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
			margin-left: 1em;

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
			<Badge value={onlineCount} label='Online' success disabled={!onlineCount}/>
			<Badge value={pendingCount} label='Pending' warning disabled={!pendingCount}/>
			<Badge value={offlineCount} label='Offline' error disabled={!offlineCount}/>
		</div>
	</Paper>
</Hotwire>
<script>
	import { onMount, onDestroy } from 'svelte';
	import _ from 'lodash'
	import Paper, { Title } from '@smui/paper';
	import Badge from '@components/Badge.svelte'
	import { Icon } from '@smui/common';
	import { Drawer } from '@app/store.js';

	//import NodeIndex, { actions } from '@archetypes/Node/Index.svelte'
	import NetworkDetail from './Detail.svelte'
	import NetworkStore from './store.js'

	export let _id = null
	export let name = null

	let onlineCount = 0
	let pendingCount = 0
	let offlineCount = 0
	
	let statusSubscription
	onMount(async () => {
		statusSubscription = await NetworkStore.subscribe(_id, `STATUS`, ({nodes}) => {
		 	onlineCount = nodes.online
		 	pendingCount = nodes.pending
		 	offlineCount = nodes.offline
		 })
	})

	onDestroy(() => {
		NetworkStore.unsubscribe(statusSubscription)
	})
</script>

<style lang="scss">
	:global(.team-teaser.smui-paper){
		background-color: var(--color-dark-grey);
		color: var(--color-light);
		display: flex;
		justify-content: space-between;
		align-items: center;
		//transition: all 0.2s ease-in-out;
		margin-bottom: 0.6em;
		padding: 16px 12px;

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

		/*&:hover{
			background-color: var(--color-dark);
			box-shadow: none
		}*/
	}
</style>

<Paper class='team-teaser' on:click={() => Drawer.open(NetworkDetail, {_id: _id})} elevation="4">
	<div>
		<Title><Icon class="material-icons">blur_on</Icon>&nbsp;{name}</Title>
	</div>
	<div class='controls'>
		<Badge value={onlineCount} label='Online' success disabled={!onlineCount}/>
		<Badge value={pendingCount} label='Pending' warning disabled={!pendingCount}/>
		<Badge value={offlineCount} label='Offline' error disabled={!offlineCount}/>
	</div>
</Paper>
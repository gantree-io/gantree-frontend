<script>
	import _ from 'lodash'
	import Paper, { Title } from '@smui/paper';
	import Badge from '@components/Badge.svelte'
	import { Icon } from '@smui/common';
	import { Drawer } from '@app/store.js';

	//import NodeIndex, { actions } from '@archetypes/Node/Index.svelte'
	import NetworkDetail from './Detail.svelte'

	export let _id = null
	export let name = null
	export let nodes = []

	const countStatus = status => _.filter(nodes, node => node.status === status).length

	const onlineCount = countStatus('ONLINE')
	const pendingCount = countStatus('PENDING')
	const offlineCount = countStatus('OFFLINE')

	const handleClick = () => {
		Drawer.open(NetworkDetail, {_id: _id})
	}
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

<Paper class='network-teaser' on:click={handleClick} elevation="4">
	<div>
		<Title><Icon class="material-icons">blur_on</Icon>&nbsp;{name}</Title>
	</div>
	<div class='controls'>
		<Badge value={onlineCount} label='Online' success disabled={!onlineCount}/>
		<Badge value={pendingCount} label='Pending' warning disabled={!pendingCount}/>
		<Badge value={offlineCount} label='Offline' error disabled={!offlineCount}/>
	</div>
</Paper>
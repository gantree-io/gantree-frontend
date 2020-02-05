<script>
	import _ from 'lodash'
	import Paper, { Title } from '@smui/paper';
	import Badge from '@components/Badge.svelte'
	import { Icon } from '@smui/common';
	import { panel } from '@app/store.js';

	import Networks from '@routes/Dashboard/Networks.svelte'

	export let _id = null
	export let name = null
	export let nodes = []

	const countStatus = status => _.filter(nodes, node => node.status === status).length

	const onlineCount = countStatus('ONLINE')
	const pendingCount = countStatus('PENDING')
	const offlineCount = countStatus('OFFLINE')
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

<Paper class='network-teaser' on:click={() => panel.open(Networks, {value: 123, label: 'testing'})} elevation="4" title={`${name} | ID: ${_id} | Created: 08 Sep 2019 | Current Block: 29,914 | 3 Seconds Ago`}>
	<div>
		<Title><Icon class="material-icons">storage</Icon>&nbsp;{name}</Title>
	</div>
	<div class='controls'>
		<Badge value={onlineCount} label='Online' success disabled={!onlineCount}/>
		<Badge value={pendingCount} label='Pending' warning disabled={!pendingCount}/>
		<Badge value={offlineCount} label='Offline' error disabled={!offlineCount}/>
	</div>
</Paper>
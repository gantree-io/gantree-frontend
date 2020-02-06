<script>
	import _ from 'lodash'
	import Paper, { Title } from '@smui/paper';
	import Badge from '@components/Badge.svelte'
	import { Icon } from '@smui/common';
	import { panel } from '@app/store.js';

	export let _id;
	export let name;
	export let ip;
	export let provider;
	export let status;

	const icon = status === 'ONLINE'
		? 'offline_bolt'
		: (status === 'PENDING'
			? 'settings'
			: 'error'
		)

	//const countStatus = status => _.filter(nodes, node => node.status === status).length
	// const onlineCount = countStatus('ONLINE')
	// const pendingCount = countStatus('PENDING')
	// const offlineCount = countStatus('OFFLINE')
</script>

<style lang="scss">
	@keyframes spin { 100% { transform:rotate(360deg) } }

	:global(.node-teaser.smui-paper){
		background-color: var(--color-dark-grey);
		color: var(--color-light);
		display: flex;
		justify-content: space-between;
		align-items: center;
		cursor: pointer;
		transition: all 0.2s ease-in-out;
		margin-bottom: 0.6em;
		border-left: 4px solid var(--color-status-neutral);		

		>.title{
			:global(.smui-paper__title) {
				margin: 0;
				display: flex;
				align-items: center;
			}
		}

		.info{
			>span{
				display: block;
				text-align: right;
				line-height: 1.3em;
				font-weight: 100;
			}
		}

		&:hover{
			background-color: var(--color-dark);
			box-shadow: none
		}
		

		/* status colours */
		&[data-status='online']{ 
			border-left-color: var(--color-status-success);
			>.title :global(.material-icons.status){
				color: var(--color-status-success)
			}
		}
		&[data-status='pending']{ 
			border-left-color: var(--color-status-warning);
			>.title :global(.material-icons.status){
				color: var(--color-status-warning);
				opacity: 0.6;
				filter: saturate(40%);
				animation: spin 10s linear infinite;
			}
		}
		&[data-status='offline']{ 
			border-left-color: var(--color-status-error);
			>.title :global(.material-icons.status){
				color: var(--color-status-error)
			}
		}
	}
</style>

<Paper class='node-teaser' data-status={status.toLowerCase()} elevation="4">
	<div class='title'>
		<Title>
			<Icon class={`material-icons`}>dns</Icon>
			&nbsp;{name}
			&nbsp;<Icon class={`material-icons status`}>{icon}</Icon>
		</Title>
	</div>
	<div class='info'>
		<span class="mdc-typography--caption">IP: {ip} ({provider})</span>
		<span class="mdc-typography--caption">Current Block: 29,356</span>
		<span class="mdc-typography--caption">Last Updated: 8 seconds ago</span>

		<!-- <Badge value={onlineCount} label='Online' success disabled={!onlineCount}/>
		<Badge value={pendingCount} label='Pending' warning disabled={!pendingCount}/>
		<Badge value={offlineCount} label='Offline' error disabled={!offlineCount}/> -->
	</div>
</Paper>
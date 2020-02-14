<script>
	import _ from 'lodash'
	import Paper, { Title, Subtitle } from '@smui/paper';
	import Badge from '@components/Badge.svelte'
	import { Icon } from '@smui/common';

	//export let _id;
	export let name;
	export let ip;
	export let provider;
	export let status;
	export let type;

	const icon = status === 'ONLINE'
		? 'offline_bolt'
		: (status === 'PENDING'
			? 'settings'
			: 'error'
		)
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
			display: flex;
			align-items: center;
			:global(.smui-paper__title) {
				margin: 0 0.3em;
				display: flex;
				align-items: center;

				> :global(.mdc-typography--caption){
					opacity: 0.5;
					display: flex;
					align-items: center;
					margin-left: 1.5em;

					> :global(.material-icons){
						font-size: 1.6em;
						margin: 0 0.2em;
					}

				}
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
		<Icon class={`material-icons status`}>{icon}</Icon>

		<Title>
			{name}
			<span class="mdc-typography--caption">
				<Icon class={`material-icons`}>
					{
						type === 'VALIDATOR' 
							? 'insert_chart_outlined' 
							: (type === 'FULL'
								? 'insert_chart'
								: 'help_outline'
							)
					}
				</Icon>
				{type}
			</span>
		</Title>
		
	</div>
	<div class='info'>
		<span class="mdc-typography--caption">IP: {ip} ({provider})</span>
		<span class="mdc-typography--caption">Current Block: 29,356</span>
		<span class="mdc-typography--caption">Last Updated: 8 seconds ago</span>
	</div>
</Paper>
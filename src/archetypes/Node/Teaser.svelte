<script>
	import { onMount } from 'svelte';
	import _ from 'lodash'
	import Paper, { Title, Subtitle, Content } from '@smui/paper';
	import Menu from '@smui/menu';
	import List, {Item, Text, Separator, Graphic} from '@smui/list';
	import IconButton, { Icon as IconButtonIcon } from '@smui/icon-button';
	import Badge from '@components/Badge.svelte'
	import { Icon } from '@smui/common';
	import Hotwire from '@components/Hotwire.svelte'
	import moment from 'moment'

	//const moment = require('moment')

	export let _id;
	export let name;
	export let ip;
	export let provider;
	export let status;
	export let validator;

	let block = 29356
	let updated = moment().format("HH:mm:ss")
	let tick = 0
	let menu;
	let menuAnchor;

	// need to define props/colors based on status
	const statusOptions = {
		DEPLOYING: {
			icon: 'settings',
			color: 'notification'
		},
		ONLINE: {
			icon: 'offline_bolt',
			color: 'success'
		},
		SHUTDOWN: {
			icon: 'settings',
			color: 'neutral'
		},
		ERROR: {
			icon: 'error',
			color: 'error'
		}
	}

	let statusProps = statusOptions['DEPLOYING']

	const updateNodeProps = props => {
		name = props.name;
		ip = props.ip;
		provider = props.provider;
		status = props.status;
		validator = props.validator;

		statusProps = statusOptions[props.status]
	}

	onMount(() => {
		statusProps = statusOptions[status]

		// TODO: Connect to IP/Telemetry? and start ingesting block data
		let _TESTING = setInterval(() => {
			block = block + 1
			updated = moment().format("HH:mm:ss")
			tick = tick === 0 ? 1 : 0 // tick allows for animation on data change
		}, 2500 + Math.random() * Math.floor(5000))

		return () => clearInterval(_TESTING)
		// -----------------------
	})
</script>

<style lang="scss">
	@keyframes tick0 {
		0% {color: var(--color-status-success)}
		100% {color: var(--color-status-warning)}
	}

	@keyframes tick1 {
		0% {color: var(--color-status-success)}
		100% {color: var(--color-status-warning)}
	}

	:global(.node-teaser.smui-paper){
		border-left: 4px solid var(--color-status-neutral);	

		.controls{
			.info {
				margin-right: 1em;
				
				> span{
					display: block;
					text-align: right;
					line-height: 1.3em;
					font-weight: 100;
				}

				&[data-tick="0"] > span.-updated{
					animation-name: tick0;
					animation-duration: 10000ms;
					animation-timing-function: linear;
					animation-fill-mode: forwards;
				}

				&[data-tick="1"] > span.-updated{
					animation-name: tick1;
					animation-duration: 10000ms;
					animation-timing-function: linear;
					animation-fill-mode: forwards;
				}
			}
		}

		/* status colours */
		&[data-status='online']{}
		&[data-status='deploying'],
		&[data-status='shutdown']{ 
			>.title :global(.material-icons.status){
				opacity: 0.6;
				filter: saturate(40%);
				animation-name: spin;
				animation-duration: 3000ms;
				animation-timing-function: linear;
				animation-fill-mode: forwards;
				animation-iteration-count: infinite
			}
		}
		&[data-status='shutdown']{
			opacity: 0.8;
			filter: saturate(70%);
			pointer-events: none;
			cursor: not-allowed;
		}
		&[data-status='error']{}
		
	}
</style>

<Hotwire
	subscriptions={[
		{
			name: _id,
			event: `UPDATE`,
			callback: updateNodeProps
		}
	]}>
	<Paper class='node-teaser' data-status={status.toLowerCase()} style={`border-left-color: var(--color-status-${statusProps.color})`} elevation="0">
		<div class='title'>
			<Icon class={`material-icons status`} style={`color: var(--color-status-${statusProps.color})`}>{statusProps.icon}</Icon>
			{#if name}<Title>{name}</Title>{/if}
			<Content>
				<Icon class={`material-icons`}>
					{validator ? 'insert_chart_outlined' : 'insert_chart'}
				</Icon>
				<span>
					{validator ? 'Validator' : 'Full Node'}
				</span>
			</Content>
		</div>

		<div class='controls'>
			<div class="info" data-tick={tick}>
				<span class="mdc-typography--caption -ip">IP: {ip} ({provider})</span>
				<span class="mdc-typography--caption -block">Current Block: {block}</span>
				<span class="mdc-typography--caption -updated">Last Updated: {updated}</span>
			</div>

			<div class='menu' bind:this={menuAnchor}>
				<IconButton on:click={() => menu.setOpen(true)}>
					<IconButtonIcon class="material-icons">menu</IconButtonIcon>
				</IconButton>
				<Menu 
					bind:this={menu} 
					bind:anchorElement={menuAnchor} 
					anchorCorner="BOTTOM_LEFT"
					>
					<List dense>
						<Item>
							<Graphic class="material-icons">delete</Graphic>
							<Text>Delete node</Text>
						</Item>
					</List>
				</Menu>
			</div>
		</div>
	</Paper>
</Hotwire>
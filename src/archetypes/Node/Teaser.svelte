<script>
	import { onMount } from 'svelte';
	import { writable, get } from 'svelte/store'
	import _ from 'lodash'
	import Paper, { Title, Subtitle, Content } from '@smui/paper';
	import Menu from '@smui/menu';
	import List, {Item, Text, Separator, Graphic} from '@smui/list';
	import IconButton, { Icon as IconButtonIcon } from '@smui/icon-button';
	import Badge from '@components/Badge.svelte'
	import { Icon } from '@smui/common';
	import Hotwire from '@components/Hotwire.svelte'
	import Tooltip from '@components/Tooltip.svelte'
	import moment from 'moment'
	import copy from 'copy-to-clipboard'
	import { FeedMessage } from '@dotstats'
	const { Actions } = FeedMessage
	// import { WsProvider } from '@polkadot/api';

	const utf8decoder = new TextDecoder('utf-8');

	export let _id;
	export let name;
	export let ip;
	export let provider;
	export let status;
	export let validator;

	let cpu = writable([])
	let mem = writable([])
	let chartstamps = writable([])


	let block = 0
	let updated = moment().format("HH:mm:ss")
	let tick = 0
	let menu;
	let menuAnchor;
	let copied = false

	// need to define props/colors based on status
	const statusOptions = {
		DEPLOYING: {
			icon: 'settings',
			color: 'notification'
		},
		CONFIGURING: {
			icon: 'settings',
			color: 'warning'
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

	const copyIp = () => {
		copy(ip)
		copied = true
		setTimeout(() => copied = false, 1500)
	}

	onMount(async () => {
		statusProps = statusOptions[status]

		const ws = new WebSocket(`ws://${ip}:8000/feed`)
		ws.onopen = (e, d) => {
			// need to find the name of the network, might be something we have to
			// claw from ansible?
			ws.send(`subscribe:Local Testnet`);
		}

		ws.onmessage = (msg) => {
			const reader = new FileReader();
			reader.addEventListener('loadend', () => {
				// reader.result contains the contents of blob as a typed array
				const str = ab2str(reader.result)
				const d = FeedMessage.deserialize(str)
				parseMessages(d)
			});
			reader.readAsArrayBuffer(msg.data);
		}

		return () => ws.close()
	})

	// will want to factor this out into a telemetry page at some stage
	function parseMessages(msgs) {
		for (let msg of msgs) {
			switch (msg.action) {
				case Actions.FinalizedBlock: {
					const [id, height, hash] = msg.payload;
					block = height
					updated = moment().format("HH:mm:ss")
					tick = tick === 0 ? 1 : 0 // tick allows for animation on data change
					break
				}
				case Actions.FeedVersion: {
					break
				}

				case Actions.BestBlock: {
					break
				}

				case Actions.BestFinalized: {
					break
				}

				case Actions.AddedNode: {
					break
				}

				case Actions.RemovedNode: {
					break
				}

				case Actions.LocatedNode: {
					break
				}

				case Actions.ImportedBlock: {
					break
				}

				case Actions.FinalizedBlock: {
					break
				}

				case Actions.NodeStats: {
					break
				}

				case Actions.NodeHardware: {
					// const [id, nodeHardware] = msg.payload;
					// let [memory, cpuuse, , , timestamps] = nodeHardware;
					break
				}
				case Actions.TimeSync: {
					break
				}

				case Actions.AddedChain: {
					break
				}

				case Actions.RemovedChain: {
					break
				}

				case Actions.SubscribedTo: {
					break
				}

				case Actions.UnsubscribedFrom: {
					break
				}

				case Actions.Pong: {
					break
				}

				case Actions.AfgFinalized: {
					break
				}

				case Actions.AfgReceivedPrevote: {
					break
				}

				case Actions.AfgReceivedPrecommit: {
					break
				}

				case Actions.AfgAuthoritySet: {
					break
				}

				case Actions.StaleNode: {
					break
				}

				case Actions.NodeIO: {
					break
				}

				default:
					console.log('No Case Match')
			}
		}
	}

	function ab2str(buf) {
		return String.fromCharCode.apply(null, new Uint8Array(buf));
	}
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
		&[data-status='configuring'],
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
		&[data-status='deploying'],
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
				<Tooltip text={copied ? 'Copied' : 'Click to copy'} class="info">
					<span class="mdc-typography--caption -ip" on:click={copyIp}>IP: {ip} ({provider})</span>
				</Tooltip>
				<span class="mdc-typography--caption -block">Current Block: {block || 'Not yet started'}</span>
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
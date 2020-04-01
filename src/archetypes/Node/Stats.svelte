<script>
	import { onMount } from 'svelte';
	import { Icon } from '@smui/common';
	import Grid, { Row as GridRow } from '@components/Grid'
	import { MemoryUsage, CPUUsage, BytesPerSecond } from '@components/Graph'
	import Telemetry from '@util/telemetry' 
	
	export let ip;

	let NodeName
	let NetworkId
	let BlockNumber
	let BlockHash
	let PeerCount

	const handleUpdate = data => {
		BlockNumber = data.BlockNumber
		BlockHash = data.BlockHash
	}

	onMount(async () => {
		let telemetry = new Telemetry(ip)
		
		telemetry.listen('AddedNode', console.log)

		telemetry.listen('AddedNode', ({NodeDetails, NodeStats, BlockDetails}) => {
			NodeName = `${NodeDetails.NodeName} (${NodeDetails.NodeImplementation})`
			NetworkId = NodeDetails.NetworkId
			BlockNumber = BlockDetails.BlockNumber
			BlockHash = BlockDetails.BlockHash
			PeerCount = NodeStats.PeerCount
		})

		telemetry.listen('FinalizedBlock', data => {
			BlockNumber = data.BlockNumber
			BlockHash = data.BlockHash
		})
		return () => telemetry.close()
	})
</script>

<style lang="scss">
	.telemetry{
		.-block{
			p{
				display: flex;
				align-items: center;
				margin: 0.3em 0;
				font-size: var(--font-size-medium);
				color: var(--color-theme-xlight);
				
				>span{
					display: flex;
					align-items: center;
					font-size: var(--font-size-xsmall);
					text-transform: uppercase;
					color: var(--color-theme-light);
					margin-right: 0.5em;

					:global(.material-icons){
						margin-right: 0.2em;
					}
				}

				:global(.material-icons){
					font-size: 1em;
				}
			}
		}
	}
</style>

<Grid class="telemetry">
	<GridRow>
		<div class='-block'>
			<p>
				<span><Icon class={`material-icons`}>dns</Icon> Node Name: </span>
				{#if NodeName}
					{NodeName}
				{:else}
					<Icon class={`material-icons -loading`}>autorenew</Icon>
				{/if}
			</p>
			<p>
				<span><Icon class={`material-icons`}>nfc</Icon> Current Block #: </span>
				{#if BlockNumber}
					{BlockNumber}
				{:else}
					<Icon class={`material-icons -loading`}>autorenew</Icon>
				{/if}
			</p>
			<p>
				<span><Icon class={`material-icons`}>grain</Icon> Block Hash:</span>
				{#if BlockHash}
					{BlockHash}
				{:else}
					<Icon class={`material-icons -loading`}>autorenew</Icon>
				{/if}
			</p>
			<p>
				<span><Icon class={`material-icons`}>track_changes</Icon> Peer Count:</span>
				{#if PeerCount}
					{PeerCount}
				{:else}
					<Icon class={`material-icons -loading`}>autorenew</Icon>
				{/if}
			</p>
		</div>
	</GridRow>
	<GridRow>
		<MemoryUsage ip={ip}/>
		<CPUUsage ip={ip}/>
		<BytesPerSecond ip={ip}/>
	</GridRow>
</Grid>

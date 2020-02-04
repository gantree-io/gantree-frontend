<script>
	import _ from 'lodash'
	//import Button, {Label} from '@smui/button';
	import Badge from '@components/Badge.svelte'
	import Icon from '@components/Icon.svelte'

	export let _id = null
	export let name = null
	export let nodes = []
	export let handleClick = () => {
		console.log(_id)
	}

	const countStatus = status => _.filter(nodes, node => node.status === status).length

	const onlineCount = countStatus('ONLINE')
	const pendingCount = countStatus('PENDING')
	const offlineCount = countStatus('OFFLINE')
</script>

<style lang="scss">
	.network-teaser{
		background: var(--color-light-grey);
		padding: 1.5em 2em;
		display: flex;
		justify-content: space-between;
		align-items: center;
		cursor: pointer;
	
		h1{
			font-size: var(--font-size-medium);
			margin: 0;
		}

		:global(.badge){
			display: inline-flex;
			margin: 0.3em;
			font-size: 11px;
			
			:global(>.label){
				text-transform: uppercase;
				
				color: var(--color-mid-grey)
			}
		}

		&:hover{
			filter: contrast(108%);
		}
	}
</style>

<article class='network-teaser' on:click={handleClick}>
	<div>
		<h1><Icon type='network'/> {name}</h1>
	</div>
	<div>
		{#if onlineCount}<Badge value={onlineCount} label='Online' success/>{/if}
		{#if pendingCount}<Badge value={pendingCount} label='Pending' warning/>{/if}
		{#if offlineCount}<Badge value={offlineCount} label='Offline' error/>{/if}
	</div>
</article>
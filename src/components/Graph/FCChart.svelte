<script>
	import Chart from 'chart.js';
	import uuid from 'uuid/v4'
	import { Icon } from '@smui/common';
	
	export let title
	export let type
	export let data
	export let options = {}
	
	let loading = true
	const id = uuid()

	$:{
		if(type && data){
			let el = document.querySelector(`canvas[data-id='${id}']`)
			
			const chart = new Chart(el, {
				type: type, 
				data: data, 
				options: options
			})

			loading = true
			setTimeout(() => loading = false, 1000)
		}
	}
</script>

<style lang="scss">
	.-graph{
		background: rgba(255,255,255,0.1);
		padding: 1em;

		.title{
			font-size: var(--font-size-xxsmall, 12px);
			text-transform: uppercase;
			color: rgba(255,225,255,0.6);
			margin-top: -0.5em;
			display: flex;
			align-items: center;
			justify-content: space-between;

			:global(.material-icons){
				font-size: 1em;
				opacity: 0.8;
			}
		}
	}
</style>

<div class={`-graph ${$$props.class||''}`}>
	{#if title}
		<span class='title'>
			{title}
			{#if loading}
				<Icon class={`material-icons -loading`}>autorenew</Icon>
			{/if}
		</span>
	{/if}
	<canvas data-id={id}/>
</div>
<!--
	Expanda, not to be confused with an ex-Panda
-->

<script>
	import { Icon } from '@smui/common';

	export let openTrigger = {text: 'More'}
	export let closeTrigger = {text: 'Less'}
	export let waitingTrigger = {text: ''}
	export let ready = true
	
	let open = false
</script>

<style lang="scss">
	.expanda{
		display: block;
		
		.trigger{
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: var(--font-size-small, 12px);
			line-height: 1em;

			:global(.material-icons){
				font-size: 1em;
				margin-left: 0.3em;
			}
		}

		.inner{
			display: block;
			max-height: 0;
			opacity: 0;
			height: auto;
			margin-top: 0;
			transition: all 0.3s ease-in-out;
		}

		&[data-open='true']{
			.inner{
				max-height: 100vh;
				opacity: 1;
				margin-top: 2em
			}
		}
	}
</style>

<section class={`expanda ${$$props.class||''}`} data-open={open}>
	<span 
		class="trigger" 
		on:click={() => {
			if(ready) open = !open
		}}
	>
		{#if ready}
			{#if open}
				{closeTrigger.text}
				{#if closeTrigger.icon}
					<Icon class={`material-icons -close`}>{closeTrigger.icon}</Icon>	
				{/if}
			{:else}
				{openTrigger.text}
				{#if openTrigger.icon}
					<Icon class={`material-icons -open`}>{openTrigger.icon}</Icon>	
				{/if}
			{/if}
		{:else}
			{waitingTrigger.text}
			{#if waitingTrigger.icon}
				<Icon class={`material-icons -waiting -loading`}>{waitingTrigger.icon}</Icon>	
			{/if}
		{/if}
	</span>
	<div class="inner">
		{#if open}
			<slot/>
		{/if}
	</div>
</section>
<script>
	import { Icon } from '@smui/common';

	export let icon
	export let graphic
	export let title = `Looks like there's nothing here`
	export let subtitle
	export let copy
	export let disclaimer
</script>

<style lang="scss">
	.no-results{
		text-align: center;
		max-width: 42rem;
		margin: 0 auto;
		
		> :global(*){
			margin: 0.4em 0;
			opacity: 0.4;
		}

		.graphic{
			opacity: 0.6;
			:global(svg){
				max-width: 30rem;
				height: auto 
			}
		}

		> :global(.-disclaimer){
			margin-top: 2em
		}

		:global(.material-icons){
			font-size: 2em;
		}

		:global(.mdc-typography--body1){
			opacity: 0.8;
		}
	}
</style>

<section class='no-results'>
	{#if graphic}<div class="graphic"><svelte:component this={graphic} class={'aaaaa'}/></div>{/if}
	{#if icon}<Icon class="material-icons">{icon}</Icon>{/if}
	{#if title}<h1 class="mdc-typography--headline5">{title}</h1>{/if}
	{#if subtitle}<h2 class="mdc-typography--subtitle1">{subtitle}</h2>{/if}
	<p class="mdc-typography--body1"><slot/></p>
	{#if disclaimer}<p class="mdc-typography--body2 -disclaimer">{disclaimer}</p>{/if}
</section>
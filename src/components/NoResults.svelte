<script>
	import { Icon } from '@smui/common';

	export let icon = `search`
	export let title = `Looks like there's nothing here`
	export let subtitle
	export let copy
</script>

<style lang="scss">
	.no-results{
		text-align: center;
		
		> :global(*){
			margin: 0.4em 0;
			opacity: 0.4;
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
	{#if icon}<Icon class="material-icons">{icon}</Icon>{/if}
	{#if title}<h1 class="mdc-typography--headline5">{title}</h1>{/if}
	{#if subtitle}<h2 class="mdc-typography--subtitle1">{subtitle}</h2>{/if}
	<p class="mdc-typography--body1"><slot/></p>
</section>
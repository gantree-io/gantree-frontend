<script>
	import { Icon } from '@smui/common';
	export let val
</script>

<style lang="scss">
	:global(.material-icons.-autorenew){
		opacity: 0.3;
		font-size: 1em;
		display: inline-block;
		margin: 0 0.2em;
	}
</style>

{#if val} {val}
{:else} <Icon class="material-icons -animation-spin -autorenew">autorenew</Icon> 
{/if}
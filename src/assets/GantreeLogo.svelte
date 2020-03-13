<script>
	import { createEventDispatcher } from 'svelte';
	export let onClick = () => {}
	const dispatch = createEventDispatcher();
</script>

<style>
	.gantree-logo{
		margin: 0;
		line-height: 1em;
		font-family: 'Monda', sans-serif;
		text-transform: uppercase;
		font-size: 1.6em;
		color: var(--color-light-purple);
		text-shadow: -2px 2px 0 var(--color-purple);
		cursor: pointer;
	}
</style>

<h1 class='gantree-logo' on:click={e => dispatch('click')}>Gantree</h1>
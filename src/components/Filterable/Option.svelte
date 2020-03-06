<script>
	import { getContext } from 'svelte';
	import { FILTERABLE } from './Filterable.svelte';
	export let key
	const { registerFilter, toggleFilter, activeFilters, itemCount } = getContext(FILTERABLE);
	registerFilter(key)
</script>

<style lang="scss">
	.filterable-option{
		display: flex;
		align-items: center;
		padding: 0.3em 0.7em;
		color: var(--color-grey);
		//border: 1px solid var(--color-grey);
		border-radius: 0.5em;
		font-size: 0.9em;
		margin-right: 0.5em;
		cursor: pointer;

		:global(>*){
			font-size: 1em;
			margin: 0 0.2em;
		}

		&[data-active="true"]{
			color: var(--color-blue);
			//border: 1px solid var(--color-blue);
		}

		&:after{
			content: "("attr(data-count)")"; 
		}
	}
</style>

<div class="filterable-option" data-active={$activeFilters.includes(key)} data-count={itemCount[key]} on:click={() => toggleFilter(key)}>
	<slot></slot>
</div>
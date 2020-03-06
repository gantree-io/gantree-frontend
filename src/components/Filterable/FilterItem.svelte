<script>
	import { getContext } from 'svelte';
	import { FILTERABLE } from './Filterable.svelte';
	export let key
	const { registerItem, activeFilters } = getContext(FILTERABLE);
	registerItem(key)
</script>

{#if $activeFilters.includes(key)}
	<slot></slot>
{/if}
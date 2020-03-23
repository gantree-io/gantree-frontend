<script context="module">
	export const FILTERABLE = {};
</script>

<script>
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import NoResults from '@components/NoResults.svelte'
	import NotFound from '@assets/NotFound.svelte'

	const filters = writable([])
	const activeFilters = writable([])
	const itemCount = writable({})

	setContext(FILTERABLE, {
		registerFilter: key => {
			filters.update(items => items.concat([key]))
			activeFilters.update(items => items.concat([key]))
		},
		registerItem: key => {
			itemCount.update(items => {
				if(!items[key]) { items[key] = 0 }
				items[key] = items[key] + 1
				return items
			})
		},
		toggleFilter: key => {
 			if($activeFilters.includes(key)){
 				activeFilters.update(items => items.filter(i => i !== key))
 			}else{
 				activeFilters.update(items => items.concat([key]))
 			}
		},
		filters,
		activeFilters,
		itemCount,
	});
</script>

<slot/>
{#if $activeFilters.length <= 0}
	<NoResults
		graphic={NotFound}
		title='All items filtered'
		>
		<span class='inline-link' on:click={() => activeFilters.update(items => $filters)}>Toggle on  all filters</span> to see items
	</NoResults>
{/if}
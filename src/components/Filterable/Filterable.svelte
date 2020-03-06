<script context="module">
	export const FILTERABLE = {};
</script>

<script>
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import NoResults from '@components/NoResults.svelte'

	const filters = [];
	const itemCount = {};
	const activeFilters = writable([])

	setContext(FILTERABLE, {
		registerFilter: key => {
			filters.push(key);
			activeFilters.update(items => {
				items.push(key)
				return items
			})
		},
		registerItem: key => {
			if(itemCount[key]){
				itemCount[key] = itemCount[key] + 1
			}else {
				itemCount[key] = 1
			}
		},
		toggleFilter: key => {
 			if($activeFilters.includes(key)){
 				activeFilters.update(items => items.filter(i => i !== key))
 			}else{
 				activeFilters.update(items => {
 					items.push(key)
 					return items
 				})
 			}
		},
		activeFilters,
		itemCount
	});
</script>

<slot/>
{#if $activeFilters.length <= 0}
	<NoResults 
		title='Hidden behind filters'
		>
		Turn on <span class='inline-link' on:click={() => activeFilters.update(items => filters)}>all filters</span> to see items
	</NoResults>
{/if}
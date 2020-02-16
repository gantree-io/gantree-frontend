<script>
	import Chip, { Set, Text } from '@smui/chips';
	import { Icon } from '@smui/common';

	export let filterkey
	export let options = []
	export let items = []
	export let component

	let selectedFilters = options.slice();
	let filteredItems = items.slice()||[]

 	$: {
 		filteredItems = items.map(item => {
 			return selectedFilters.map(i => i.key).includes(item[filterkey])
 				? item
 				: null
 		}).filter(i=>i)
 	};
</script>

<style lang="scss">
	:global(.mdc-chip-set){
		:global(.mdc-chip){
			opacity: 1;
			border: 1px solid var(--color-highlight);
			background: transparent;
			color: var(--color-highlight);
			filter: saturate(15%) brightness(140%);
			
			&.mdc-chip--selected{
				filter: saturate(100%);
			}

			&:hover{
				color: var(--color-highlight);
			}

			&:before{
				background: var(--color-highlight);
			}

			> :global(.material-icons){
				font-size: 1.2em;
				margin: 0 0.2em 0 0;
			}
		}
	}
</style>

<Set 
	chips={options} 
	let:chip 
	key={chip => chip.key} 
	filter 
	bind:selected={selectedFilters}
	class='filter-list'
	>
	<Chip>
		{#if chip.icon}<Icon class={`material-icons`}>{chip.icon}</Icon>{/if}
		<Text>
			{chip.value} 
			({items.map(item => item[filterkey] === chip.key).filter(i=>i).length})
		</Text>
	</Chip>
</Set>

{#if filteredItems.length}
	{#each filteredItems as filteredItem}
		<svelte:component this={component} {...filteredItem}/>
	{/each}
{:else}
	<slot/>
{/if}
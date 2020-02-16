<script>
	import { createEventDispatcher } from 'svelte';
	import Chip, { Set, Text } from '@smui/chips';
	import { Icon } from '@smui/common';

	export let options = []
	export let count

	let selected = options.slice();
	let prev = selected.slice()

	const dispatch = createEventDispatcher();

	$: {
		if(JSON.stringify(selected) !== prev){
			dispatch('change', selected)
			prev = JSON.stringify(selected.slice())
		}
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
	bind:selected={selected}
	class='filter-list'
	>
	<Chip>
		{#if chip.icon}<Icon class={`material-icons`}>{chip.icon}</Icon>{/if}
		<Text>
			{chip.value} 
			{#if count}({count(chip)}){/if}
		</Text>
	</Chip>
</Set>
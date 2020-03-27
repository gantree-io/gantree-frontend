<script>
	import { onMount } from 'svelte';
	import uuid from 'uuid/v4'

	let childrenCount = 0
	const id = uuid()

	onMount(() => childrenCount = document.querySelector(`div.grid-row[data-id='${id}']`).childElementCount)
</script>

<style lang="scss">
	.grid-row{
		display: flex;
		align-items: stretch;
		justify-content: space-between;
		padding: 0.5rem 0;

		> :global(*){
			width: 100%;
			height: auto !important;
		}

		&[data-children-count='1'] > :global(*){ width: 100% !important }
		&[data-children-count='2'] > :global(*){ width: calc((100% - 1rem) / 2) !important }
		&[data-children-count='3'] > :global(*){ width: calc((100% - 2rem) / 3) !important }
		&[data-children-count='4'] > :global(*){ width: calc((100% - 3rem) / 4) !important }
		&[data-children-count='5'] > :global(*){ width: calc((100% - 4rem) / 5) !important }
	}
</style>

<div class={`grid-row ${$$props.class||''}`} data-children-count={childrenCount} data-id={id}>
	<slot/>
</div>
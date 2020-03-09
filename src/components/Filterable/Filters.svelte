<script>
	import { getContext } from 'svelte';
	import { FILTERABLE } from './Filterable.svelte';
	const { itemCount } = getContext(FILTERABLE);
</script>

<style lang="scss">
	.filterable-filters{
		display: flex;
		align-items: center;
		padding: 0 0 1em 0;

		&[data-visible='false']{
			display: none;
		}
	}
</style>

<div class="filterable-filters" data-visible={Object.keys($itemCount).length > 1}>
	<slot></slot>
</div>
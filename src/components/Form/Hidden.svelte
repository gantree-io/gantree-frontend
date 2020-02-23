<script>
	import { getContext } from 'svelte';
	import { FIELDS } from './Wrapper.svelte';
	
	export let id;
	export let value;

	const { initField } = getContext(FIELDS);
	initField(id, value)
</script>

<input type="hidden" id={id} value={value}/>
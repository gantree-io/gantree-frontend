<script>
	import { getContext } from 'svelte';
	import { FIELDS } from './Wrapper.svelte';
	
	export let id;
	export let value;

	const { initField } = getContext(FIELDS);
	let [field, setValue] = initField(id, value)

	$: {
		value = value
		setValue(value)
	}
</script>

<input type="hidden" id={id} value={value}/>
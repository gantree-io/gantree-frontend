<script>
	export let onChange = () => {}
	export let value = ''

	$: {
		if($$props.type === 'number'){
			value = parseInt(value)
		}
		onChange(value)
	}
</script>

<input type="text" bind:value={value} {...$$props}/>
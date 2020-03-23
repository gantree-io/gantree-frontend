<script>
	export let onChange = () => {}
	export let value = ''

	console.log($$props)

	$: {
		if($$props.type === 'number'){
			value = parseInt(value)
		}
		console.log($$props.disabled)
		onChange(value)
	}
</script>

<style>
	:global(:disabled) {
		opacity: 0.6;
	}
</style>

<input type="text" bind:value={value} {...$$props} disabled={$$props.disabled}/>
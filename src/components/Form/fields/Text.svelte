<script>
	export let onChange = () => {}
	export let value

	$: {
		onChange(value)
	}
</script>

<style lang="scss">
</style>

<input type="text" bind:value={value} {...$$props}/>
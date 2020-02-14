<script>
	export let onChange = () => {}
	export let value = null

	$: {
		onChange(value)
	}
</script>

<style lang="scss">
	input{
		padding: 0.6em 0.8em;
		border: 1px solid rgba(0,0,0,0.1);
		background: white;
		outline: none;
		font-weight: inherit
	}
</style>

<input type="text" bind:value={value} {...$$props}/>
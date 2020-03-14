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

<style lang="scss">
	/*textarea{
		padding: 0.8em 1em;
		border: 1px solid rgba(0,0,0,0.1);
		background: white;
		outline: none;
		font-weight: inherit;
		resize: none;
		font-size: 0.9em;
	}*/
</style>

<textarea bind:value={value} {...$$props} spellcheck="false"/>
<script>
	export let onClick = () => {};
</script>

<style lang="scss">
	button.form-button.-back{
		//color: var(--color-grey)
	}
</style>

<button class='mdc-button form-button -back' on:click={onClick} type="button">
	<slot></slot>
</button>
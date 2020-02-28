<script>
	export let onClick = () => {};
</script>

<style lang="scss">
	button.form-button.-next{
		background: var(--color-highlight);
		color: var(--color-light);
	}
</style>

<button class='mdc-button mdc-button--unelevated form-button -next' on:click={onClick} type="button">
	<slot></slot>
</button>
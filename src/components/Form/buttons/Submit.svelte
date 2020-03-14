<script>
	import PubSub from 'pubsub-js'
	export let onClick = () => {};
	const handleClick = e => {
		onClick()
		PubSub.publish('FORM.VALIDATE')
	}
</script>

<style lang="scss">
	button.form-button.-submit{
		background: var(--color-theme-highlight);
		color: var(--color-light);
	}
</style>

<button class='mdc-button mdc-button--unelevated form-button -submit' type='submit' on:click={handleClick}>
	<slot></slot>
</button>













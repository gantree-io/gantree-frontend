<script>
	import PubSub from 'pubsub-js'
	export let onClick = () => {};
	const handleClick = e => {
		onClick()
		PubSub.publish('FORM.RESET')
	}
</script>

<style lang="scss">
	button.form-button.-cancel{
		font-size: 0.8em;
		color: var(--color-grey);
		font-weight: 400;
	}
</style>

<button class='mdc-button form-button -cancel' type='reset' on:click={handleClick}>
	<slot></slot>
</button>
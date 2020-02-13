<script>
	import PubSub from 'pubsub-js'
	export let onClick = () => {};
	const handleClick = e => {
		onClick()
		PubSub.publish('FORM.RESET')
	}
</script>

<button class='mdc-button form-button --cancel' type='reset' on:click={handleClick}>
	<slot></slot>
</button>
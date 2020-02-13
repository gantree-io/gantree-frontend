<script>
	import PubSub from 'pubsub-js'
	export let onClick = () => {};
	const handleClick = e => {
		onClick()
		PubSub.publish('FORM.VALIDATE')
	}
</script>

<button class='form-button --submit' type='submit' on:click={handleClick}>
	<slot></slot>
</button>
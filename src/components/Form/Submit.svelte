<script>
	import PubSub from 'pubsub-js'
	
	export let text = 'Submit';
	
	const handleClick = e => {
		PubSub.publish('FORM.VALIDATE');
	}
</script>

<button class='form-button-submit' type='submit' on:click={handleClick}>
	{text}
</button>

<script>
	export let text = 'Submit';
	export let onClick = () => {};
</script>

<button class='form-button-cancel' type='reset' on:click={onClick}>
	{text}
</button>

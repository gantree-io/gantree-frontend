<script>
	export let onClick = () => {};
</script>

<button class='form-button --back' on:click={onClick} type="button">
	<slot></slot>
</button>
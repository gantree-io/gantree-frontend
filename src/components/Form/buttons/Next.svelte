<script>
	export let onClick = () => {};
</script>

<button class='form-button --next' on:click={onClick} type="button">
	<slot></slot>
</button>
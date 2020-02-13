<script>
	export let onClick = () => {};
</script>

<button class='mdc-button form-button --back' on:click={onClick} type="button">
	<slot></slot>
</button>
<script>
	export let to;
	export let onClick = () => {};
</script>

<style lang="scss">
	.link {
		text-decoration: none;
	}
</style>

<a href={to||'#'} on:click={onClick} class='link'>
	<slot></slot>
</a>

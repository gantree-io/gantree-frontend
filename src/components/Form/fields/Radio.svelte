<script>
	export let onChange = () => {}
	export let options
	export let value = options[0].value

	$: {
		onChange(value)
	}
</script>

<style lang="scss">
	.radio{
		display: inline-flex;
		background: var(--color-light);

		.option {
			cursor: pointer;
			min-width: 4rem;
			color: rgba(0,0,0,0.5);
			display: block;
			padding: 0.7em 1em;
			text-align: center;
			transition: all 0.1s;
			box-shadow: inset 0 0 0.3em rgba(0,0,0,0.1);
			background: var(--color-light);
			color: var(--color-theme-highlight);
			box-shadow: inset 0 0 0 rgba(0,0,0,0);
		}
		.active{
			background: var(--color-theme-highlight);
			color: var(--color-light);
			box-shadow: inset 0 0 0 rgba(0,0,0,0);
		}
	}
</style>

<div class='radio'>
	{#each options as option}
		<div class="option" class:active={option.value === value} on:click={() => value = option.value}>{option.name}</div>
	{/each}
</div>
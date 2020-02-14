<script>
	export let onChange = () => {}
	export let off
	export let on
	export let value

	$: {
		onChange(value)
	}
</script>

<style lang="scss">
	.switch{
		display: inline-flex;

		.off, .on{
			cursor: pointer;
			min-width: 4rem;
			background: var(--color-light-grey);
			color: var(--color-mid-grey);
			display: block;
			padding: 0.7em 1em;
			text-align: center;
			transition: all 0.1s;
			box-shadow: inset 0 0 0.3em rgba(0,0,0,0.1);
		}

		
		&:not([data-on='true']){
			.off{
				background: var(--color-highlight);
				color: var(--color-light);
				box-shadow: inset 0 0 0 rgba(0,0,0,0);
			}
		}


		&[data-on='true']{
			.on{
				background: var(--color-highlight);
				color: var(--color-light);
				box-shadow: inset 0 0 0 rgba(0,0,0,0);
			}
		}
	}
</style>

<div class='switch' data-on={value}>
	<div class="off" on:click={() => value = false}>{off}</div>
	<div class="on" on:click={() => value = true}>{on}</div>
</div>
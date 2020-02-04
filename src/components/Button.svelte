<script>
	export let small = null
	export let large = null
	export let primary = null
	export let secondary = null
	export let disabled = null
</script>

<style lang="scss">
	button{
		border: none;
		font-size: 1em;
		padding: 0.6em 1.2em;
		font-weight: 100;
		cursor: pointer;
		background: var(--color-light-grey);
		color: var(--color-dark);
		transition: filter 0.2s;
		display: flex;
		align-items: center;

		:global(>*){
			display: block;
			margin: 0 0.5em;
			&:first-child{ margin-left: 0 }
		}

		&:hover{
			filter: contrast(108%);
		}

		&.small{
			font-size: 0.8em;
		}

		&.large{
			font-size: 1.2em;
		}

		&.primary{
			background: var(--color-highlight);
			color: var(--color-light);
			&:hover{ filter: contrast(120%) }
		}

		&.secondary{
			background: var(--color-dark-grey);
			color: var(--color-light);
			&:hover{ filter: contrast(130%) }
		}

		&.disabled{
			background: var(--color-mid-grey);
			color: var(--color-light);
			opacity: 0.4;
			pointer-events: none;
		}
	}
</style>

<button 
	class:small 
	class:large
	class:primary
	class:secondary
	class:disabled
	>
	<slot></slot>
</button>
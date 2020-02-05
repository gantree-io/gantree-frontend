<script>
	export let value = null
	export let label = null
	export let success = null
	export let warning = null
	export let error = null
	export let disabled = null
</script>

<style lang="scss">
	.badge{
		font-size: var(--font-size-xsmall);
		display: flex;
		align-items: center;

		.value{
			width: 1.4em;
			height: 1.4em;
			line-height: 1.4em;
			background: var(--color-status-neutral);
			display: inline-block;
			vertical-align: middle;
			text-align: center;
			border-radius: 50%;
			color: white;
			font-size: 0.9em
		}

		.label{
			padding-left: 0.2em
		}

		&.success .value{ background: var(--color-status-success) }
		&.warning .value{ background: var(--color-status-warning) }
		&.error .value{ background: var(--color-status-error) }
		&.disabled {
			pointer-events: none;
			opacity: 0.5;
			filter: saturate(0);
			.value{ background: var(--color-status-neutral) }
		}
	}
</style>

<span class='badge' class:success class:warning class:error class:disabled>
	<span class="value">{value}</span>
	<span class="label">{label}</span>
</span>
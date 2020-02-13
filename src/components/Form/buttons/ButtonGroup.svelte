<script>
	import BackButton from './Back.svelte'
	import CancelButton from './Cancel.svelte'
	import SubmitButton from './Submit.svelte'
	import NextButton from './Next.svelte'

	export let onBackClick = () => {};
	export let onCancelClick = () => {};
	export let onSubmitClick = () => {};
	export let onNextClick = () => {};
	
	export let back
	export let cancel
	export let submit
	export let next
</script>

<div class="form-button-group">
	{#if back}<BackButton onClick={onBackClick}>{back}</BackButton>{/if}
	{#if cancel}<CancelButton onClick={onCancelClick}>{cancel}</CancelButton>{/if}
	{#if submit}<SubmitButton onClick={onSubmitClick}>{submit}</SubmitButton>{/if}
	{#if next}<NextButton onClick={onNextClick}>{next}</NextButton>{/if}
</div>
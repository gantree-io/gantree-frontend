<script>
	import { getContext } from 'svelte';
	import { FIELDS } from './Wrapper.svelte';
	import { Text, File } from './fields';
	
	export let title;
	export let validation = {};
	export let input;
	
	let value = input.value
	let errors = []
	const { initField } = getContext(FIELDS);
	
	let updateField = initField(input.id, value, validation)

	$: {
		errors = updateField(value)
	}
</script>

<style lang="scss">
	.form-field{
		margin-bottom: 1em;
		display: block;
		font-weight: 100;
	}

	label{
		font-size: 11px;
		font-weight: 100;
		text-transform: uppercase;
		display: block;

		> :global(*){
			display: block;
			font-size: 1em;
			font-weight: 100;
		}
	}

	:global(input){
		padding: 0.6em 0.8em;
		border: 1px solid rgba(0,0,0,0.1);
		background: white;
		margin: 0.2em 0;
		display: block;
		width: 100%;
		outline: none;
		font-weight: inherit
	}
</style>

<div class='form-field'>
	<label>{title}</label>

	{#if input.type === 'text'}
		<Text {...input} bind:value={value}/>
	{:else if input.type === 'file'}
		<File {...input} bind:file={value}/>
	{/if}

	{#each errors as error}
		{error}
	{/each}
</div>
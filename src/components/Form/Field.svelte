<script>
	import { onMount, onDestroy, getContext } from 'svelte';
	import PubSub from 'pubsub-js'
	import { FIELDS } from './Wrapper.svelte';
	import { Text, File } from './fields';
	
	export let title;
	export let validation = {};
	export let input;
	
	let value = input.value
	const { initField, fieldError } = getContext(FIELDS);
	
	let [field, setValue] = initField(input.id, value, validation)

	$: {
		[field] = setValue(value)
	}
	
	onMount(() => {
		PubSub.subscribe('FORM.VALIDATE', () => {
			[field] = setValue(value)
		});
	})

	onDestroy(() => {
		PubSub.unsubscribe('FORM.VALIDATE');
	})
</script>

<style lang="scss">
	.form-field{
		margin-bottom: 1.6em;
		display: block;
		font-weight: 100;
		position: relative;

		.title{
			font-size: 0.9em;
			font-weight: 100;
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

		.error{
			font-size: 0.8em;
			color: red;
			position: absolute;
			top: 100%;
			right: 0;
		}

		&[data-has-error='true']{
			color: red
		}
	}
</style>

<label class='form-field' for={input.id} data-field-type={input.type} data-has-error={!!field.error}>
	<span class="title">{title}</span>
	{#if input.type === 'text'}
		<Text {...input} bind:value={value}/>
	{:else if input.type === 'file'}
		<File {...input} bind:file={value}/>
	{/if}
	
	{#if field.error}
		<span class="error">{field.error}</span>
	{/if}
</label>

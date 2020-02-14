<script>
	import { onMount, onDestroy, getContext } from 'svelte';
	import PubSub from 'pubsub-js'
	import { Icon } from '@smui/common';
	import Tooltip from '@components/Tooltip.svelte'
	import { FIELDS } from './Wrapper.svelte';
	import { Text, Select, File, Json, Switch } from './fields';
	
	export let title;
	export let subtitle = null;
	export let help = null;
	export let required = false;
	export let validation = {};
	export let input;
	
	// determine the default value
	let value = input.value
	switch (input.type) {
		case 'text':
		case 'number':
		case 'url':
			value = input.value || ''
			break;
		case 'select':
			value = Object.keys(input.options)[0]
			break;
		case 'switch':
			value = input.value
			break;
		case 'json':
		case 'file':
		default:
			// TODO
			break;
	} 
	
	// handle initialising field
	const { initField, fieldError } = getContext(FIELDS);
	let [field, setValue] = initField(input.id, value, required, validation)
	$: { [field] = setValue(value) }
	
	// ask for the validate on mount
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
		margin-bottom: 2em;
		display: block;
		font-weight: 100;
		position: relative;
		width: 100%;

		.title{
			font-size: 0.9em;
			font-weight: 100;
			display: flex;
			align-items: center;

			:global(.tooltip){
				display: inline-block;
				font-weight: inherit;
				padding-left: 0.4em;
				opacity: 0.6;
				&:hover{
					opacity: 1;
				}
			}
		}

		.subtitle{
			font-size: 12px;
			font-weight: 100;
			display: block;
			color: var(--color-mid-grey);
		}

		:global(input),
		:global(select){
			margin: 0.2em 0;
			display: block;
			width: 100%;

			&:focus{
				border-bottom: 1px solid var(--color-highlight);
			}
		}

		:global(.switch){
			margin: 0.2em 0;
		}

		:global(::placeholder){
			color: rgba(0,0,0,0.2);
			font-weight: 100;
		}

		.error{
			font-size: 0.8em;
			color: red;
			position: absolute;
			top: 0;
			right: 0;
		}

		&[data-has-error='true']{
			color: red;
			:global(input){ color: red }
		}
	}
</style>

<label class='form-field' for={input.id} data-field-type={input.type} data-has-error={!!field.error}>
	<span class="title">
		{title}
		<Tooltip text={help}>
			<Icon class="material-icons">info</Icon>
		</Tooltip>
	</span>
	
	
	{#if 
		input.type === 'text' || 
		input.type === 'number' || 
		input.type === 'url'
	}
		<Text {...input} bind:value={value}/>
	{:else if input.type === 'select'}
		<Select {...input} bind:value={value}/>
	{:else if input.type === 'json'}
		<Json {...input} bind:value={value}/>
	{:else if input.type === 'file'}
		<File {...input} bind:file={value}/>
	{:else if input.type === 'switch'}
		<Switch {...input} bind:value={value}/>
	{/if}

	{#if subtitle}<span class="subtitle">{subtitle}</span>{/if}
	
	{#if field.error}
		<span class="error">{field.error}</span>
	{/if}
</label>

<script context="module">
	export const FIELDS = {};
</script>

<script>
	import { onMount, setContext, onDestroy } from 'svelte';
	import { writable } from 'svelte/store';
	import { form } from 'svelte-forms';
	import ButtonGroup from './buttons/ButtonGroup.svelte';
	
	export let buttons = {}
	export let onSubmit = () => {}
	export let onCancel = () => {}
	

	const initialValues = {};
	const fields = {};
	const validation = {};
	let errors = {};
	let touched = false;
	let steps = {
		ids: [],
		current: 0
	}

	const validateField = id => {
		delete errors[id]
		let rules = validation[id]
		Object.keys(rules).map(msg => {
		 	if(rules[msg](fields[id])){
		 		errors[id] = msg
		 	}
		})

		return errors[id] || []
	}

	const formatResponse = id => {
		return [
			{
				initialValue: initialValues[id],
				value: fields[id],
				error: errors[id]
			},
			value => updateField(id, value)
		] 
	}

	const updateField = (id, value) => {
		fields[id] = value;

		touched = touched === false
			? initialValues[id] !== value
			: true

		if(touched){
			validateField(id)
		}
		
		return formatResponse(id)
	}

	setContext(FIELDS, {
		initField: (id, value, validationRules={}) => {
			initialValues[id] = value
			fields[id] = value
			validation[id] = validationRules
			return formatResponse(id)
		},
		fieldProps: id => {
			return {
				field: fields[id],
				errors: errors[id]
			}
		},
		fieldError: id => errors[id],
		registerStep: id => {
			let index = steps.ids.push(id)
			return steps.current
		},
		stepForward: () => {
			steps.current = steps.current >= steps.ids.length - 1
				? steps.current
				: steps.current + 1
			
			PubSub.publish('FORM.STEP', steps.ids[steps.current]);
		},
		stepBack: () => {
			steps.current = steps.current <= 0
				? 0
				: steps.current - 1
			
			PubSub.publish('FORM.STEP', steps.ids[steps.current]);
		},
		currentStep: steps.current
	});

	const handleSubmit = () => {
		Object.keys(fields).forEach( id => {
			touched = true
			validateField(id)
		});

		onSubmit({
			fields,
			errors,
			hasErrors: Object.keys(errors).length > 0,
			touched: touched
		})
	}

	onMount(() => {
		if(steps.ids.length){
			PubSub.publish('FORM.STEP', steps.ids[steps.current]);
		}
	})
</script>

<style lang="scss">
	form{
		display: flex;
		flex-direction: column;

		:global(.form-field){
			width: 100%;
		}


		:global(::placeholder){
			color: var(--color-mid-grey);
			font-weight: 100;
			font-size: 0.8em;
		}

		.controls{
			display: flex;
			align-items: center;
			justify-content: flex-end;

			:global(.form-button),
			:global(.form-button-submit),
			:global(.form-button-cancel){
				display: inline-block;
				padding: 0.7em 2em;
				font-weight: 100;
				font-size: 1em;
				cursor: pointer;
				opacity: 0.8;
				transition: padding 0.1s ease-in-out;
				border: none;
				
				&:hover{
					opacity: 1;
				}
			}

			:global(.form-button-submit){
				color: var(--color-light-grey);
				background: var(--color-highlight);
				&:hover{
					padding: 0.7em 2.2em;
				}
			}

			:global(.form-button-cancel){
				color: var(--color-highlight);
				background: none;
			}
		}

		&[data-has-errors="true"]{
			.controls{
				:global(.form-button-submit){
					opacity: 0.5;
					cursor: not-allowed;
				}
			}
		}
	}
</style>

<form  
	on:submit={handleSubmit}
	data-has-errors={Object.keys(errors).length > 0}
	autocomplete="off"
	>
	<slot></slot>
	<ButtonGroup {...buttons}/>
</form>
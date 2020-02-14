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
	//export let onCancel = () => {}
	export let onStep = () => {}
	

	const initialValues = {}
	const fields = {}
	const validation = {}
	const required = []
	let errors = {}
	//let touched = false
	let touched = []
	let steps = {
		names: [],
		ids: [],
		current: 0
	}
	let loading = true

	const updateStep = () => {
		onStep({
			title: steps.names[steps.current + 1],
			index: steps.current + 1
		})

		PubSub.publish('FORM.STEP', steps.ids[steps.current]);
	}

	const validateField = id => {
		delete errors[id]
		
		let rules = validation[id]
		
		Object.keys(rules).map(msg => {
		 	if(rules[msg](fields[id])){
		 		errors[id] = msg
		 	}
		})

		if(required.includes(id) && (typeof fields[id] === 'undefined' || fields[id] === '')){
			errors[id] = 'Required'
		}

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

		if(!touched.includes(id) && initialValues[id] !== value){
			touched.push(id)
		}

		if(touched.includes(id)){
			validateField(id)
		}
		
		return formatResponse(id)
	}

	setContext(FIELDS, {
		initField: (id, value, isRequired, validationRules={}) => {
			initialValues[id] = value
			fields[id] = value
			isRequired && required.push(id)
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
		registerStep: (id, name) => {
			let index = steps.ids.push(id)
			steps.names[index] = name
			return steps.current
		},
		stepForward: () => {
			steps.current = steps.current >= steps.ids.length - 1
				? steps.current
				: steps.current + 1

			updateStep()
		},
		stepBack: () => {
			steps.current = steps.current <= 0
				? 0
				: steps.current - 1
			
			updateStep()
		},
		currentStep: steps.current
	});

	const handleSubmit = () => {
		Object.keys(fields).forEach( id => {
			touched.push(id)
			validateField(id)
		});

		onSubmit({
			fields,
			errors,
			hasErrors: Object.keys(errors).length > 0,
			touched: touched.length > 0,
			setLoading: val => loading = !!val
		})
	}

	onMount(() => {
		loading = false
		if(steps.ids.length){
			updateStep()
		}
	})
</script>

<style lang="scss">
	form{
		display: flex;
		flex-direction: column;

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

		&[data-loading='true']{
			opacity: 0.5;
			pointer-events: none;
		}
	}
</style>

<form  
	on:submit={handleSubmit}
	data-has-errors={Object.keys(errors).length > 0}
	autocomplete="off"
	novalidate
	data-loading={loading}
	>
	<slot></slot>
	<ButtonGroup {...buttons}/>
</form>
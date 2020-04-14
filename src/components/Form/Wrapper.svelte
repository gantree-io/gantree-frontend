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
	export let onChange = () => {}
	export let onCancel = () => {}
	export let onStep = () => {}


	const initialValues = {}
	const fields = {}
	const validation = {}
	const required = []
	let errors = {}
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

	// valiudate a field based on required and validation props
	const validateField = id => {
		delete errors[id]

		let rules = validation[id]

		Object.keys(rules).map(msg => {
		 	if(rules[msg](fields[id])){
		 		errors[id] = msg
		 	}
		})

		// make sure field contains someting is it's required
		if(
			required.includes(id) &&
			fields[id] !== false &&
			(
				typeof fields[id] === 'undefined' ||
				fields[id] === '' ||
				!fields[id]
			)
		){
			errors[id] = 'Required'
		}

		return errors[id] || []
	}

	const formatFieldData = id => {
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

		// check if the field has been altered in any way
		if(!touched.includes(id) && initialValues[id] !== value){
			touched.push(id)
		}

		if(touched.includes(id)){
			validateField(id)
		}

		handleChange()

		return formatFieldData(id)
	}

	setContext(FIELDS, {
		initField: (id, value, isRequired, validationRules={}) => {
			initialValues[id] = value
			fields[id] = value
			isRequired && required.push(id)
			validation[id] = validationRules
			return formatFieldData(id)
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
			// TODO: check valid before allowing next step
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

	const formatResponse = () => ({
		fields,
		errors,
		hasErrors: Object.keys(errors).length > 0,
		touched: touched.length > 0,
		setLoading: val => loading = !!val
	})

	const handleChange = () => {
		let response = formatResponse()
		onChange(response)
	}

	const handleSubmit = (e) => {
		console.log({ e })
		e.preventDefault()
		Object.keys(fields).forEach( id => {
			touched.push(id)
			validateField(id)
		});

		let response = formatResponse()
		onSubmit(response)
	}

	onMount(() => {
		loading = false
		if(steps.ids.length){
			updateStep()
		}
		window.addEventListener('keydown', (e) => {
			if (e.keyCode === 13) {
				e.preventDefault()
				return false
			}
		})
	})
</script>

<style lang="scss">
	form{
		display: flex;
		flex-direction: column;

		:global(.form-field){
			margin-bottom: 1.5em;
			width: 100%;
		}

		:global(.form-button-group){
			justify-content: space-between;
		}

		&[data-has-errors="true"]{
			:global(.form-button-group){
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
	<ButtonGroup {...buttons} onCancelClick={onCancel}/>
</form>
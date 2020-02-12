<script context="module">
	export const FIELDS = {};
</script>

<script>
	import { setContext, onDestroy } from 'svelte';
	import { writable } from 'svelte/store';
	import { form } from 'svelte-forms';
	
	export let onSubmit = () => {}
	const fields = {};
	const validation = {};
	const errors = {};
	let touched = false;

	const updateField = (id, value) => {
		touched = true
		fields[id] = value;
		delete errors[id]

		let rules = validation[id]
		Object.keys(rules).map(msg => {
		 	if(rules[msg](value)){
		 		errors[id] = msg
		 	}
		})

		return errors[id] || []
	}

	setContext(FIELDS, {
		initField: (id, value, validationRules={}) => {
			fields[id] = value
			validation[id] = validationRules
			errors[id] = []
			//run validation rules
			// set valid or not

			return value => updateField(id, value)
		},
		fieldProps: id => {
			return {
				field: fields[id],
				errors: errors[id]
			}
		},
		fieldErrors: id => errors[id]
	});

	const handleSubmit = () => {
		onSubmit({
			fields,
			errors,
			hasErrors: Object.keys(errors).length > 0,
			touched: touched
		})
	}
</script>

<style lang="scss">
	form{
		display: flex;
		flex-direction: column;
		> :global(*){
			//margin-bottom: 1em;
			//display: block;
		}


	}
</style>

<form  
	on:submit={handleSubmit}
	>
	<slot></slot>
</form>
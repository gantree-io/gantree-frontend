<script>
	import { form } from 'svelte-forms';
	import { mutation } from '@util/graphql'
	import PanelLayout from '@layouts/Panel.svelte'
	import Form, { Field, Hidden, validate } from '@components/Form'
	import { toast } from '@components/Toaster.svelte'
	import PCK, { createPck } from '@archetypes/PCK/store'

	export let onSuccess = () => {}
	export let onCancel = () => {}
	export let pckCollectionId

	// HACK(Denver): move this into a file with other static patterns
	const PATTERN_VALID_PCK_NAME = /^[\w -]{1,128}$/
	const validatePattern = (text) => {
		if (PATTERN_VALID_PCK_NAME.test(text) !== true)
			return new Error("Invalid PCK name")
	}

	// handle network deployment
	const handleSubmit = async ({fields, hasErrors, errors, setLoading}) => {
        let _t = toast.loading(`Creating PCK...`)
        if(!hasErrors){
            setLoading(true)
            PCK.mutation(createPck, fields).then(data => {
                _t.success(`PCK ${fields.name} added`)
                onSuccess(data)
                setLoading(false)
            })
            .catch(e => {
				_t.warning(e)
				onCancel()
				setLoading(false)
            })
        }else{
            _t.warning(`Some fields have errors`)
        }
    }
</script>

<PanelLayout
	header={{
		title: 'Add PCK',
	}}
	>
	<Form
		onSubmit={handleSubmit}
		onCancel={onCancel}
		buttons={{
			cancel: 'Cancel',
			submit: 'Add'
		}}
		>

		<Hidden
			id='pckCollectionId'
			value={pckCollectionId}
		/>

		<Field
			title='PCK Name'
			validation={{
				'Name is invalid': validatePattern,
				'Name is required': validate.required
			}}
			input={{
				id: 'name',
				type: 'text',
				placeholder: " // PCK Name",
			}}
		/>
	</Form>
</PanelLayout>
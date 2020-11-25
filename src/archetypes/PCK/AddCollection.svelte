<script>
	import { form } from 'svelte-forms';
	import { mutation } from '@util/graphql'
	import PanelLayout from '@layouts/Panel.svelte'
	import Form, { Field, Hidden, validate } from '@components/Form'
	import { toast } from '@components/Toaster.svelte'
	import PCK, { createPckCollection } from '@archetypes/PCK/store'

	export let onSuccess = () => {}
	export let onCancel = () => {}
	export let pckCollectionId

	// handle network deployment
	const handleSubmit = async ({fields, hasErrors, errors, setLoading}) => {
		if(!hasErrors){
			setLoading(true)
			PCK.mutation(createPckCollection, fields).then(data => {
				toast.success(`PCK ${fields.name} added`)
				onSuccess(data)
				setLoading(false)
			})
		}else{
			toast.warning(`Some fields have errors`)
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

		<Field
			title='Collection Name'
			validation={{
				'Name is required': validate.required
			}}
			input={{
				id: 'name',
				type: 'text',
				placeholder: " // PCK Name",
			}}
		/>

		...TODO
	</Form>
</PanelLayout>
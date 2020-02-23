<script>
	import { form } from 'svelte-forms';
	import { mutation } from '@util/graphql'
	import PanelLayout from '@layouts/Panel.svelte'
	import Form, { Step, Field, Hidden, validate } from '@components/Form'
	import ConfigStore from '@archetypes/Config/store'
	import { toast } from '@components/Toaster.svelte'
	import Key, { addKey } from './store'

	export let name
	export let provider
	export let onSuccess = () => {}
	export let onCancel = () => {}

	const onSubmit = async ({fields, hasErrors, errors, setLoading}) => {
		 let _t = toast.loading(`Adding & Verifying Key...`)
		 if(!hasErrors){
		 	//setLoading(true)
		 	Key.query(addKey, fields).then(data => {
		 		_t.success(`Key added successfully`)
		 		onSuccess(data)
		 		setLoading(false)
		 	}).catch( e => {
		 		_t.warning(e.message)
		 	})
		 }else{
		 	_t.warning(`Some fields have errors`)
		 }
	}
</script>

<style lang="scss">
	:global(.mdc-typography--body1){
		margin-top: 0
	}
</style>

<PanelLayout 
	header={{
		title: 'Configure Key',
		name: name,
	}}
	>
	<p class="mdc-typography--body1">Paraplant requires your {name} API Key. Click here for instructions on how to retrieve this.</p>
	<Form 
		onSubmit={onSubmit}
		onCancel={onCancel}
		buttons={{
			cancel: 'Cancel',
			submit: 'Add'
		}}
		hidden={{
			provider: provider
		}}
		>
		<Hidden id='provider' value={provider}/>

		<Field
			title={`${name} API Key`}
			required
			validation={{
				'Your API key is not the correct format': validate.ssh_key
			}}
			input={{
				id: 'key',
				type: 'textarea',
				placeholder: `// Paste your API key here`,
				rows: 15
			}}
		/>
	</Form>
</PanelLayout>
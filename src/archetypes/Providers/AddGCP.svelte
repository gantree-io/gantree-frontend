<script>
	import PanelLayout from '@layouts/Panel.svelte'
	import Form, { Field } from '@components/Form'
	import { toast } from '@components/Toaster.svelte'
	import Providers, { addGCP } from './store'

	export let onSuccess = () => {}
	export let onCancel = () => {}

	const onSubmit = async ({fields, hasErrors, errors, setLoading}) => {
		let _t = toast.loading(`Adding & Verifying Credentials...`)
		if(!hasErrors){
			setLoading(true)
			// remove all non-json data
			fields.google_application_credentials = JSON.stringify(JSON.parse(fields.google_application_credentials))
			Providers.mutation(addGCP, fields)
				.then(data => {
					_t.success(`Credentials added successfully`)
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
		title: 'Google Cloud Credentials',
	}}
	>
	<p class="mdc-typography--body1">
		Paraplant requires your Google Cloud Credentials with <strong>write access to compute and network resources</strong>. Click here for instructions on how to retrieve this.
	</p>
	<Form 
		onSubmit={onSubmit}
		onCancel={onCancel}
		buttons={{
			cancel: 'Cancel',
			submit: 'Add'
		}}
		>
		<Field
			title='Google Application Credentials File'
			subtitle='This must be a json file'
			required
			input={{
				id: 'google_application_credentials',
				type: 'json',
				accept: "application/json, application/JSON"
			}}
		/>
	</Form>
</PanelLayout>
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
			fields.googleApplicationCredentials = JSON.stringify(JSON.parse(fields.googleApplicationCredentials))
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
		Gantree requires your Google Cloud Credentials with <strong>write access to compute and network resources</strong>.
	</p>
	<p class="mdc-typography--body1">
		<strong>Note that you must create a project named "gantree-dashboard" for these credentials to work.</strong>
	</p>
	<p class="mdc-typography--body1">
		<a href='https://support.google.com/a/answer/7378726?hl=en' target="_blank" nofollow noreferrer>Click here for instructions on how to retrieve your credentials file</a>.
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
				id: 'googleApplicationCredentials',
				type: 'json',
				accept: "application/json, application/JSON"
			}}
		/>
	</Form>
</PanelLayout>
<script>
	import PanelLayout from '@layouts/Panel.svelte'
	import Form, { Field } from '@components/Form'
	import { toast } from '@components/Toaster.svelte'
	import Providers, { addAWS } from './store'

	export let onSuccess = () => {}
	export let onCancel = () => {}

	const onSubmit = async ({fields, hasErrors, errors, setLoading}) => {
		let _t = toast.loading(`Adding & Verifying Credentials...`)
		if(!hasErrors){
			setLoading(true)
			Providers.mutation(addAWS, fields)
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
		title: 'AWS Credentials',
	}}
	>
	<p class="mdc-typography--body1">
		Gantree requires your IAM account Access and Secret Keys with <strong>EC2 and VPC write access.</strong>.
		<a href='https://google.com' target="_blank" nofollow noreferrer>Click here for instructions on how to retrieve this</a>.
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
			title={`Access Key ID`}
			required
			validation={{
				'Must be more tha 16 characters': t => t.length < 16,
				'Must be less than 128 characters': t => t.length > 128
			}}
			input={{
				id: 'aws_access_key_id',
				type: 'textarea',
				placeholder: `// Paste your AWS Access Key ID here`,
				rows: 3
			}}
		/>

		<Field
			title={`Secret Access Key`}
			required
			validation={{
				'Must be 40 characters': t => t.length !== 40
			}}
			input={{
				id: 'aws_secret_access_key',
				type: 'textarea',
				placeholder: `// Paste your AWS Secret Access Key here`,
				rows: 3
			}}
		/>
	</Form>
</PanelLayout>
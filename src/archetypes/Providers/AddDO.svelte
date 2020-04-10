<script>
	import PanelLayout from '@layouts/Panel.svelte'
	import Form, { Field } from '@components/Form'
	import { toast } from '@components/Toaster.svelte'
	import Providers, { addDO } from './store'

	export let onSuccess = () => {}
	export let onCancel = () => {}

	const onSubmit = async ({fields, hasErrors, errors, setLoading}) => {
		let _t = toast.loading(`Adding & Verifying Credentials...`)
		if(!hasErrors){
			setLoading(true)
			Providers.mutation(addDO, fields)
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
		title: 'Digital Ocean Credentials',
	}}
	>
	<p class="mdc-typography--body1">
		Gantree requires your Digital Ocean Token with <strong>read + write access</strong>.
		<a href='https://www.digitalocean.com/docs/apis-clis/api/create-personal-access-token/' target="_blank" nofollow noreferrer>Click here for instructions on how to retrieve this</a>.
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
			title={`Digital Ocean Token`}
			required
			validation={{
				'Must be 64 characters': t => t.length !== 64
			}}
			input={{
				id: 'do_api_token',
				type: 'textarea',
				placeholder: `// Paste your 64 character Digital Ocean Token here`,
				rows: 3
			}}
		/>
	</Form>
</PanelLayout>
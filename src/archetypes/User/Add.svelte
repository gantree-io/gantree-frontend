<script>
	import { form } from 'svelte-forms';
	import PanelLayout from '@layouts/Panel.svelte'
	import Form, { Field, validate } from '@components/Form'
	import { toast } from '@components/Toaster.svelte'
	import User, { inviteUser } from './store'

	export let onSuccess = () => {}
	export let onCancel = () => {}

	const onSubmit = async ({fields, hasErrors, errors, setLoading}) => {
		let _t = toast.loading(`Inviting user...`)
		if(!hasErrors){
			setLoading(true)
			User.query(inviteUser, fields).then(data => {
				_t.success(`Invitation sent to ${data.email}`)
				onSuccess(data)
				setLoading(false)
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
		title: 'Invite User'
	}}
	>
	
	<Form 
		onSubmit={onSubmit}
		onCancel={onCancel}
		buttons={{
			cancel: 'Cancel',
			submit: 'Invite'
		}}
		>
		<Field
			title='Email'
			required
			validation={{
				'Email must be valid': validate.email
			}}
			input={{
				id: 'email',
				type: 'email',
				placeholder: "JoeBloggs@example.com",
			}}
		/>
	</Form>
</PanelLayout>
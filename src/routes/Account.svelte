<script>
	import { onMount } from 'svelte';
	import { pop, push } from 'svelte-spa-router'
	import Button, { Label, Icon } from '@smui/button';
	import Centered from '@layouts/Centered.svelte'
	import Form, { Field } from '@components/Form'
	import AccountStore, { updateAccount } from '@archetypes/Account/store'

	import { toast } from '@components/Toaster.svelte'
	import { dialog } from '@components/Dialog.svelte'

	let name
	let email
	let subscribed

	const onSubmit = async ({fields, hasErrors, errors, setLoading}) => {
		 let _t = toast.loading(`Updating your account...`)

		 if(!hasErrors){
		 	setLoading(true)
		 	AccountStore.query(updateAccount, fields).then(data => {
				_t.success(`Details saved`)
				setLoading(false)
				//pop()
			}).catch( e => {
				_t.warning(e.message)
			})
		 }else{
		 	_t.warning(`Some fields have errors`)
		 }
	}
	
	onMount(async () => {
		AccountStore.subscribe(({user}) => {
			name = user.name
			subscribed = user.subscribed
		})
	})
</script>

<style lang="scss">
	/*:global(.layout.-centered){
		> :global(form){
			text-align: center;
			margin-top: 4vw;
			
			> :global(.title){
				justify-content: center;
				margin-bottom: 0.5em
			}

			> :global(.form-button-group){
				margin-top: 5vw
			}
		}
	}*/
	
	:global(button.delete){
		position: absolute;
		bottom: 0.5em;
		left: 50%;
		transform: translateX(-50%);
		font-weight: 400;

		:global(.mdc-button__label),
		:global(.mdc-button__icon){
			color: var(--color-status-error);
		}
	}
	
</style>

<Centered
	icon='fingerprint'
	title='Your Account'
	subtitle='Configure your account settings'
	back={{
		text: 'Back',
		icon: 'arrow_back',
		action: () => push('/dashboard')
	}}
	>
	<Form 
		onSubmit={onSubmit}
		buttons={{
			submit: 'Update Account',
		}}
		>
		<Field
			title='Your Name'
			required
			input={{
				id: 'name',
				type: 'text',
				placeholder: "joe blogs",
				value: name
			}}
		/>

		<Field
			title='Send me product updates via email'
			required
			input={{
				id: 'subscribed',
				type: 'switch',
				value: subscribed,
				off: 'No',
				on: 'Yes'
			}}
		/>
	</Form>

	<Button 
		class='delete'
		dense
		on:click={e => {
			dialog.warning({
				title: "Delete your account",
				subtitle: "You're about to delete your account. This cannot be undone.",
				confirmButton: 'Confirm Delete',
				onConfirm: () => toast.error(`Feature not yet enabled...`),
				cancelButton: 'back',
			})
		}}
		>
		<Icon class="material-icons">delete</Icon>
		<Label>Delete my Account</Label>
	</Button>
</Centered>
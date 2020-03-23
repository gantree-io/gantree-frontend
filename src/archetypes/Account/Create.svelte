<script>
	import { push } from 'svelte-spa-router'
	import Centered from '@layouts/Centered.svelte'
	import Form, { Field, validate } from '@components/Form'
	import { toast } from '@components/Toaster.svelte'
	import Account, { AuthStatus } from '@archetypes/Account/store'
	import Button, { Label } from '@smui/button';
	import GantreeLogo from '@assets/GantreeLogo.svelte'

	const handleSubmit = async ({fields, hasErrors, errors, setLoading}) => {
		 let _t = toast.loading(`Creating your account...`)
		 if(!hasErrors){
		 	setLoading(true)
		 	Account.create(fields)
			 	.then(msg => {
			 		setLoading(false)
			 		_t.success(msg)
			 	})
			 	.catch(msg => {
			 		setLoading(false)
			 		_t.warning(msg)
			 	})
		 }else{
		 	_t.warning(`Some fields have errors`)
		 }
	}

	// if authenticated, push to dashboard
	Account.subscribe(({authStatus}) => {
		if(authStatus === AuthStatus.AUTHENTICATED) push('/dashboard')
	})
</script>

<Centered
	icon='account_circle'
	title='Create an Account'
	copy='Start using Gantree now'
	maxWidth={'30rem'}
	>

	<span slot='header'>
		<GantreeLogo on:click={() => push('/')}/>
	</span>

	<Form
		onSubmit={handleSubmit}
		buttons={{
			submit: 'Create account',
		}}
		>
		<Field
			title='Email address'
			required
			validation={{
				'Email must be valid': validate.email
			}}
			input={{
				id: 'email',
				type: 'email',
				placeholder: "address@email.com",
			}}
		/>
		<Field
			title='Password'
			required
			input={{
				id: 'password',
				type: 'password',
				placeholder: "*******",
			}}
		/>
	</Form>

	<span slot='footer'>
		<Button
			class={'-minimal signin'}
			color="secondary"
			dense
			on:click={() => push('/login')}>
			<Label>I already have an account</Label>
		</Button>
	</span>
</Centered>
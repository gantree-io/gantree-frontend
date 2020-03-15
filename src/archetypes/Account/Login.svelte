<script>
	import { push } from 'svelte-spa-router'
	import Centered from '@layouts/Centered.svelte'
	import Form, { Field, validate } from '@components/Form'
	import { toast } from '@components/Toaster.svelte'
	import Account from '@archetypes/Account/store'
	import Button, { Label } from '@smui/button';
	import GantreeLogo from '@assets/GantreeLogo.svelte'

	const handleSubmit = async ({fields, hasErrors, errors, setLoading}) => {
		 let _t = toast.loading(`Accessing your account...`)
		 if(!hasErrors){
		 	setLoading(true)
		 	Account.signin(fields)
			 	.then(msg => {
			 		setLoading(false)
			 		//_t.success(msg)
			 	})
			 	.catch(msg => {
			 		setLoading(false)
			 		_t.warning(msg)
			 	})
		 }else{
		 	_t.warning(`Some fields have errors`)
		 }
	}
</script>

<Centered
	icon='fingerprint'
	title='Login'
	copy='Enter your Gantree Username and Password'
	maxWidth={'30rem'}
	>
	
	<span slot='header'>
		<GantreeLogo on:click={() => push('/')}/>
	</span>

	<Form 
		onSubmit={handleSubmit}
		buttons={{
			submit: 'Login',
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
			on:click={() => push('/create-account')}>
			<Label>Don't have have an account?</Label>
		</Button>
	</span>	
</Centered>
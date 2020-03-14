<script>
	import { onMount } from 'svelte';
	import Centered from '@layouts/Centered.svelte'
	import Form, { Field } from '@components/Form'
	import { toast } from '@components/Toaster.svelte'
	import { Icon } from '@smui/common';
	import { replace } from 'svelte-spa-router'
	import Account, { AccountStatus, setName } from '@archetypes/Account/store'

	const handleSubmit = async ({fields, hasErrors, errors, setLoading}) => {
		let _t = toast.loading(`Configuring your account...`)
		if(!hasErrors){
			setLoading(true)
			Account.mutation(setName, fields)
				.then(({name}) => {
					Account.setUserName(name)
					_t.success(`Account configured. Welcome to Gantree!`)
					setLoading(false)
					replace('/dashboard')
				})
				.catch(msg => {
					setLoading(false)
					_t.warning(msg)
				})
		}else{
			_t.warning(`Some fields have errors`)
		}
	}

	onMount(async () => {
		Account.subscribe(({accountStatus}) => {
			if(accountStatus === AccountStatus.COMPLETE){
				replace('/dashboard')
			}
		})
	})
</script>

<style lang="scss">
	h1{
		margin: 0;
	}

	h2{
		margin: 0;
	}

	:global(.material-icons.icon){
		font-size: 4em;
		margin: 0.3em 0
	}

	>:global(form){
		>:global(.form-button-group){
			justify-content: center !important;
		}
		
		>:global(.form-field > input#name){
			text-align: center;
			font-size: var(--font-size-large)
		};
	}
</style>

<Centered>
	<h1 class='mdc-typography--headline3'>Welcome to Gantree</h1>
	<h2 class='mdc-typography--headline5'>Configure your account</h2>
	<Icon class="material-icons icon">account_circle</Icon>
	<p class="mdc-typography--body1">Enter you name below to get started</p>

	<Form 
		onSubmit={handleSubmit}
		onCancel={() => Account.logout()}
		buttons={{
			submit: 'Continue',
			cancel: 'Take me back'
		}}
		>
		<Field
			title=''
			required
			input={{
				id: 'name',
				type: 'text',
				placeholder: "joe blogs",
			}}
		/>
	</Form>
</Centered>
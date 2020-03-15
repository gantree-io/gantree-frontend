<script>
	import { onMount } from 'svelte'
	import { push } from 'svelte-spa-router'
	import Account, { AuthStatus } from './store'
	import Button, { Label } from '@smui/button';
	import { Icon } from '@smui/common';

	export let providers = []
	export let email
	
	let username
	let authStatus

	Account.subscribe(account => {
		username = account.user.name
		authStatus = account.authStatus

		if(authStatus === AuthStatus.UNAUTHENTICATED){
			setTimeout(() => {
				if(document.getElementById("firebaseui-auth-container")){
					Account.firebase.subscribe(({firebase, ui, uiConfig}) => {
						ui.start('#firebaseui-auth-container', {
							signInFlow: 'popup',
							signInSuccessUrl: '/',
							signInOptions: providers.map(provider => firebase.auth[`${provider}AuthProvider`].PROVIDER_ID),
							// force stop auto redirect
							callbacks:{
								signInSuccessWithAuthResult: ({user}, redirectUrl) => false,
								signInFailure: () => false
							}
						});
					});
				}
			}, 300)
		}
	});
</script>

<style lang="scss">
	.user-login-buttons{
		#firebaseui-auth-container{
			&[data-status='AUTHENTICATED'],
			&[data-status='LOADING']{
				display: none
			}
		}

		> :global(.mdc-typography--caption){
			opacity: 0.5;
			font-weight: 100
		}

		:global(.material-icons.-loading){
			font-size: 1.5rem;
		}
	}
</style>

<div class="user-login-buttons">
	{#if authStatus === AuthStatus.LOADING}
		<p class="mdc-typography--caption">Accessing account</p>
		<Icon class="material-icons -loading">autorenew</Icon>
	{:else if authStatus === AuthStatus.AUTHENTICATED}
		<p class="mdc-typography--caption">logged in as {username}</p>
		<Button 
			dense 
			on:click={() => push('/dashboard')}>
			<Label>Visit Your Dashboard</Label>
		</Button>
		|
		<Button 
			dense 
			on:click={() => Account.signout('/')}>
			<Label>Logout</Label>
		</Button>
	{:else if authStatus === AuthStatus.UNAUTHENTICATED}
		<span class="mdc-typography--caption">Access your dashboard</span>
		<div id='firebaseui-auth-container' data-status={authStatus}/>
		{#if email}
			<Button 
				dense 
				on:click={() => push('/login')}>
				<Label>{email.signin}</Label>
			</Button>
			|
			<Button 
				dense 
				on:click={() => push('/create-account')}>
				<Label>{email.signup}</Label>
			</Button>
		{/if}
	{/if}
</div>
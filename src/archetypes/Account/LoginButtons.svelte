<script>
	import { onMount } from 'svelte'
	import { push } from 'svelte-spa-router'
	import AccountStore, { AuthStatus } from './store'
	import Button, { Label } from '@smui/button';

	export let providers = []
	export let email
	
	let username
	let authStatus

	AccountStore.subscribe(account => {
		username = account.user.name
		authStatus = account.authStatus
	});

	onMount(() => {
		AccountStore.firebase.subscribe(({firebase, ui, uiConfig}) => {
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
	})
</script>

<style lang="scss">
	.user-login-buttons{
		#firebaseui-auth-container{
			&[data-status='AUTHENTICATED'],
			&[data-status='LOADING']{
				display: none
			}
		}

		> :global(button.signin),
		> :global(button.signup){
			color: var(--color-light) !important;
			font-weight: 100;
			&:hover{
				color: var(--color-highlight) !important;
			}
		}

		> :global(.mdc-typography--caption.-title){
			opacity: 0.5;
			font-weight: 100
		}
	}
</style>

{#if authStatus === AuthStatus.LOADING}
	[loading]
{:else if authStatus === AuthStatus.AUTHENTICATED}
	<p>logged in as {username}</p>
	<button on:click={AccountStore.logout}>logout</button>
{/if}

<div class="user-login-buttons">
	<span class="mdc-typography--caption -title">Access your dashboard</span>
	<div id='firebaseui-auth-container' data-status={authStatus}/>
	{#if email}
		<Button 
			class={'signin'} 
			color="secondary" 
			dense 
			on:click={() => push('/login')}>
			<Label>{email.signin}</Label>
		</Button>
		|
		<Button 
			class={'signup'} 
			color="secondary" 
			dense 
			on:click={() => push('/create-account')}>
			<Label>{email.signup}</Label>
		</Button>
	{/if}
</div>

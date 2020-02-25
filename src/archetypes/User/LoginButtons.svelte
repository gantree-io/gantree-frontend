<script>
	import { onMount } from 'svelte'
	import AppStore, { UserStatus } from '@app/store'

	export let providers = []
	
	let _username
	let _userStatus

	AppStore.subscribe(({user, userStatus})=> {
		_username = user.name
		_userStatus = userStatus
	});

	onMount(() => {
		AppStore.firebase.subscribe(({firebase, ui, uiConfig}) => {
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
	#firebaseui-auth-container{
		&[data-status='AUTHENTICATED'],
		&[data-status='LOADING']{
			display: none
		}
	}
</style>

{#if _userStatus === UserStatus.LOADING}
	[loading]
{:else if _userStatus === UserStatus.AUTHENTICATED}
	<p>logged in as {_username}</p>
	<button on:click={AppStore.logout}>logout</button>
{/if}

<div id='firebaseui-auth-container' data-status={_userStatus}/>

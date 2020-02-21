<script>
	import { onMount } from 'svelte'
	import AppStore from '@app/store'

	export let providers = []
	
	let _username
	let _status

	AppStore.subscribe(({user, status})=> {
		_username = user.name
		_status = status
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
		&[data-status='authenticated'],
		&[data-status='loading']{
			display: none
		}
	}
</style>

{#if _status === 'loading'}
	[loading]
{:else if _status === 'authenticated'}
	<p>logged in as {_username}</p>
	<button on:click={AppStore.logout}>logout</button>
{/if}

<div id='firebaseui-auth-container' data-status={_status}/>

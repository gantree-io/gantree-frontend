<script>
	import { onMount } from 'svelte'
	import UserStore from './store'

	export let providers = []
	
	let _username
	let _status

	UserStore.subscribe(({user, status})=> {
		_username = user.name
		_status = status
	});

	onMount(() => {
		UserStore.firebase.subscribe(({firebase, ui}) => {
			ui.start('#firebaseui-auth-container', {
				signInFlow: 'popup',
				signInSuccessUrl: '#/dashboard',
				signInOptions: providers.map(provider => firebase.auth[`${provider}AuthProvider`].PROVIDER_ID),
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
	<button on:click={UserStore.logout}>logout</button>
{/if}

<div id='firebaseui-auth-container' data-status={_status}/>

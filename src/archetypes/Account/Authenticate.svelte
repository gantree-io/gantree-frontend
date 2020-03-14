<script>
	import { push } from 'svelte-spa-router'
	import { Icon } from '@smui/common';
	import Centered from '@layouts/Centered.svelte'
	import AccountStore, { AuthStatus } from '@archetypes/Account/store'
	
	AccountStore.subscribe(({authStatus}) => {
		if(authStatus === AuthStatus.UNAUTHENTICATED) push('/')
	})
</script>

<style lang="scss">
	h1{
		margin: 0;
	}

	h2{
		margin: 0;
	}

	:global(.material-icons.thumb){
		font-size: 4em;
		margin: 0.3em 0
	}
</style>

<Centered>
	<h1 class='mdc-typography--headline3'>Gantree</h1>
	<h2 class='mdc-typography--headline5'>Authenticating</h2>
	<Icon class="material-icons thumb -animation-pulse">fingerprint</Icon>
	<p class="mdc-typography--body1">You will be redirected to <strong></strong> once authenticated</p>
</Centered>
<script>
	import { push, querystring } from 'svelte-spa-router'
	import { Icon } from '@smui/common';
	import { toast } from '@components/Toaster.svelte'
	import Centered from '@layouts/Centered.svelte'
	import IconButton, { Icon as IconButtonIcon } from '@smui/icon-button';
	import AppStore, { NetworkStatus, UserStatus } from '@app/store'
	import { parse } from 'qs'
	
	let redirect = parse($querystring).redirect || '/dashboard'

	let _t = toast.loading('... authenticating')

	AppStore.subscribe(({userStatus}) => {
		switch (userStatus) {
			case UserStatus.UNAUTHENTICATED:
				_t.error('Authentication failed')
				push('/')
				break;
			case UserStatus.LOADING:
				// stay here while loading
				break;
			case UserStatus.AUTHENTICATED:
				_t.success(`Logged in!`)
				push(redirect)
				break;
			default:
				// statements_def
				break;
		}
	})
</script>

<style lang="scss">

	:global(.mdc-icon-button.home){
		position: absolute;
		top: 0.5em;
		left: 50%;
		transform: translateX(-50%);
	}

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
	<IconButton class={'home'} on:click={() => push('/')}>
		<IconButtonIcon class="material-icons">home</IconButtonIcon>
	</IconButton>
	<h1 class='mdc-typography--headline3'>Gantree</h1>
	<h2 class='mdc-typography--headline5'>Authenticating</h2>
	<Icon class="material-icons thumb -animation-pulse">fingerprint</Icon>
	<p class="mdc-typography--body1">You will be redirected to <strong>{redirect}</strong> once authenticated</p>
</Centered>
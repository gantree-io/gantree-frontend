<script>
	import { replace } from 'svelte-spa-router'
	import { Icon } from '@smui/common';
	import { toast } from '@components/Toaster.svelte'
	import Centered from '@layouts/Centered.svelte'
	import AppStore, { UserStatus } from '@app/store'
	
	export let params = {}
	export let redirect = `/${params.wild}` || '/'

	let _t = toast.loading('... authenticating')

	AppStore.subscribe(({status}) => {
		switch (status) {
			case  UserStatus.UNAUTHENTICATED:
				_t.error('Authentication failed')
				replace('/')
				break;
			case  UserStatus.LOADING:
				// stay here while loading
				break;
			case  UserStatus.AUTHENTICATED:
				_t.success(`Logged in!`)
				replace(redirect)
				break;
			default:
				// statements_def
				break;
		}
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
	<p class="mdc-typography--body1">You will be redirected to <strong>{redirect}</strong> once authenticated</p>
</Centered>
<script>
	import { push } from 'svelte-spa-router'
	import { Icon } from '@smui/common';
	import Centered from '@layouts/Centered.svelte'
	import IconButton, { Icon as IconButtonIcon } from '@smui/icon-button';
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
</style>

<Centered>
	<h1 class='mdc-typography--headline3'>503</h1>
	<h2 class='mdc-typography--headline5'>Looks like a network error!</h2>
	<Icon class="material-icons icon">error</Icon>
	<p class="mdc-typography--body1">Unfortunately the site is down - please try again later!</p>
</Centered>
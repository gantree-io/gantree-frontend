<script>
	import { push } from 'svelte-spa-router'
	import { Icon } from '@smui/common';
	import Centered from '@layouts/Centered.svelte'
	import IconButton, { Icon as IconButtonIcon } from '@smui/icon-button';
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

	:global(.material-icons.icon){
		font-size: 4em;
		margin: 0.3em 0
	}
</style>

<Centered>
	<IconButton class={'home'} on:click={() => push('/')}>
		<IconButtonIcon class="material-icons">home</IconButtonIcon>
	</IconButton>
	<h1 class='mdc-typography--headline3'>404</h1>
	<h2 class='mdc-typography--headline5'>Looks like we couldn't find that page!</h2>
	<Icon class="material-icons icon">help</Icon>
	<p class="mdc-typography--body1">Click here to go to the <a href={'/#'}>home page</a> or try and <a href={'/#/login'}>login</a></p>
</Centered>
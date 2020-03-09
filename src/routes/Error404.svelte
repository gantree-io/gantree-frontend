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

<Centered
	icon='help'
	title='404'
	subtitle="Looks like we couldn't find that page!"
	back={null}
	>
	<p class="mdc-typography--body1">Click here to go to the <a href={'/#'}>home page</a> or try and <a href={'/#/login'}>login</a></p>
</Centered>
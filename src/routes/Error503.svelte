<script>
	import { onMount } from 'svelte';
	import { push } from 'svelte-spa-router'
	import { Icon } from '@smui/common';
	import Centered from '@layouts/Centered.svelte'
	import IconButton, { Icon as IconButtonIcon } from '@smui/icon-button';
	import { checkConnection } from '@util/graphql';

	onMount(() => {
		let check = () => {
			checkConnection()
				.then(() => {
					push('/')
				})
		}

		check()
		
		let interval = setInterval(check, 2000)

		return () => {
			clearInterval(interval)
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

	:global(.material-icons.icon){
		font-size: 4em;
		margin: 0.3em 0
	}
</style>

<Centered
	icon='error'
	title='503'
	subtitle='Looks like a network error!'
	copy='Unfortunately the site is down - please try again later!'
	back={null}
/>
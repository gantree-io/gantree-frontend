<script>
	import Router from 'svelte-spa-router'
	import Home from '@routes/Home.svelte'
	import Dashboard from '@routes/Dashboard/_index.svelte'
	import Components from '@routes/Components.svelte'
	import Four04 from '@routes/Four04.svelte'

	const routes = {
		'/': Home,
		'/dashboard': Dashboard,
		'/dashboard/*': Dashboard,
		'/components': Components,
		'*': Four04
	}
</script>

<svelte:head>
  <link href="https://fonts.googleapis.com/css?family=Merriweather:300,700|Open+Sans:300,400&display=swap" rel="stylesheet">
</svelte:head>

<style>
	
	:root {
		--color-dark: #191919;
		--color-dark-grey: #31393D;
		--color-mid-grey: #879296;
		--color-grey: #b2b6b7;
		--color-light-grey: #e1e8ea;
		--color-light: #f8f8f8;
		--color-highlight: #40a8de;
		--color-mid-blue: #728ea8
		--color-light-blue: #8bc2d4;

		--font-size-xxlarge: 3.1rem;
		--font-size-xlarge: 2.2rem;
		--font-size-large: 1.5rem;
		--font-size-medium: 1rem;
		--font-size-small: 0.9rem;
		--font-size-xsmall: 12px;
		--font-size-xxsmall: 11px;
	}

	:global(*) {
		box-sizing: border-box
	}

	:global(html,body) {
		padding: 0;
		margin: 0;
		font-family: 'Open Sans', serif;
		font-weight: 100;
		color: var(--color-dark);
		scroll-behavior: smooth;
	}

	:global(h1) {
		font-size: var(--font-size-xlarge);
		font-weight: 700;
		margin-bottom: 0.5em;
		font-family: 'Merriweather', serif;
	}

	:global(h2){
		font-weight: 100;
		margin-bottom: 1em;
		font-family: 'Merriweather', serif;
	}
</style>

<Router {routes}/>
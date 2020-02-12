<script>
	import ApolloClient from "apollo-boost";
	import { configure } from '@util/graphql' 
	import Router from 'svelte-spa-router'
	import Panel from '@components/Panel.svelte'
	import Drawer from '@components/Drawer.svelte'
	import Modal from '@components/Modal.svelte'

	import Home from '@routes/Home.svelte'
	import Dashboard from '@routes/Dashboard.svelte'
	import Components from '@routes/Components.svelte'
	import Four04 from '@routes/Four04.svelte'

	configure({
		uri: _env.GRAPHQL_URL || "http://localhost:4000/graphql",
	})

	const routes = {
		'/': Home,
		'/dashboard': Dashboard,
		'/dashboard/*': Dashboard,
		'/components': Components,
		'*': Four04
	}
</script>

<svelte:head>
	<!-- <link href="https://fonts.googleapis.com/css?family=Merriweather:300,700|Open+Sans:300,400&display=swap" rel="stylesheet"> -->
	<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
	<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700">
	<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto+Mono">
</svelte:head>

<style lang="scss">
	:root {
		/* greyscale colors */
		--color-dark: #191919;
		--color-dark-grey: #31393D;
		--color-mid-grey: #879296;
		--color-grey: #b2b6b7;
		--color-light-grey: #e1e8ea;
		--color-light: #f8f8f8;
		
		/* colours */
		--color-highlight: #40a8de;
		--color-mid-blue: #728ea8;
		--color-light-blue: #8bc2d4;
		--color-green: #52c41a;
		--color-orange: #fa8c16;
		--color-red: #f5222d;
		--color-blue: #40a8de;
		--color-yellow: #fadb14;
		
		/* status colors */
		--color-status-success: var(--color-green);
		--color-status-warning: var(--color-yellow);
		--color-status-error: var(--color-red);
		--color-status-notification: var(--color-highlight);
		--color-status-neutral: var(--color-grey);
		
		/* font sizes */
		--font-size-xxlarge: 3.1rem;
		--font-size-xlarge: 2.2rem;
		--font-size-large: 1.5rem;
		--font-size-medium: 1rem;
		--font-size-small: 0.9rem;
		--font-size-xsmall: 12px;
		--font-size-xxsmall: 11px;

		:global(.mdc-typography--body1){
			font-weight: 300;
		}

	}

	:global(body){
		background: var(--color-light);
		font-weight: 100;
	}


	@keyframes -global-spin {
		from {transform:rotate(0deg);}
		to {transform:rotate(360deg);}
	}
</style>

<Router {routes}/>
<Panel/>
<Drawer/>
<Modal/>
<script>
	import ApolloClient from "apollo-boost";
	import GraphQL from '@util/graphql' 
	import { configure as configureHotwire } from '@components/Hotwire.svelte' 
	import AuthRouter, { configure as configureAuthRouter } from '@components/AuthRouter.svelte' 
	

	import Drawer from '@components/Drawer.svelte'
	import Modal from '@components/Modal.svelte'
	import Toaster from '@components/Toaster.svelte'

	// routes
	import Home from '@routes/Home.svelte'
	import Authenticate from '@routes/Authenticate.svelte'
	import Dashboard from '@routes/Dashboard.svelte'
	import Account from '@routes/Account.svelte'
	import AccountSetup from '@routes/AccountSetup.svelte'
	import Four04 from '@routes/Four04.svelte'
	// --> dashboard routes
	import DashboardHome from '@routes/DashboardOld/Home.svelte'
	import Network from '@archetypes/Network/Index.svelte'
	import Config from '@archetypes/Config/Index.svelte'
	import Keys from '@archetypes/Keys/Index.svelte'
	import Team from '@archetypes/Team/Index.svelte'
	import Billing from '@routes/DashboardOld/Billing.svelte'
	import Docs from '@routes/DashboardOld/Docs.svelte'


	import AppStore, { UserStatus, AccountStatus } from './store'
	import _ from 'lodash'
	import { get } from 'svelte/store';

	// configure graphql
	GraphQL.configure({
		uri: _env.GRAPHQL_URL, 
		token: () => _.get(get(AppStore), 'user.tokens.auth') 
	})
	
	// configure hotwire
	configureHotwire({url: _env.SOCKETIO_URL})
	
	// configure the router
	configureAuthRouter({
		notFound: Four04,
		authRoute: '/authenticate',
		onPrivateRoute: ({push, location}) => {
			AppStore.subscribe(({userStatus, accountStatus}) => {
				// not authenticated? push to auth page
				if(userStatus !== UserStatus.AUTHENTICATED) push(`/authenticate`)
				// account not complete? push to account/setup page 
				if(accountStatus === AccountStatus.INCOMPLETE) push(`/account/setup`)
			})
		}
	})

	const routes = {
		public: {
			'/': Home,
			'/authenticate': Authenticate,
		},
		private: {
			'/dashboard': Dashboard,
			'/dashboard/*': Dashboard,
			'/account': Account,
			'/account/setup': AccountSetup,
		}
	}
</script>

<svelte:head>
	<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
	<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700">
	<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto+Mono">
</svelte:head>

<style lang="scss">
	:root {
		/* greyscale colors */
		--color-dark: #191919;
		--color-dark-grey: #31393D;
		--color-mid-grey: #6d7679;
		--color-grey: #b2b6b7;
		--color-light-grey: #e1e8ea;
		--color-light: #f8f8f8;
		--color-xlight: #fbfbfb;
		
		/* colours */
		--color-highlight: #40b3ff;
		--color-mid-blue: #2196f3;
		--color-light-blue: #8bc2d4;
		--color-green: #4caf50;
		--color-orange: #ff9800;
		--color-red: #f44336;
		--color-blue: #40a8de;
		--color-yellow: #fadb14;
		
		/* status colors */
		--color-status-success: var(--color-green);
		--color-status-warning: var(--color-orange);
		--color-status-error: var(--color-red);
		--color-status-notification: var(--color-mid-blue);
		--color-status-neutral: var(--color-light-grey);
		
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

	:global(.material-icons.-animation-spin){
		animation-name: spin;
		animation-duration: 4000ms;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
	}
	
	:global(.mdc-list .mdc-list-item__graphic),
	:global(.mdc-list.mdc-list--dense .mdc-list-item__graphic){
		margin-right: 0.8em;
	}


	@keyframes -global-spin {
		from {transform:rotate(0deg);}
		to {transform:rotate(360deg);}
	}

	@keyframes -global-pulse {
		0% {opacity: 1}
		50% {opacity: 0.2}
		100% {opacity: 1}
	}

	:global(.material-icons.-animation-pulse){
		animation-name: pulse;
		animation-duration: 1000ms;
		animation-iteration-count: infinite;
		animation-timing-function: ease;
	}
</style>

<AuthRouter {routes}/>
<!-- <Router {routes}/> -->
<Drawer/>
<Modal/>
<Toaster/>
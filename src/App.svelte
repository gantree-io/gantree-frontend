<script>
	import { get } from 'svelte/store';
	import ApolloClient from "apollo-boost";
	import _ from 'lodash'
	import { configure as configureGraphQL } from '@util/graphql' 
	import { configure as configureHotwire, subscribe as hotwireSubscribe, setTeam as hotwireSetTeam } from '@components/Hotwire.svelte' 
	import AuthRouter, { configure as configureAuthRouter, triggerError, location, push } from '@components/AuthRouter.svelte'
	import AppStore, { UserStatus, AccountStatus, NetworkStatus } from './store'
	
	// ---> global components
	import Drawer from '@components/Drawer.svelte'
	import Modal from '@components/Modal.svelte'
	import Toaster, { toast } from '@components/Toaster.svelte'
	import Dialog from '@components/Dialog.svelte'
	
	// ---> routes
	import Home from '@routes/Home.svelte'
	import Authenticate from '@routes/Authenticate.svelte'
	import Dashboard from '@routes/Dashboard.svelte'
	import Account from '@routes/Account.svelte'
	import AccountSetup from '@routes/AccountSetup.svelte'
	import Error404 from '@routes/Error404.svelte'
	import Error503 from '@routes/Error503.svelte'

	// configure graphql
	configureGraphQL({
		uri: _env.GRAPHQL_URL, 
		token: () => _.get(get(AppStore), 'user.tokens.auth'),
		onNetworkError: msg => {
			triggerError(503)
		},
		onGraphQLError: e => {
			if(e.code === 'UNAUTHENTICATED'){
				// if we're on the authenticate page then stop authenticating
				if($location === '/authenticate'){
					//AppStore.logout()
					push(`/`)
				}else{
					push(`/authenticate`)
				}
			}
		}
	})
	
	// configure hotwire
	configureHotwire({
		url: _env.SOCKETIO_URL,
		onDisconnect: () => {
			toast.warning(`Socket disconnected: You are no longer receving live updates from the server`)
		},
		onReconnect: () => {
			toast.success(`Socket connected: You are now receving live updates from the server`)
		}
	})
	
	// configure the router
	configureAuthRouter({
		errorRoutes: {
			404: Error404,
			503: Error503
		},
		onPrivateRoute: ({location}) => {
			AppStore.subscribe(({userStatus, accountStatus}) => {
				// not authenticated? push to auth page
				if(userStatus !== UserStatus.AUTHENTICATED) push(`/authenticate?redirect=${$location}`)
				// account not complete? push to account/setup page 
				else if(accountStatus === AccountStatus.INCOMPLETE) push(`/account/setup`)
			})
		}
	})
	
	// configure routes
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

	// handle login/logout
	AppStore.onLogin((user) => {
		// TODO set hotwire teamID.... (room prefix...?)
		hotwireSetTeam(user.team._id)

		// subscribe to updates on this user
		hotwireSubscribe(user._id, `UPDATE`, _updateduser => {
			console.log(_updateduser)

			// update(props => ({
			// 	...props,
			// 	user: {
			// 		...props.user,
			// 		name: _updateduser.name,
			// 		subscribed: _updateduser.subscribed
			// 	},
			// }))
		})

		


		push(`/dashboard`)
	})
	AppStore.onLogout(() => push(`/`))
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
		:global(strong){ font-weight: 500 } 
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

	:global(.material-icons.-animation-spin){
		animation-name: spin;
		animation-duration: 3000ms;
		animation-iteration-count: infinite;
		animation-timing-function: ease;
	}

	:global(.inline-link){
		color: var(--color-mid-blue);
		font-weight: 400;
		cursor: pointer
	}

	:global(*[class^='mdc-typography']){
		:global(.smaller){
			font-size: 0.9em
		}
	}
</style>

<AuthRouter {routes}/>
<Drawer/>
<Modal/>
<Toaster/>
<Dialog/>
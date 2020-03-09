import { writable } from 'svelte/store';
import firebase from 'firebase/app'
import 'firebase/auth'
import * as firebaseui from 'firebaseui'
import { query, mutation } from '@util/graphql'

let onLogin = () => {}
let onLoginFailure = () => {}
let onLogout = () => {}

// the status of the app connection to the backend
export const NetworkStatus = {
	INITIALISED: 'INITIALISED',
	ONLINE: 'ONLINE',
	OFFLINE: 'OFFLINE',
}

// the user auth status
export const UserStatus = {
	INITIALISED: 'INITIALISED',
	UNAUTHENTICATED: 'UNAUTHENTICATED',
	LOADING: 'LOADING',
	AUTHENTICATED: 'AUTHENTICATED'
}

// user account status is used to determine if 
// the users' account is complete enough to continue
// to dashboard, or be intercepted by a create account page
export const AccountStatus = {
	UNKNOWN: 'UNKNOWN',
	INCOMPLETE: 'INCOMPLETE',
	COMPLETE: 'COMPLETE',
}

export const fetchUserByToken = `
	query authByFirebaseToken($token: String!) {
		authByFirebaseToken(token: $token) {
			_id
			name
			email
			uid
			subscribed
			team{
				_id
				name
			}
			tokens{
				auth
				refresh
			}
		}
	}
`;

export const setName = `
	mutation setName($name: String,) {
		setName(name: $name) {
			_id
		}
	}
`;

export const updateAccount = `
	mutation updateAccount($name: String!, $subscribed: Boolean!) {
		updateAccount(name: $name, subscribed: $subscribed)
	}
`

export default (() => {
	const defaultProps = {
		user: {},
		firebaseUser: {},
		networkStatus: NetworkStatus.INITIALISED,
		userStatus: UserStatus.INITIALISED,
		accountStatus: AccountStatus.UNKNOWN
	}
	
	const { set, update, subscribe } = writable(defaultProps);

	// can be extended later to add more checks
	const _determineAccountStatus = user => {
		return user.name ? AccountStatus.COMPLETE : AccountStatus.INCOMPLETE
	}
	
	const _handleLogin = firebaseUser => {
		update(props => ({
			...props,
			user: {},
			firebaseUser: firebaseUser,
			userStatus: UserStatus.LOADING
		}))

		firebaseUser.getIdToken().then(token => {
			query(fetchUserByToken, {token: token}).then(user => {
				update(props => ({
					...props,
					user: user,
					userStatus: UserStatus.AUTHENTICATED,
					accountStatus: _determineAccountStatus(user)
				}))

				// fire login callbacks
				onLogin(user)
			}).catch(e => {
				onLoginFailure()
			})
		})
	}

	const _handleLogout = redirect => {
		set({
			...defaultProps,
			userStatus: UserStatus.UNAUTHENTICATED,
			accountStatus: AccountStatus.UNKNOWN
		})
		firebase.auth().signOut()
		onLogout()
	}

	firebase.initializeApp({
		apiKey: _env.FIREBASE_APIKEY,
		authDomain: _env.FIREBASE_AUTHDOMAIN,
		databaseURL: _env.FIREBASE_DATABASEURL,
		projectId: _env.FIREBASE_PROJECTID,
		storageBucket: _env.FIREBASE_STORAGEBUCKET,
		messagingSenderId: _env.FIREBASE_MESSAGINGSENDERID,
		appId: _env.FIREBASE_APPID,
	});
	firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
	firebase.auth().onAuthStateChanged(firebaseUser => {
		firebaseUser
			? _handleLogin(firebaseUser)
			: update(props => ({
				...defaultProps,
				userStatus: UserStatus.UNAUTHENTICATED,
			}))
	})
	
	return {
		subscribe,
		firebase: writable({
			firebase: firebase,
			ui: new firebaseui.auth.AuthUI(firebase.auth(), () => {})
		}),
		setUserName: name => {
			update(props => ({
				...props,
				user: {
					...props.user,
					name: name
				},
				accountStatus: AccountStatus.COMPLETE
			}))
		},
		setNetworkStatus: status => {
			update(props => ({
				...props,
				NetworkStatus: Object.keys(NetworkStatus).includes(status) ? status : NetworkStatus.OFFLINE
			}))
		},
		logout: redirect => _handleLogout(redirect),
		myself: () => defaultProps.user,
		onLogin: cb => onLogin = cb,
		onLoginFailure: cb => onLoginFailure = cb,
		onLogout: cb => onLogout = cb,
		query: query,
		mutation: mutation,
	}
})()
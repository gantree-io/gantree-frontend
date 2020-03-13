import { writable } from 'svelte/store';
import firebase from 'firebase/app'
import 'firebase/auth'
import * as firebaseui from 'firebaseui'
import { query, mutation } from '@util/graphql'
import _ from 'lodash'

let authAttemptCallback = () => {}
let authSuccessCallback = () => {}
let authFailureCallback = () => {}
let logoutCallback = () => {}

// the user auth status
export const AuthStatus = {
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
	mutation setName($name: String!) {
		setName(name: $name) {
			_id
			name
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
		authStatus: AuthStatus.INITIALISED,
		accountStatus: AccountStatus.UNKNOWN
	}
	
	const { set, update, subscribe } = writable(defaultProps);

	// can be extended later to add more checks
	const _determineAccountStatus = user => {
		return user.name ? AccountStatus.COMPLETE : AccountStatus.INCOMPLETE
	}
	
	const _handleLoginApp = firebaseUser => {
		authAttemptCallback()

		update(props => ({
			...props,
			user: {},
			firebaseUser: firebaseUser,
			authStatus: AuthStatus.LOADING
		}))

		firebaseUser.getIdToken().then(token => {
			query(fetchUserByToken, {token: token}).then(user => {
				update(props => ({
					...props,
					user: user,
					authStatus: AuthStatus.AUTHENTICATED,
					accountStatus: _determineAccountStatus(user)
				}))

				// fire login callbacks
				authSuccessCallback(user)
			}).catch(e => {
				authFailureCallback(e)
			})
		})
	}

	const _handleLogoutApp = redirect => {
		set({
			...defaultProps,
			authStatus: AuthStatus.UNAUTHENTICATED,
			accountStatus: AccountStatus.UNKNOWN
		})
		firebase.auth().signOut()
		logoutCallback()
	}

	const _createFirebaseAccount = ({email, password}) => new Promise((resolve, reject) => {
		firebase.auth()
			.createUserWithEmailAndPassword(email, password)
			.then(user => resolve('Welcome to gantree'))
			.catch(e => reject(e.message));
	});

	const _loginFirebaseAccount = ({email, password}) => new Promise((resolve, reject) => {
		firebase.auth()
			.signInWithEmailAndPassword(email, password)
			.then(user => resolve())
			.catch(e => reject(e.message));
	});

	const _setUsername = name => {
		update(props => ({
			...props,
			user: {
				...props.user,
				name: name
			},
			accountStatus: AccountStatus.COMPLETE
		}))
	}

	const _setUserPreferences = (name, subscribed) => {
		update(props => ({
			...props,
			user: {
				...props.user,
				name: name,
				subscribed: subscribed
			}
		}))
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
			? _handleLoginApp(firebaseUser)
			: update(props => ({
				...defaultProps,
				authStatus: AuthStatus.UNAUTHENTICATED,
			}))
	})
		
	return {
		subscribe,
		configure: ({onAuthAttempt=()=>{}, onAuthSuccess=()=>{}, onAuthFailure=()=>{}, onLogout=()=>{}}) => {
			authAttemptCallback = onAuthAttempt
			authSuccessCallback = onAuthSuccess
			authFailureCallback = onAuthFailure
			logoutCallback = onLogout
		},
		firebase: writable({
			firebase: firebase,
			ui: new firebaseui.auth.AuthUI(firebase.auth(), () => {})
		}),
		create: _createFirebaseAccount,
		login: _loginFirebaseAccount,
		setUserName: _setUsername,
		setUserPreferences: _setUserPreferences,
		logout: redirect => _handleLogoutApp(redirect),
		myself: () => defaultProps.user,
		query: query,
		mutation: mutation,
	}
})()
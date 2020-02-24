import { writable } from 'svelte/store';
import { push } from 'svelte-spa-router'
import firebase from 'firebase/app'
import 'firebase/auth'
import * as firebaseui from 'firebaseui'
import { query, mutation } from '@util/graphql'
import { toast } from '@components/Toaster.svelte'

export const UserStatus = {
	UNAUTHENTICATED: 'unauthenticated',
	LOADING: 'loading',
	AUTHENTICATED: 'authenticated'
}

export const AccountStatus = {
	UNKNOWN: 'UNKNOWN',
	INCOMPLETE: 'INCOMPLETE',
	COMPLETE: 'COMPLETE',
}

const fetchUserByToken = `
	query authByFirebaseToken($token: String!) {
		authByFirebaseToken(token: $token) {
			_id
			name
			email
			uid
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
			name
		}
	}
`;

export default (() => {
	const defaultProps = {
		user: {},
		firebaseUser: {},
		userStatus: UserStatus.LOADING,
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
			})
		})
	}

	const _handleLogout = () => {
		set({
			...defaultProps,
			userStatus: UserStatus.UNAUTHENTICATED,
			accountStatus: AccountStatus.UNKNOWN
		})
		firebase.auth().signOut()
		toast.success(`You have been logged out`)
		push('/')
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
			: update({
				...defaultProps,
				userStatus: UserStatus.UNAUTHENTICATED,
				accountStatus: AccountStatus.UNKNOWN
			})
	})
	
	return {
		//set,
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
		logout: () => _handleLogout(),
		myself: () => defaultProps.user,
		query: query,
		mutation: mutation
	}
})()
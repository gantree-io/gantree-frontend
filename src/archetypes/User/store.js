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

const fetchUserByToken = token => {
	const _q = `
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

	return new Promise(async (resolve, reject) => {
		let res = await query(_q, {variables: {token: token}})
		resolve(res)
	});
}

export default (() => {
	const defaultProps = {
		user: {},
		firebaseUser: {},
		status: UserStatus.LOADING
	}
	
	const { set, update, subscribe } = writable(defaultProps);
	
	const _handleLogin = (firebaseUser) => {
		update(props => ({
			...props,
			user: {},
			firebaseUser: firebaseUser,
			status: UserStatus.LOADING
		}))

		firebaseUser.getIdToken().then(token => {
			fetchUserByToken(token).then(user => {
				update(props => ({
					...props,
					user: user,
					status: UserStatus.AUTHENTICATED
				}))
				
				//toast.success(`Login success!`)
				//push('/dashboard')
			})
		})
	}

	const _handleLogout = () => {
		set({
			...defaultProps,
			status: UserStatus.UNAUTHENTICATED
		})
		firebase.auth().signOut()
		//toast.success(`You are logged out`)
		//push('/')
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
			: _handleLogout()
	})
	
	return {
		set,
		subscribe,
		firebase: writable({
			firebase: firebase,
			ui: new firebaseui.auth.AuthUI(firebase.auth(), () => {})
		}),
		logout: _handleLogout,
		myself: () => defaultProps.user
	}
})()
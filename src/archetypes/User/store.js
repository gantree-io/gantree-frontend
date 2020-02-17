import { writable } from 'svelte/store';
import firebase from 'firebase/app'
import 'firebase/auth'
import * as firebaseui from 'firebaseui'

export const UserStatus = {
	UNAUTHENTICATED: 'unauthenticated',
	LOADING: 'loading',
	AUTHENTICATED: 'authenticated'
}

const firebaseConfig = {
	apiKey: "AIzaSyDtF0783dgbnYi-Xwd_ZfRe12zalaFTREA",
	authDomain: "gantree-50eb3.firebaseapp.com",
	databaseURL: "https://gantree-50eb3.firebaseio.com",
	projectId: "gantree-50eb3",
	storageBucket: "gantree-50eb3.appspot.com",
	messagingSenderId: "670057554526",
	appId: "1:670057554526:web:672e61e2e9be32da3c8acf"
};



export default (() => {
	//const _user = writable({});
	//const _status = writable(UserStatus.UNAUTHENTICATED);

	console.log(_env)

	const defaultProps = {
		user: {},
		firebaseUser: {},
		status: UserStatus.UNAUTHENTICATED
	}
	
	const { set, update, subscribe } = writable(defaultProps);
	
	const _handleLogin = (firebaseUser) => {
		update(props => ({
			...props,
			user: {},
			firebaseUser: firebaseUser,
			status: UserStatus.LOADING
		}))

		// 1. fetch user from backend
		// 2. add to store
		

		
		setTimeout(() => {
			update(props => ({
				...props,
				user: {
					name: firebaseUser.displayName,
					to: 'do'
				},
				status: UserStatus.AUTHENTICATED
			}))
		}, 1000)
	}

	const _handleLogout = () => {
		set(defaultProps)
		firebase.auth().signOut()
	}


	firebase.initializeApp(firebaseConfig);
	firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
	firebase.auth().onAuthStateChanged(firebaseUser => {
		if(firebaseUser){
			_handleLogin(firebaseUser)
		}
		else{
			_handleLogout()
		}
	})

	return {
		set,
		subscribe,
		firebase: writable({
			firebase: firebase,
			ui: new firebaseui.auth.AuthUI(firebase.auth(), () => {})
		}),
		logout: _handleLogout,
	}
})()
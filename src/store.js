import { writable } from 'svelte/store';
import firebase from 'firebase/app'
import 'firebase/auth'

const UserStatus = {
	UNAUTHENTICATED: 'unauthenticated',
	LOADING: 'loading',
	AUTHENTICATED: 'authenticated'
}

const firebaseConfig = {
	apiKey: "AIzaSyDSg06jv2614Cq4BKkHWpkjVtguEKBQYFQ",
	authDomain: "abridged-portal.firebaseapp.com",
	databaseURL: "https://abridged-portal.firebaseio.com",
	projectId: "abridged-portal",
	storageBucket: "",
	messagingSenderId: "654729408536",
	appId: "1:654729408536:web:ae00a171327d319c0f536d"
}

const user = () => {
	const userStore = writable(null);
	const statusStore = writable(UserStatus.UNAUTHENTICATED);
	const tokenStore = writable({});
	const firebaseStore = writable({});
	
	const handleUserLogin = user => {
		console.log(user)
		//userStore.update
		// 1. fetch user from backend
		// 2. add to store
	}

	const handleUserLogout = () => {
		userStore.update(null)
		statusStore.update(UserStatus.UNAUTHENTICATED)
	}

	firebase.initializeApp(firebaseConfig);
	firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
	firebase.auth().onAuthStateChanged(user => userStore.update(user))

	return {
		user: userStore.subscribe,
		status: statusStore.subscribe,
		token: tokenStore.subscribe,
		firebase: firebaseStore.subscribe,
		login: handleUserLogin,
		logout: handleUserLogout,
	}
}


const _Drawer = () => {
	const initialProps = {
		component: null,
		props: {},
		header: {
			title: null,
			subtitle: null,
			actions: []
		}
	}
	
	const { subscribe, update } = writable(initialProps);

	return {
		subscribe,
		open: (component, props, header) => update(() => ({
			component: component, 
			props: props||{}, 
			header: header||[]
		})),
		close: () => update((val) => initialProps),
	};
}

const _Modal = () => {
	const initialProps = {
		component: null,
		props: {},
		header: {
			title: null,
			subtitle: null,
			actions: []
		}
	}
	
	const { subscribe, update } = writable(initialProps);

	return {
		subscribe,
		open: (component, props, header) => update(() => ({
			component: component, 
			props: props||{}, 
			header: header||[]
		})),
		close: () => update((val) => initialProps),
	};
}

const _Notification = () => {
	const { subscribe, set } = writable(null);

	return {
		subscribe,
		open: text => set(text),
		//close: () => set(null),
	};
}



//export const Panel = Panel();
export const Drawer = _Drawer();
export const Modal = _Modal();
export const Notification = _Notification();
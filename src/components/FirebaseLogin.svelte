<script>
	import * as firebaseui from 'firebaseui'
	import firebase from 'firebase/app'
	import 'firebase/auth'
	import Button from '@smui/button';

	export let providers = ['Google']

	const firebaseConfig = {
		apiKey: "AIzaSyDtF0783dgbnYi-Xwd_ZfRe12zalaFTREA",
		authDomain: "gantree-50eb3.firebaseapp.com",
		databaseURL: "https://gantree-50eb3.firebaseio.com",
		projectId: "gantree-50eb3",
		storageBucket: "gantree-50eb3.appspot.com",
		messagingSenderId: "670057554526",
		appId: "1:670057554526:web:672e61e2e9be32da3c8acf"
	};

	firebase.initializeApp(firebaseConfig);
	firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
	//firebase.auth().onAuthStateChanged(user => userStore.update(user))


	const uiConfig = {
		signInFlow: 'popup',
		signInSuccessUrl: '/',
		signInOptions: providers.map(provider => firebase.auth[`${provider}AuthProvider`].PROVIDER_ID),
		callbacks:{
			signInSuccessWithAuthResult: ({user}, redirectUrl) => {
				console.log(user)
				//handleUserLogin(user)
				return false
			},
			signInFailure: () => {
				//handleUserLogout(user)
				return false
			}
		}
	};
	//console.log(firebaseui.auth.AuthUI)

	const ui = new firebaseui.auth.AuthUI(firebase.auth(), () => {});

	ui.start('#firebaseui-auth-container', uiConfig);
</script>

<div id='firebaseui-auth-container'>
	<Button variant='text' dense>
		GoogleAuth
	</Button>
</div>
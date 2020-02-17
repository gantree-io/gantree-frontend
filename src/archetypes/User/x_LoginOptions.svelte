<script>
	import * as firebaseui from 'firebaseui'
	import firebase from 'firebase/app'
	import 'firebase/auth'
	import Button from '@smui/button';

	import Store from './store'


	// subscribe to incoming requests
	Store.user.subscribe(data => {
		console.log(111, data)
	});

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

	//const ui = new firebaseui.auth.AuthUI(firebase.auth(), () => {});

	//ui.start('#firebaseui-auth-container', uiConfig);
</script>

<div id='firebaseui-auth-container'>
	<Button variant='text' dense>
		GoogleAuth
	</Button>
</div>
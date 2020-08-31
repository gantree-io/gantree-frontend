import { writable } from "svelte/store"
import firebase from "firebase/app"
import "firebase/auth"
import * as firebaseui from "firebaseui"
import { query, mutation } from "@util/graphql"
// import _ from "lodash"

let authAttemptCallback = () => {}
let authSuccessCallback = () => {}
let authFailureCallback = () => {}
let signoutCallback = () => {}

// the user auth status
export const AuthStatus = {
  INITIALISED: "INITIALISED",
  UNAUTHENTICATED: "UNAUTHENTICATED",
  LOADING: "LOADING",
  AUTHENTICATED: "AUTHENTICATED",
}

// user account status is used to determine if
// the users' account is complete enough to continue
// to dashboard, or be intercepted by a create account page
export const AccountStatus = {
  UNKNOWN: "UNKNOWN",
  INCOMPLETE: "INCOMPLETE",
  UNVERIFIED: "UNVERIFIED",
  COMPLETE: "COMPLETE",
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
			verificationCode
			status
			tokens{
				auth
				refresh
			}
			apiKey
		}
	}
`

export const fetchUserByApiKey = `
	query authByApiKey($key: String!) {
		authByApiKey(key: $key) {
			_id
			name
			email
			uid
			subscribed
			team{
				_id
				name
			}
			verificationCode
			status
			tokens{
				auth
				refresh
			}
			apiKey
		}
	}
`

export const verifyAccount = `
	query verifyAccount($verificationCode: Int!) {
		verifyAccount(verificationCode: $verificationCode) {
			verificationCode
			status
		}
	}
`

export const setName = `
	mutation setName($name: String!) {
		setName(name: $name) {
			_id
			name
		}
	}
`

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
    accountStatus: AccountStatus.UNKNOWN,
  }

  const { set, update, subscribe } = writable(defaultProps)

  // can be extended later to add more checks
  const _determineAccountStatus = (user) => {
    let status = AccountStatus.COMPLETE
    if (!user.name) status = AccountStatus.INCOMPLETE
    if (user.status === "UNVERIFIED") status = AccountStatus.UNVERIFIED
    return status
  }

  const _handleLoginApp = (firebaseUser) => {
    authAttemptCallback()

    update((props) => ({
      ...props,
      user: {},
      firebaseUser: firebaseUser,
      authStatus: AuthStatus.LOADING,
    }))

    firebaseUser.getIdToken().then((token) => {
      query(fetchUserByToken, { token: token })
        .then((user) => {
          update((props) => ({
            ...props,
            user: user,
            authStatus: AuthStatus.AUTHENTICATED,
            accountStatus: _determineAccountStatus(user),
          }))

          // fire login callbacks
          authSuccessCallback(user)
        })
        .catch((e) => {
          authFailureCallback(e)
        })
    })
  }

  const _handleSignout = (redirect) => {
    firebase.auth().signOut()
    set({
      ...defaultProps,
      authStatus: AuthStatus.UNAUTHENTICATED,
      accountStatus: AccountStatus.UNKNOWN,
    })
    signoutCallback(redirect)
  }

  const _createFirebaseAccount = ({ email, password }) =>
    new Promise((resolve, reject) => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((user) => resolve("Welcome to gantree"))
        .catch((e) => reject(e.message))
    })

  const _signinFirebaseAccount = ({ email, password }) =>
    new Promise((resolve, reject) => {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((user) => resolve())
        .catch((e) => reject(e.message))
    })

  const _verifyAccount = ({ verificationCode }) =>
    new Promise((resolve, reject) => {
      query(verifyAccount, { verificationCode: verificationCode })
        .then((user) => {
          update((props) => ({
            ...props,
            user: {
              ...props.user,
              verificationCode: user.verificationCode,
              status: user.status,
            },
            accountStatus: _determineAccountStatus(user),
          }))

          resolve(user)
        })
        .catch((e) => {
          reject(e)
        })
    })

  const _setUsername = (name) => {
    update((props) => ({
      ...props,
      user: {
        ...props.user,
        name: name,
      },
      accountStatus: AccountStatus.COMPLETE,
    }))
  }

  const _setUserPreferences = (name, subscribed) => {
    update((props) => ({
      ...props,
      user: {
        ...props.user,
        name: name,
        subscribed: subscribed,
      },
    }))
  }

  firebase.initializeApp({
    apiKey: _env.FIREBASE_APIKEY, // eslint-disable-line no-undef
    authDomain: _env.FIREBASE_AUTHDOMAIN, // eslint-disable-line no-undef
    databaseURL: _env.FIREBASE_DATABASEURL, // eslint-disable-line no-undef
    projectId: _env.FIREBASE_PROJECTID, // eslint-disable-line no-undef
    storageBucket: _env.FIREBASE_STORAGEBUCKET, // eslint-disable-line no-undef
    messagingSenderId: _env.FIREBASE_MESSAGINGSENDERID, // eslint-disable-line no-undef
    appId: _env.FIREBASE_APPID, // eslint-disable-line no-undef
  })
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  firebase.auth().onAuthStateChanged((firebaseUser) => {
    firebaseUser
      ? _handleLoginApp(firebaseUser)
      : update((props) => ({
          ...defaultProps,
          authStatus: AuthStatus.UNAUTHENTICATED,
        }))
  })

  return {
    subscribe,
    configure: ({
      onAuthAttempt = () => {},
      onAuthSuccess = () => {},
      onAuthFailure = () => {},
      onSignout = () => {},
    }) => {
      authAttemptCallback = onAuthAttempt
      authSuccessCallback = onAuthSuccess
      authFailureCallback = onAuthFailure
      signoutCallback = onSignout
    },
    firebase: writable({
      firebase: firebase,
      ui: new firebaseui.auth.AuthUI(firebase.auth(), () => {}),
    }),
    create: _createFirebaseAccount,
    signin: _signinFirebaseAccount,
    verify: _verifyAccount,
    setUserName: _setUsername,
    setUserPreferences: _setUserPreferences,
    signout: (redirect) => _handleSignout(redirect),
    myself: () => defaultProps.user,
    query: query,
    mutation: mutation,
  }
})()

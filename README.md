# 🎯 Gantree Frontend App

Spin up a dev environment:

1. Clone repo  
2. Fetch all module dependencies: `$> yarn`  
3. Copy `.env.example` to `.env` and update values (see below)  
4. Make sure there is a [Gantree web backend](https://bitbucket.org/flexdapps/gantree-backend/src/master/) instance running

##important
FirebaseUI is not compatible out of the box with Rollup. You need to make one tweak to the firebaseui code.  
Edit `/node-modules/firebaseui/dist/ems.js` and change `import * as firebase from 'firebase/app'` to `import firebase from 'firebase/app'`

(there's most likely a workaround for this somewhere)

##### Local Development
`yarn dev` 

##### Production Build
`...todo`

##### .env.local
`REACT_APP_GRAPH_ENDPOINT=https://your.graph.endpoint`  graphql endpoint

`GRAPHQL_URL=http://localhost:4000/graphql` graphql endpoint
`SOCKETIO_URL=http://localhost:3000` socketio URL
`MODE=dev` production|dev
`FIREBASE_APIKEY=[xxx]` firebase credentails
`FIREBASE_AUTHDOMAIN=[xxx]` firebase credentails
`FIREBASE_DATABASEURL=[xxx]` firebase credentails
`FIREBASE_PROJECTID=[xxx]` firebase credentails
`FIREBASE_STORAGEBUCKET=[xxx]` firebase credentails
`FIREBASE_MESSAGINGSENDERID=[xxx]` firebase credentails
`FIREBASE_APPID=[xxx]` firebase credentails

#### Notes
Graphical elements sourced form [Undraw](https://undraw.co)
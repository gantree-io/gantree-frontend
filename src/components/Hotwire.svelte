<script context="module">
	let _url = "http://localhost:3000"
	let _prefix
	let handleDisconnect
	let handleReconnect

	export const configure = ({prefix='', url, onDisconnect=()=>{}, onReconnect=()=>{}}) => {
		_prefix = prefix
		_url = url
		handleDisconnect = onDisconnect
		handleReconnect = onReconnect
	}

	export const subscribe = (name, event, callback) => _subscribe([{name, event, callback}])

	const SUBSCRIPTIONS = {};
	let _socket

	// connect to our socket endpoint
	const connect = () => socket(_url, {
		reconnection: true,
		reconnectionDelay: 1000,
		reconnectionDelayMax : 2000,
		reconnectionAttempts: 5
	})
	
	// get the global socket connection
	const useSocket = () => new Promise((resolve, reject) => {
		if(!_socket){
			_socket = connect()
				.on('error', () => console.log('todo: error'))
				.on('connect', () => resolve(_socket))
				.on('reconnect', () => handleReconnect())
				.on('reconnect_failed', () => handleDisconnect())
		}else{
			resolve(_socket)
		}
	})

	const _subscribe = subs => useSocket()
		.then(io => {
			let idpool = []
			subs.forEach(sub => {
				if(!_prefix) return

				const id = uuid()
				const event = `${_prefix}.${sub.name}.${sub.event}`

				// no event space? create event space
				if(!SUBSCRIPTIONS[event]) { SUBSCRIPTIONS[event] = {} }

				// add to callback to event
				SUBSCRIPTIONS[event][id] = sub.callback

				// join room
				io.emit('joinroom', event)
			
				// fire callbacks for all event subscriptions
				io.on(event, data => Object.values(SUBSCRIPTIONS[event]).map(cb => cb(data)))
				
				// add event ID to pool
				idpool.push(id)
			})

			return idpool
		})

	const _unsubscribe = ids => useSocket()
		.then(io => {
			//console.log(ids)
			Object.keys(SUBSCRIPTIONS).map(event => {
				Object.keys(SUBSCRIPTIONS[event]).map(id => {
					if(ids.includes(id)){
						delete SUBSCRIPTIONS[event][id]
						
						// trigger leave room if no longer any listeners
						if(Object.keys(SUBSCRIPTIONS[event]).length <= 0){
							io.emit('leaveroom', event)
						}
					}
				})
			})
		})
</script>

<script>
	import { onMount, setContext, getContext } from 'svelte';
	import uuid from 'uuid/v4'
	import _ from 'lodash'
	import socket from 'socket.io-client';

	export let subscriptions
	
	// on mount we want to establish a connection a particular event, on a
	// paticular object, for a paticular team, defined by the room...!
	// 
	// ie: 3rd parties cannot subscribe to updates to updates on objects which don't belong
	// to them - we can make this unique with the team._id and check serverside
	// before subscribing 
	//
	// TODO: we need to hash the event with the team ID so events are unique
	// to a team - ie: the same members on the team will receive the same updates 
	// when subbed to the same event
	// Include the TEAM ID if one exists
	onMount( () => {
		let localIDs = []
		_subscribe(subscriptions).then(_localIDs => localIDs = _localIDs)
		return () => _unsubscribe(localIDs)
	})
</script>

<slot/>
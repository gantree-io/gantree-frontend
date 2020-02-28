<script context="module">
	let _url = "http://localhost:3000"
	export const configure = ({url}) => _url = url
	export const subscribe = (event, callback) => _subscribe([{event, callback}])
	const SUBSCRIPTIONS = {};
	let _socket

	// connect to our socket endpoint
	const connect = () => io(_url, {
		reconnection: true,
		reconnectionDelay: 1000,
		reconnectionDelayMax : 1000,
		reconnectionAttempts: 5
	})
	.on('error', () => console.log('todo: error'))

	// get the global socket connection
	const useSocket = () => new Promise((resolve, reject) => {
		if(!_socket){
			_socket = connect()
				.on('connect', () => resolve(_socket))
				.on('reconnect', () => resolve(_socket))
				.on('disconnect', () => connect())
		}else{
			resolve(_socket)
		}
	})

	const _subscribe = _subscriptions => useSocket()
		.then(_io => {
			let _ids = []
			_subscriptions.forEach(_subscription => {
				const _id = uuid()

				// add to subscriptions pool
				SUBSCRIPTIONS[_id] = _subscription
				
				// fire callback for all event subscriptions
				_io.on(_subscription.event, data => {
					_.filter(Object.values(SUBSCRIPTIONS), { 'event': _subscription.event })
						.map(s => s.callback(data))
				})

				// join room
				_io.emit('joinroom', _subscription.event)

				_ids.push(_id)
			})

			return _ids
		})

	const _unsubscribe = ids => useSocket()
		.then(_io => {
			ids.forEach(id => {
				_io.emit('leaveroom', SUBSCRIPTIONS[id].event)
				delete SUBSCRIPTIONS[id]
			})
		})
</script>

<script>
	import { onMount, setContext, getContext } from 'svelte';
	import uuid from 'uuid/v4'
	import _ from 'lodash'
	import io from 'socket.io-client';

	export let subscriptions
	
	// on mount we want to establish a connection a particular event, on a
	// paticular object, for a paticular team, defined by the room...!
	// 
	// ie: 3rd parties cannot subscribe to updates to objects which don't belong
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
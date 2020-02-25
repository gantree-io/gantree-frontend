<script>
	import { onMount, createEventDispatcher } from 'svelte';
	import uuid from 'uuid/v4'
	import _ from 'lodash'
	import io from 'socket.io-client';

	export let event
	const dispatch = createEventDispatcher();
	let _socket
	let _url = "http://localhost:3000"
	const _subscriptions = []

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
		
		if(!event) return null

		let unsubscribeCallback = () => {}

		useSocket()
			.then(_io => {
				const _id = uuid()

				_subscriptions[_id] = {
					event: event, 
					callback: msg => dispatch('update', msg)
				}

				_io.on(event, data => {
					_.filter(Object.values(_subscriptions), { 'event': event })
						.map(subscription => subscription.callback(data))
				})

				// join room
				_io.emit('joinroom', event)

				// remove subscription by id 
				const unsubscribe = _id => {
					const subscription = _subscriptions[_id]
					const event = subscription.event
					delete subscription[_id]
					useSocket().then(_io => _io.emit('leaveroom', event))
				}

				unsubscribeCallback = () => unsubscribe(_id)
			})

		return () => unsubscribeCallback()
	})
</script>

<script context="module">
	export const configure = ({url}) => _url = url
</script>

<slot/>
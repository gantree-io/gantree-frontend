<script context="module">
	let _url = "http://localhost:3000"
	let _team
	let handleDisconnect
	let handleReconnect

	export const configure = ({url, onDisconnect=()=>{}, onReconnect=()=>{}}) => {
		_url = url
		handleDisconnect = onDisconnect
		handleReconnect = onReconnect
	}

	export const subscribe = (name, event, callback) => _subscribe([{name, event, callback}])

	export const setTeam = team => {
		_team = team
	}
	
	const SUBSCRIPTIONS = {};
	let _socket

	// connect to our socket endpoint
	const connect = () => io(_url, {
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

	const _subscribe = _subs => useSocket()
		.then(_io => {
			let _ids = []
			_subs.forEach(_sub => {
				const _id = uuid()
				const _room = `${_team}.${_sub.name}`

				// add to subscriptions pool
				SUBSCRIPTIONS[_id] = {
					room: _room,
					callback: _sub.callback
				}

				// join room
				_io.emit('joinroom', _room)
			
				// fire callback for all event subscriptions
				_io.on(`${_sub.name}.${_sub.event}`, data => {
					_.filter(Object.values(SUBSCRIPTIONS), { 'room': _room })
						.map(s => s.callback(data))
				})

				_ids.push(_id)
			})

			return _ids
		})

	const _unsubscribe = ids => useSocket()
		.then(_io => {
			ids.forEach(id => {
				_io.emit('leaveroom', SUBSCRIPTIONS[id].room)
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
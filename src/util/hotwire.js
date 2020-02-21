import uuid from 'uuid/v4'
import _ from 'lodash'
import io from 'socket.io-client';

let _socket
let _url = "http://localhost:3000"
const _subscriptions = []

// connect to our socket endpoint
const _connect = () => io(_url || "http://localhost:3000", {
	reconnection: true,
	reconnectionDelay: 1000,
	reconnectionDelayMax : 1000,
	reconnectionAttempts: 5
})
.on('error', () => console.log('todo: error'))

// get the global socket connection
const _useSocket = () => new Promise((resolve, reject) => {
	if(!_socket){
		_socket = _connect()
		_socket
			.on('connect', () => resolve(_socket))
			.on('reconnect', () => resolve(_socket))
			.on('disconnect', () => _connect())
	}else{
		resolve(_socket)
	}
})

const _configure = ({url}) => {
	_url = url
}

// remove subscription by id 
const _unsubscribe = async _id => {
	const subscription = _subscriptions[_id]
	const name = subscription.name
	delete subscription[_id]
	
	// TODO: check no more subscriptions to this room and leave
	await _useSocket().then(_io => _io.emit('leaveroom', name))
}

// add new subscription & listen
// return callback to unsubscribe
const _subscribe = async (event, callback) => await _useSocket()
	.then(_io => {
		const _id = uuid()

		_subscriptions[_id] = {
			event: event, 
			callback: callback
		}

		_io.on(event, data => {
			_.filter(Object.values(_subscriptions), { 'event': event })
				.map(subscription => subscription.callback(data))
		})

		// join room
		_io.emit('joinroom', event)

	 	return () => _unsubscribe(_id)
	})


export default {
	subscribe: _subscribe,
	unsubscribe: _unsubscribe,
	configure: _configure
}
import { socket } from '@util/socketio'
import uuid from 'uuid/v4'
import _ from 'lodash'

const subscriptions = []

// remove subscription by id 
const _unsubscribe = async id => {
	let io = await socket
	let subscription = subscriptions[id]
	io.emit('leaveroom', subscription.name)
	delete subscription[id]
}

// add new subscription & listen
// return callback to unsubscribe
export default async (event, callback) => {
	let io = await socket
	let id = uuid()

	subscriptions[id] = {
		event: event, 
		callback: callback
	}

	io.on(event, data => {
		_.filter(Object.values(subscriptions), { 'event': event })
			.map(subscription => subscription.callback(data))
	})

	// join room
	io.emit('joinroom', event)

 	return () => _unsubscribe(id)
}
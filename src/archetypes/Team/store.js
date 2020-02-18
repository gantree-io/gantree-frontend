import { query, mutation } from '@util/graphql'
import { socket } from '@util/socketio'
import uuid from 'uuid/v4'


const fetchAll = () => {
  	const _q = `
 		query team {
 			team {
 				_id
 				name
 				owner{
 					_id
 				}
				users{
					_id
					name
					email
					status
				}
 			}
 		}
 	`;

	return new Promise(async (resolve, reject) => {
		let res = await query(_q)
		resolve(res)
	});
}


// handle 
const subscriptionCallbacks = {}
const _subscribe = async (room, event, callback) => {
	
	let io = await socket
	let id = uuid()
	let name = `${room}.${event}`

	// add room
	if(!subscriptionCallbacks[name]) subscriptionCallbacks[name] = {}

	// add callback to room
	subscriptionCallbacks[name][id] = callback
	
	// trigger callback on event
	io.on(name, data => Object.values(subscriptionCallbacks[name]).forEach(cb => cb(data)))

	// join room
	io.emit('joinroom', name)

 	return id
}

// iterate through subscriptions and remove those with key = _id
const _unsubscribe = async _id => {
	let io = await socket
	Object.keys(subscriptionCallbacks).forEach(room => {
		Object.keys(subscriptionCallbacks[room]).forEach(id => {
			 if(id === _id){
			 	io.emit('leaveroom', room)
			 	delete subscriptionCallbacks[room][id]
			 }
		})
	})
}

export default {
	fetchAll: fetchAll,
	subscribe: _subscribe,
	unsubscribe: _unsubscribe
}
import { query, mutation } from '@util/graphql'
import { socket } from '@util/socketio'
import uuid from 'uuid/v4'


const _fetchAll = id => {
  	const _q = `
 		query networks {
 			networks {
				_id
				name
				config
				nodes{
					status
				}
 			}
 		}
 	`;

	return new Promise(async (resolve, reject) => {
		let res = await query(_q, {variables: {id: id}})
		resolve(res)
	});
}

const _fetchOne = _id => {
  	const _q = `
  		query network($_id: String!) {
  			network(_id: $_id) {
  				_id
  				name
  				config{
  					name
  				}
  				nodes{
  					_id
  					name
  					ip
  					provider
  					status
  					type
  				}
  			}
  		}
  	`;

	return new Promise(async (resolve, reject) => {
		let res = await query(_q, {variables: {_id: _id}})
		resolve(res)
	});
}


const _delete = id => {
	
  	const _q = `
 		mutation deleteConfig($id: String!) {
 			deleteConfig(id: $id) {
				_id
 			}
 		}
 	`;

	return new Promise(async (resolve, reject) => {
		let res = await mutation(_q, {variables: {id: id}})
		resolve(true)
	});
}

const _create = variables => {
	  	const __ = `
	 		mutation addNetwork($name: String!, $count: Int!, $validators: Boolean!, $provider: String!, $repo: String!, $config: String! ) {
	 			addNetwork(name: $name, count: $count, validators: $validators, provider: $provider, repo: $repo, config: $config) {
					_id
					name
	 			}
	 		}
	 	`;

		return new Promise(async (resolve, reject) => {
			let res = await mutation(__, {variables: variables})
			resolve(true)
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
	fetchOne: _fetchOne,
	fetchAll: _fetchAll,
	delete: _delete,
	create: _create,
	subscribe: _subscribe,
	unsubscribe: _unsubscribe
}
import { FeedMessage } from '@dotstats'
import _ from 'lodash'
const { Actions } = FeedMessage
const utf8decoder = new TextDecoder('utf-8');

const BASE_URL = _env.SOCKETIO_URL || 'wss://api.gantree.io/telem'

const ab2str = buf => String.fromCharCode.apply(null, new Uint8Array(buf));

const BaseTypes = {
	NodeDetails: {name: 'NodeDetails', fields: ['NodeName', 'NodeImplementation', 'NodeVersion', 'Address', 'NetworkId']},
	NodeStats: {name: 'NodeStats', fields: ['PeerCount', 'TransactionCount']},
	NodeIO: {name: 'NodeIO', fields: ['Bytes', 'Bytes', 'BytesPerSecond', 'BytesPerSecond']},
	NodeHardware: {name: 'NodeHardware', fields: ['MemoryUse', 'CPUUse', 'BytesPerSecond', 'BytesPerSecond', 'Timestamp']},
	BlockDetails: {name: 'BlockDetails', fields: ['BlockNumber', 'BlockHash', 'Milliseconds', 'Timestamp', 'PropagationTime']},
	NodeLocation: {name: 'NodeLocation', fields: ['Latitude', 'Longitude', 'City']},
}

const Types = {
	FeedVersion: {name: 'FeedVersion', fields: 'FeedVersion'},
	BestBlock: {name: 'BestBlock', fields: ['BlockNumber', 'Timestamp', 'Milliseconds']},
	BestFinalized: {name: 'BestFinalized', fields: ['BlockNumber', 'BlockHash']},
	AddedNode: {name: 'AddedNode', fields: ['NodeId', BaseTypes.NodeDetails, BaseTypes.NodeStats, BaseTypes.NodeIO, BaseTypes.NodeHardware, BaseTypes.BlockDetails, BaseTypes.NodeLocation, 'Timestamp']},
	RemovedNode: {name: 'RemovedNode', fields: 'NodeId'},
	LocatedNode: {name: 'LocatedNode', fields: ['NodeId', 'Latitude', 'Longitude', 'City']},
	ImportedBlock: {name: 'ImportedBlock', fields: ['NodeId', BaseTypes.BlockDetails]},
	FinalizedBlock: {name: 'FinalizedBlock', fields: ['NodeId', 'BlockNumber', 'BlockHash']},
	NodeStats: {name: 'NodeStats', fields: ['NodeId', BaseTypes.NodeStats]},
	NodeHardware: {name: 'NodeHardware', fields: [null, BaseTypes.NodeHardware]},
	NodeIO: {name: 'NodeIO', fields: ['NodeId', BaseTypes.NodeIO]},
	TimeSync: {name: 'TimeSync', fields: 'Timestamp'},
	AddedChain: {name: 'AddedChain', fields: ['ChainLabel', 'NodeCount']},
	RemovedChain: {name: 'RemovedChain', fields: 'ChainLabel'},
	SubscribedTo: {name: 'SubscribedTo', fields: 'ChainLabel'},
	UnsubscribedFrom: {name: 'UnsubscribedFrom', fields: 'ChainLabel'},
	Pong: {name: 'Pong', fields: 'Ping'},
	AfgFinalized: {name: 'AfgFinalized', fields: 'AuthoritySetInfo'},
	AfgReceivedPrevote: {name: 'AfgReceivedPrevote', fields: ['Address', 'BlockNumber', 'BlockHash']},
	AfgReceivedPrecommit: {name: 'AfgReceivedPrecommit', fields: ['Address', 'BlockNumber', 'BlockHash']},
	AfgAuthoritySet: {name: 'AfgAuthoritySet', fields: 'AuthoritySetInfo'},
	StaleNode: {name: 'StaleNode', fields: 'NodeId'},
}

export default class Telemetry{

	constructor(_ip){
		if(!_ip) throw new Error('IP not supplied')
		this.ip = _ip
		this.ws = new WebSocket(`${BASE_URL}/${this.ip}`)
		this.listeners = {}

		this.ws.onopen = (e, d) => {
			this.ws.send(`ping:1`)
		}

		this.ws.onmessage = msg => {
			const reader = new FileReader();
			reader.addEventListener('loadend', () => {
				// reader.result contains the contents of blob as a typed array
				const str = String.fromCharCode.apply(null, new Uint8Array(reader.result));
				const msgs = FeedMessage.deserialize(str)

				for (let msg of msgs) {
					let eventName = _.findKey(Actions, a => a === msg.action)
					this.fireEvent(eventName, msg.payload)
				}

			});
			reader.readAsArrayBuffer(msg.data);
		}

		return this
	}

	listen(name, cb){
		if(!this.listeners[name]) this.listeners[name] = []
		this.listeners[name].push(cb)
	}

	subscribe(name) {
		this.ws.send(`subscribe:${name}`);
	}

	close(){
		this.ws.close()
	}

	fireEvent(name, payload){
		let type = Types[name]
		let formattedPayload = this.formatPayload(type, payload)

		_.get(this, `listeners.${name}`, []).forEach(cb => {
			cb(formattedPayload)
		})
	}

	formatPayload(type, payload){
		let data = {}

		// multiple values
		if(typeof type.fields === 'object'){
			type.fields.forEach((field, i) => {
				if(field){
					if(typeof field === 'object'){
						// recur[recur[recursion]sion]sion
						data[field.name] = this.formatPayload(field, payload[i])
					}else{
						data[field] = payload[i]
					}
				}
			})
		}
		// single value
		else{
			data[type.name] = payload
		}

		return data
	}


}
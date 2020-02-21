import io from 'socket.io-client';

let _socket
let _url = _env.SOCKETIO_URL || "http://localhost:3000"

export const socketa = _socket

const connect = () => {
	return io(_url, {
		reconnection: true,
		reconnectionDelay: 1000,
		reconnectionDelayMax : 1000,
		reconnectionAttempts: 5
	}).on('error', () => console.log('todo: error'))
}

export const socket = new Promise((resolve, reject) => {
	if(!_socket){
		_socket = connect()
		_socket
			.on('connect', () => resolve(_socket))
			.on('reconnect', () => resolve(_socket))
			.on('disconnect', () => connect())
	}else{
		resolve(_socket)
	}
})

export const configure = ({url}) => {
	_url = url
}
import { writable } from 'svelte/store';
import { query, mutation } from '@util/graphql'

// the status of the app connection to the backend
export const NetworkStatus = {
	INITIALISED: 'INITIALISED',
	ONLINE: 'ONLINE',
	OFFLINE: 'OFFLINE',
}


export default (() => {
	const defaultProps = {
		networkStatus: NetworkStatus.INITIALISED,
	}
	
	const { set, update, subscribe } = writable(defaultProps);
	
	return {
		subscribe,
		setNetworkStatus: status => {
			update(props => ({
				...props,
				NetworkStatus: Object.keys(NetworkStatus).includes(status) ? status : NetworkStatus.OFFLINE
			}))
		},
		query: query,
		mutation: mutation,
	}
})()
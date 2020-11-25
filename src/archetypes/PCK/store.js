import { query, mutation } from "@util/graphql"

export const pckCollections = `
	query pckCollections {
		pckCollections {
			_id
			name
			pcks{
				_id
				name
				pckrc
			}
		}
	}
`

export const fetchOneById = `
	query pck($_id: String!) {
		pck(_id: $_id) {
			name
			pckrc
		}
	}
`

export const createPck = `
	mutation createPck($name: String!, $pckCollectionId: String!) {
		createPck(name: $name, pckCollectionId: $pckCollectionId)
	}
`

export const deregisterPck = `
	mutation deregisterPck($_id: String!) {
		deregisterPck(_id: $_id)
	}
`

export const createPckCollection = `
	mutation createPckCollection($name: String!, $cortexGatewayUrl: String!) {
		createPckCollection(name: $name, cortexGatewayUrl: $cortexGatewayUrl)
	}
`

export default {
  query,
  mutation,
}

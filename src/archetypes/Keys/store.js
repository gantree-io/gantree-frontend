import { query, mutation } from '@util/graphql'

// queries
export const fetchAll = `
	query keys {
		keys {
			_id
			provider
		}
	}`

// mutations
export const addKey = `
	mutation addKey($key: String!, $provider: String!) {
		addKey(key: $key, provider: $provider) {
			_id
		}
	}
`;

export const deleteKey = `
	mutation deleteKey($_id: String!) {
		deleteKey(_id: $_id)
	}
`;

export default {
	query,
	mutation
}
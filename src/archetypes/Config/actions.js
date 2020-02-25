import { query, mutation } from '@util/graphql' 

export const deleteConfig = `
	mutation deleteConfig($_id: String!) {
		deleteConfig(_id: $_id)
	}
`

export const fetchOne = `
	query config($_id: String!) {
		config(_id: $_id) {
			_id
			name
			chainspec
		}
	}
`

export default {
	query: query,
	mutation: mutation
}
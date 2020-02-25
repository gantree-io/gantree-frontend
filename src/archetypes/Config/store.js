import { query, mutation } from '@util/graphql' 

export const fetchAll = `
	query configs {
		configs {
			_id
			name
		}
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

export const deleteOne = `
	mutation deleteConfig($_id: String!) {
		deleteConfig(_id: $_id){
			_id
		}
	}
`

export default {
	query: query,
	mutation: mutation
}
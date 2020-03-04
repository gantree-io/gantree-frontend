import { query, mutation } from '@util/graphql' 

export const addChainspec = `
 	mutation addChainspec($name: String!, $chainspec: JSON!) {
	 	addChainspec(name: $name, chainspec: $chainspec){
	 		_id
	 	}
 	}
 `;

export const deleteChainspec = `
	mutation deleteChainspec($_id: String!) {
		deleteChainspec(_id: $_id)
	}
`

export const fetchOne = `
	query chainspec($_id: String!) {
		chainspec(_id: $_id) {
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
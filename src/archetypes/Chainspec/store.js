import { query, mutation } from '@util/graphql' 

export const fetchAll = `
	query chainspecs {
		chainspecs {
			_id
			name
		}
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

export const addChainspec = `
	mutation addChainspec($name: String!, $chainspec: String!) {
		addChainspec(name: $name, chainspec: $chainspec){
			_id
		}
	}
`

export const deleteOne = `
	mutation deleteChainspec($_id: String!) {
		deleteChainspec(_id: $_id){
			_id
		}
	}
`

export default {
	query,
	mutation
}
import { query, mutation } from '@util/graphql' 

export const fetchAll = `
	query chainspecs($withCount: Boolean) {
		chainspecs(withCount: $withCount) {
			_id
			name
			networkCount
		}
	}
`

export const fetchOne = `
	query chainspec($_id: String! $full: Boolean) {
		chainspec(_id: $_id full: $full) {
			_id
			name
			file
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
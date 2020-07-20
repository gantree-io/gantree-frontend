import { query, mutation } from '@util/graphql'

export const fetchAll = `
	query networks {
		networks {
			_id
			project_id
			nodes{
				status
			}
		}
	}
`

export const fetchOneTeaser = `
	query network($_id: String!) {
		network(_id: $_id) {
			_id
			project_id
			status
			nodes{
				_id
				status
			}
		}
	}
`

export const fetchOne = `
	query network($_id: String!) {
		network(_id: $_id) {
			_id
			project_id
			dashboard_url
			status
			nodes{
				_id
				name
				status
				instance{
					ip
				}
			}
		}
	}
`

export const deleteOne = `
	mutation deleteNetwork($_id: String!) {
		deleteNetwork(_id: $_id)
	}
`

export const addNetwork = `
	mutation addNetwork($name: String!, $count: Int!, $validators: Boolean!, $provider: String!, $binary_url: String!, $binary_name: String!, $binary_opts: [String], $chainspec: String! ) {
		addNetwork(name: $name, count: $count, validators: $validators, provider: $provider, binary_url: $binary_url, binary_name: $binary_name, binary_opts: $binary_opts, chainspec: $chainspec) {
			_id
			name
		}
	}
`

export const createDashboard = `
	mutation createDashboard($_id: String!) {
		createDashboard(_id: $_id)
	}
`

export default {
  query,
  mutation
}

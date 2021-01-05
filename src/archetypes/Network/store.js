import { query, mutation } from "@util/graphql"

export const fetchAll = `
	query networks {
		networks {
			_id
			projectId
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
			projectId
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
			projectId
			dashboardUrl
			dashboardStatus
			status
			nodes{
				_id
				name
				clientId
				status
				instance{
					ip
				}
			}
		}
	}
`

export const deleteOne = `
	mutation cleanNetwork($_id: String!) {
		cleanNetwork(_id: $_id)
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
	mutation createNetworkTelemetryDashboard($_id: String!) {
		createNetworkTelemetryDashboard(_id: $_id)
	}
`

export default {
  query,
  mutation,
}

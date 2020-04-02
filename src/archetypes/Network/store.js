import { query, mutation } from '@util/graphql'

export const fetchAll = `
	query networks {
		networks {
			_id
			name
			chainspec
			nodes{
				status
			}
		}
	}
`;

export const fetchOneTeaser = `
	query network($_id: String!) {
		network(_id: $_id) {
			_id
			name
			status
			chainspec
			nodes{
				_id
				status
			}
		}
	}
`;

export const fetchOne = `
	query network($_id: String!) {
		network(_id: $_id) {
			_id
			name
			chainspec
			status
			nodes{
				_id
				name
				ip
				provider
				status
				validator
			}
		}
	}
`;

export const deleteOne = `
	mutation deleteNetwork($_id: String!) {
		deleteNetwork(_id: $_id)
	}
`;

export const addNetwork = `
	mutation addNetwork($name: String!, $count: Int!, $validators: Boolean!, $provider: String!, $binary_url: String!, $binary_name: String!, $binary_opts: [String], $chainspec: String! ) {
		addNetwork(name: $name, count: $count, validators: $validators, provider: $provider, binary_url: $binary_url, binary_name: $binary_name, binary_opts: $binary_opts, chainspec: $chainspec) {
			_id
			name
		}
	}
`

export default {
	query,
	mutation
}
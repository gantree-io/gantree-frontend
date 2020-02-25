import { query, mutation } from '@util/graphql'

export const fetchAll = `
	query networks {
		networks {
			_id
			name
			config{
				name
			}
			nodes{
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
			config{
				name
			}
			nodes{
				_id
				name
				ip
				provider
				status
				type
			}
		}
	}
`;

export const deleteNetwork = `
	mutation deleteNetwork($_id: String!) {
		deleteNetwork(_id: $_id)
	}
`;

export const addNetwork = `
	mutation addNetwork($name: String!, $count: Int!, $validators: Boolean!, $provider: String!, $repo: String!, $config: String! ) {
		addNetwork(name: $name, count: $count, validators: $validators, provider: $provider, repo: $repo, config: $config) {
			_id
			name
		}
	}
`

export default {
	query,
	mutation
}
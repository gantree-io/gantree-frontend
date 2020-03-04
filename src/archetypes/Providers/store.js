import { query, mutation } from '@util/graphql'

// queries
export const fetchAll = `
	query providers {
		providers {
			_id
			provider
			name
		}
	}`

// mutations
export const addDO = `
	mutation addProviderDO($digitalocean_token: String!) {
		addProviderDO(digitalocean_token: $digitalocean_token){
			_id
		}
	}
`;

export const addAWS = `
	mutation addProviderAWS($aws_access_key_id: String!, $aws_secret_access_key: String!) {
		addProviderAWS(aws_access_key_id: $aws_access_key_id, aws_secret_access_key: $aws_secret_access_key){
			_id
		}
	}
`;

export const addGCP = `
	mutation addProviderGCP($google_application_credentials: String!) {
		addProviderGCP(google_application_credentials: $google_application_credentials) {
			_id
		}
	}
`;

export const deleteProvider = `
	mutation deleteProvider($_id: String!) {
		deleteProvider(_id: $_id)
	}
`;

export default {
	query,
	mutation
}
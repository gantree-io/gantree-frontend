import { query, mutation } from '@util/graphql'

// featc all providers
export const fetchAll = `
	query providers($withCount: Boolean) {
		providers(withCount: $withCount) {
			_id
			provider
			name
			networkCount
			nodeCount
		}
	}`

// count of all providers enabled
export const count = `
	query providerCount {
		providerCount
	}
`

// mutations
export const addDO = `
	mutation addProviderDO($do_api_token: String!) {
		addProviderDO(do_api_token: $do_api_token){
			_id
		}
	}
`

export const addAWS = `
	mutation addProviderAWS($aws_access_key_id: String!, $aws_secret_access_key: String!) {
		addProviderAWS(aws_access_key_id: $aws_access_key_id, aws_secret_access_key: $aws_secret_access_key){
			_id
		}
	}
`

export const addGCP = `
	mutation addProviderGCP($google_application_credentials: String!) {
		addProviderGCP(google_application_credentials: $google_application_credentials) {
			_id
		}
	}
`

export const deleteProvider = `
	mutation deleteProvider($_id: String!) {
		deleteProvider(_id: $_id)
	}
`

export default {
	query,
	mutation
}
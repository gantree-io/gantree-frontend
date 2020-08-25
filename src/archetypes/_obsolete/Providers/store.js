import { query, mutation } from "@util/graphql";

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
	}`;

// count of all providers enabled
// export const count = `
// 	query providerCount {
// 		providerCount
// 	}
// `;

// mutations
export const addDO = `
	mutation addProviderDO($doApiToken: String!) {
		addProviderDO(doApiToken: $doApiToken){
			_id
		}
	}
`;

export const addAWS = `
	mutation addProviderAWS($awsAccessKeyId: String!, $awsSecretAccessKey: String!) {
		addProviderAWS(awsAccessKeyId: $awsAccessKeyId, awsSecretAccessKey: $awsSecretAccessKey){
			_id
		}
	}
`;

export const addGCP = `
	mutation addProviderGCP($googleApplicationCredentials: String!) {
		addProviderGCP(googleApplicationCredentials: $googleApplicationCredentials) {
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
  mutation,
};

//https://www.apollographql.com/docs/react/v3.0-beta/api/core/ApolloClient/
import ApolloClient, { gql as ApolloGQL } from 'apollo-boost';

let client = null

const getClient = () => {
	console.log(client)
}

export const gql = ApolloGQL

export const configure = ({uri}) => {
	client = new ApolloClient({
		uri: uri || "http://localhost:4000/graphql",
		onError: ({ networkError, graphQLErrors }) => {
			console.log("graphQLErrors", graphQLErrors);
			console.log("networkError", networkError);
		}
	})

	client.defaultOptions = {
		watchQuery: {
			fetchPolicy: 'no-cache',
			errorPolicy: 'all',
		},
		query: {
			fetchPolicy: 'no-cache'
		}
	};
}

export const query = (q, options={}) => {
	return async () => {
		let result = await client.query({ query: q, ...options})
		let data = Object.values(result.data)[0]
		
		return Object.values(data)[0].map(o => {
			delete o.__typename;
			return o
		})
	}
};

export default {
	configure: configure,
	query: query
}
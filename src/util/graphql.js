//https://www.apollographql.com/docs/react/v3.0-beta/api/core/ApolloClient/
// TODO: pending request mddleware.
import ApolloClient from "apollo-client";
import { gql as ApolloGQL } from 'apollo-boost';
import { createHttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { InMemoryCache } from "apollo-cache-inmemory";

let client = null

export const gql = ApolloGQL

export const configure = ({uri}) => {

	const httpLink = createHttpLink({ uri: uri || "/graphql"});
	const errorLink = onError(({ networkError, graphQLErrors }) => {
		console.log("graphQLErrors", graphQLErrors);
		console.log("networkError", networkError);
	});

	client = new ApolloClient({
		link: errorLink.concat(httpLink),
		cache: new InMemoryCache({addTypename: false}),
		defaultOptions: {
			watchQuery: {
				fetchPolicy: 'no-cache',
				errorPolicy: 'all',
			},
			query: {
				fetchPolicy: 'no-cache'
			}
		}
	});
}

export const awaitQuery = (q, options={}) => {
	return async () => {
		let result = await client.query({ query: ApolloGQL`${q}`, ...options})
		return Object.values(result.data)[0]
	}
};

export const query = async (q, variables={}, options={}) => new Promise(async (resolve, reject) => {
	try {
		let result = await client.query({ 
			query: ApolloGQL`${q}`, 
			variables: variables, 
			...options
		})
		resolve(Object.values(result.data)[0])
	} catch(e) {
		// statements
		reject(e);
	}
	
});

export const mutation = async (q, options={}) => {
	let result = await client.mutate({ mutation: ApolloGQL`${q}`, ...options})
	return Object.values(result.data)[0]
};

export const queryOld = (q, options={}) => client.query({query: ApolloGQL`${q}`, ...options})

export default {
	configure: configure,
	query: query,
	queryOld: queryOld
}
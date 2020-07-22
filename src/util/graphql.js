//https://www.apollographql.com/docs/react/v3.0-beta/api/core/ApolloClient/
import ApolloClient from 'apollo-client'
import { gql as ApolloGQL } from 'apollo-boost'
import { createHttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'
import { replace, location } from 'svelte-spa-router'

let client = null
let onGraphQLError = () => {}
let onNetworkError = () => {}

const handleGraphQLError = (err) => {
  let error = {
    message: err.message,
    code: err.extensions.code
  }
  onGraphQLError(error)
}

export const gql = ApolloGQL

export const configure = ({ uri, token, ...props }) => {
  onGraphQLError = props.onGraphQLError
  onNetworkError = props.onNetworkError

  const httpLink = createHttpLink({ uri: uri || '/graphql' })

  const errorLink = onError(({ networkError, graphQLErrors }) => {
    if (graphQLErrors) {
      handleGraphQLError(graphQLErrors[0])
    } else if (networkError) {
      onNetworkError(networkError)
    }
  })

  const authLink = setContext((_x, { headers }) => {
    let _token = token()

    return {
      headers: {
        ...headers,
        authorization: _token ? `Bearer ${_token}` : ''
      }
    }
  })

  client = new ApolloClient({
    credentials: 'include',
    link: authLink.concat(errorLink.concat(httpLink)),
    cache: new InMemoryCache({ addTypename: false }),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all'
      },
      query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all'
      },
      mutate: {
        errorPolicy: 'all'
      }
    }
  })
}

export const query = async (q, variables = {}, options = {}) =>
  new Promise(async (resolve, reject) => {
    try {
      let result = await client.query({
        query: ApolloGQL`${q}`,
        variables: variables,
        ...options
      })

      if (result.errors) {
        handleGraphQLError(result.errors[0])
        reject(result.errors[0].message)
      }

      resolve(Object.values(result.data)[0])
    } catch (e) {
      reject(e.message)
    }
  })

export const mutation = async (q, variables = {}, options = {}) =>
  new Promise(async (resolve, reject) => {
    try {
      let result = await client.mutate({
        mutation: ApolloGQL`${q}`,
        variables: variables,
        ...options
      })

      if (result.errors) {
        handleGraphQLError(result.errors[0])
        reject(result.errors[0].message)
      }

      resolve(Object.values(result.data)[0])
    } catch (e) {
      reject(e.message)
    }
  })

export const checkConnection = () =>
  new Promise(async (resolve, reject) => {
    try {
      await client
        .query({ query: ApolloGQL`query ping { ping }` })
        .catch((e) => reject())

      resolve()
    } catch (e) {
      reject()
    }
  })

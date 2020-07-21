import { query, mutation } from '@util/graphql'

export const deleteOne = `
	mutation deleteNode($_id: String!) {
		deleteNode(_id: $_id)
	}
`

export const Status = {
  DEPLOYING: {
    icon: 'settings',
    color: 'notification'
  },
  CONFIGURING: {
    icon: 'settings',
    color: 'warning'
  },
  ONLINE: {
    icon: 'offline_bolt',
    color: 'success'
  },
  SHUTDOWN: {
    icon: 'settings',
    color: 'neutral'
  },
  ERROR: {
    icon: 'error',
    color: 'error'
  }
}

export default {
  query,
  mutation
}

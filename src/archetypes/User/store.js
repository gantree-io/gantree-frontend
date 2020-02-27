import { query, mutation } from '@util/graphql'

// queries
export const fetchAll = `
	query users {
		users {
			_id
		}
	}`

export const fetchOne = `
	query user {
		user {
			_id
			name
			email
			status
		}
	}`


// mutations
export const inviteUser = `
	mutation inviteUser($email: String!) {
		inviteUser(email: $email) {
			_id
			email
		}
	}
`;

export const deleteUser = `
	mutation deleteUser($_id: String!) {
		deleteUser(_id: $_id)
	}
`;

export const activate = `
	mutation activateUser($_id: String!) {
		activateUser(_id: $_id)
	}
`;

export const deactivate = `
	mutation deactivateUser($_id: String!) {
		deactivateUser(_id: $_id)
	}
`;

export const resendInvitation = `
	mutation resendInvitation($_id: String!) {
		resendInvitation(_id: $_id) 
	}
`;

export default {
	query,
	mutation
}
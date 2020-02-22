import { query, mutation } from '@util/graphql'

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
const addUser = ({email}) => {
  	const _o_ = `
 		mutation addUser($email: String!) {
 			addUser(email: $email) {
 				_id
 			}
 		}
 	`;

	return new Promise(async (resolve, reject) => {
		let res = await mutation(_o_, {variables: {email: email}})
		resolve(res)
	});
}

const deleteUser = _id => {
  	const _o_ = `
 		mutation deleteUser($_id: String!) {
 			deleteUser(_id: $_id)
 		}
 	`;

	return new Promise(async (resolve, reject) => {
		let res = await mutation(_o_, {variables: {_id: _id}})
		resolve(res)
	});
}

const activate = _id => {
  	const _o_ = `
 		mutation activateUser($_id: String!) {
 			activateUser(_id: $_id)
 		}
 	`;

	return new Promise(async (resolve, reject) => {
		let res = await mutation(_o_, {variables: {_id: _id}})
		resolve(res)
	});
}

const deactivate = _id => {
  	const _o_ = `
 		mutation deactivateUser($_id: String!) {
 			deactivateUser(_id: $_id)
 		}
 	`;

	return new Promise(async (resolve, reject) => {
		let res = await mutation(_o_, {variables: {_id: _id}})
		resolve(res)
	});
}

const resendInvitation = _id => {
  	const _o_ = `
 		mutation resendInvitation($_id: String!) {
 			resendInvitation(_id: $_id) 
 		}
 	`;

	return new Promise(async (resolve, reject) => {
		let res = await mutation(_o_, {variables: {_id: _id}})
		resolve(res)
	});
}

export default {
	fetchAll: vars => query(fetchAll, vars),
	fetchOne: vars => query(fetchOne, vars),
	add: addUser,
	delete: deleteUser,
	activate: activate,
	deactivate: deactivate,
	resendInvitation: resendInvitation
}
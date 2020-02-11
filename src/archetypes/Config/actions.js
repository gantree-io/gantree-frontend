import { mutation } from '@util/graphql' 

const _delete = id => {
	
  	const _q = `
 		mutation deleteConfig($id: String!) {
 			deleteConfig(id: $id) {
				_id
 			}
 		}
 	`;

	return new Promise(async (resolve, reject) => {
		let res = await mutation(_q, {variables: {id: id}})
		resolve(true)
	});
}

const _fetchOne = id => {
	
  	const _q = `
 		query config($_id: String!) {
 			config(_id: $_id) {
				_id
				name
				chainspec
 			}
 		}
 	`;

	return new Promise(async (resolve, reject) => {
		let res = await mutation(_q, {variables: {id: id}})
		resolve(true)
	});
}

export default {
	delete: _delete,
	fetchOne: _fetchOne
}
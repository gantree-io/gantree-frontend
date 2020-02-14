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

const _fetchAll = id => {
	
  	const _q = `
 		query configs {
 			configs {
				_id
				name
				chainspec
 			}
 		}
 	`;

	return new Promise(async (resolve, reject) => {
		let res = await mutation(_q, {variables: {id: id}})
		resolve(res)
	});
}

const _fetchOne = id => {
	
  	const _q = `
 		query config($id: String!) {
 			config(id: $id) {
				_id
				name
				chainspec
 			}
 		}
 	`;

	return new Promise(async (resolve, reject) => {
		let res = await mutation(_q, {variables: {id: id}})
		resolve(res)
	});
}

export default {
	delete: _delete,
	fetchOne: _fetchOne,
	fetchAll: _fetchAll
}
import { query, mutation } from '@util/graphql' 

const _fetchAll = id => {
  	const _q = `
 		query networks {
 			networks {
				_id
				name
				config
				nodes{
					status
				}
 			}
 		}
 	`;

	return new Promise(async (resolve, reject) => {
		let res = await query(_q, {variables: {id: id}})
		resolve(res)
	});
}

const _fetchOne = _id => {
  	const _q = `
  		query network($_id: String!) {
  			network(_id: $_id) {
  				_id
  				name
  				config{
  					name
  				}
  				nodes{
  					_id
  					name
  					ip
  					provider
  					status
  					type
  				}
  			}
  		}
  	`;

	return new Promise(async (resolve, reject) => {
		let res = await query(_q, {variables: {_id: _id}})
		resolve(res)
	});
}


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

const _create = variables => {
	  	const __ = `
	 		mutation addNetwork($name: String!, $count: Int!, $validators: Boolean!, $provider: String!, $repo: String!, $config: String! ) {
	 			addNetwork(name: $name, count: $count, validators: $validators, provider: $provider, repo: $repo, config: $config) {
					_id
					name
	 			}
	 		}
	 	`;

		return new Promise(async (resolve, reject) => {
			let res = await mutation(__, {variables: variables})
			resolve(true)
		});
}

export default {
	fetchOne: _fetchOne,
	fetchAll: _fetchAll,
	delete: _delete,
	create: _create
}
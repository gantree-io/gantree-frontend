import { query, mutation } from '@util/graphql'


const fetchAll = () => {
  	const _q = `
 		query team {
 			team {
 				_id
 				name
 				owner{
 					_id
 				}
				users{
					_id
					name
					email
					status
				}
 			}
 		}
 	`;

	return new Promise(async (resolve, reject) => {
		let res = await query(_q)
		resolve(res)
	});
}


export default {
	fetchAll: fetchAll,
}
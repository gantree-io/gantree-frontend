import { query, mutation } from '@util/graphql'

export const fetchAll = `
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

export const updateOwner = `
	mutation updateOwner($_id: String!){
		updateOwner(_id: $_id){
			_id
		}
	}
`

export const updateName = `
	mutation updateName($name: String!){
		updateName(name: $name)
	}
`

export default {
	query,
	mutation
}
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

export default {
	query,
	mutation
}
export const nodeFilterOptions = {
	filterkey: 'validator',
	
	options: [
		{
			key: 'VALIDATOR', 
			value: 'Vaildators',
			showCount: true,
			icon: 'find_in_page'

		}, 
		{
			key: 'FULL', 
			value: 'Full Nodes',
			showCount: true,
			icon: 'dns'
		}
	],
	filtercallback: (item, filters) => {
		console.log(filters)
		return item.type
	}
}
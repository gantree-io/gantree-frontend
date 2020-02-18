<script>
	import { form } from 'svelte-forms';
	import { mutation } from '@util/graphql'
	import PanelLayout from '@layouts/Panel.svelte'
	import Form, { Step, Field, validate } from '@components/Form'
	import ConfigStore from '@archetypes/Config/store'
	import { toast } from '@components/Toaster.svelte'
	import Network from './store.js'

	export let onSuccess = () => {}
	export let onCancel = () => {}

	let subtitle = 1

	// const mutationQuery = `
	// 	mutation addNetwork($name: String!, $chainspec: JSON!) {
	// 		addNetwork(name: $name, chainspec: $chainspec){
	// 			_id
	// 			name
	// 		}
	// 	}
	// `;
	
	// get config options
	let configOptions = {}
	ConfigStore.fetchAll().then(configs => {
		let options = {}
		configs.forEach(config => {
			options[config._id] = config.name
		})
		configOptions = options
	})


	const onSubmit = async ({fields, hasErrors, errors, setLoading}) => {
		console.log(fields)
		// if(!hasErrors){
		// 	setLoading(true)
		// 	Network.create(fields).then(data => {
		// 		toast.success(`New network added: ${data.name}. Check the status on the networks page.`)
		// 		onSuccess(data)
		// 		setLoading(false)
		// 		PubSub.publish('NETWORK.ADD');
		// 	})
		// }else{
		// 	toast.warning(`Some fields have errors`)
		// }
	}
</script>

<style lang="scss">
	:global(.mdc-typography--body1){
		margin-top: 0
	}
</style>

<PanelLayout 
	header={{
		title: 'Invite User'
	}}
	>
	
	<Form 
		onSubmit={onSubmit}
		onCancel={onCancel}
		buttons={{
			cancel: 'Cancel',
			submit: 'Invite'
		}}
		>

		<Field
			title='Name'
			required
			input={{
				id: 'name',
				type: 'text',
				placeholder: "joe blogs",
			}}
		/>

		<Field
			title='Email'
			required
			validation={{
				'Email must be valid': validate.email
			}}
			input={{
				id: 'email',
				type: 'email',
				placeholder: "joe blogs",
			}}
		/>
	</Form>
</PanelLayout>
<script>
	import { form } from 'svelte-forms';
	import { mutation } from '@util/graphql'
	import PanelLayout from '@layouts/Panel.svelte'
	import Form, { Step, Field, validate } from '@components/Form'
	import ConfigStore from '@archetypes/Config/store'
	import { toast } from '@components/Toaster.svelte'

	export let onSuccess = () => {}
	export let onCancel = () => {}

	let subtitle = 1

	const mutationQuery = `
		mutation addNetwork($name: String!, $chainspec: JSON!) {
			addNetwork(name: $name, chainspec: $chainspec){
				_id
				name
			}
		}
	`;
	
	// get config options
	let configOptions = {}
	ConfigStore.fetchAll().then(configs => {
		let options = {}
		configs.forEach(config => {
			options[config._id] = config.name
		})
		configOptions = options
	})


	const handleDeploy = async ({fields, hasErrors, errors, setLoading}) => {
		console.log(fields, hasErrors, errors)

		if(!hasErrors){

			setLoading(true)
			setTimeout(() => {
				onSuccess(true)
				setLoading(false)
			}, 1000)


			
			// let result = await mutation(
			// 	mutationQuery, 
			// 	{
			// 		variables: {
			// 			name: fields.name, 
			// 			chainspec: fields.chainspec 
			// 		}
			// 	}
			// )
			// 
			// onSuccess(result)
			// PubSub.publish('CONFIG.ADD');
		}else{
			toast.warning(`Some fields have errors`)
		}
	}
</script>

<style lang="scss">
	:global(.mdc-typography--body1){
		margin-top: 0
	}
</style>

<PanelLayout 
	header={{
		title: 'Deploy Network',
		subtitle: subtitle
	}}
	>
	
	<Form 
		onSubmit={handleDeploy}
		onCancel={onCancel}
		onStep={({title, index}) => {
			subtitle = `${index}. ${title}`
		}}
		>

		<Step 
			title='Nodes'
			buttons={{
				next: 'Next: Repo & Config'
			}}
			>
			<Field
				title='How many nodes?'
				subtitle='Select the number of nodes to deploy'
				help='More nodes equals longer deployment times'
				required
				validation={{
					'Count must be a number': validate.int,
					'Count must be 1 or more': value => validate.gte(value, 0),
					'Count must be 10 or less': value => validate.lt(value, 10)
				}}
				input={{
					id: 'count',
					type: 'number',
					placeholder: 'Enter a number',
					value: 1,
					max: 10,
					min: 1
				}}
			/>

			<Field
				title='Are these validator nodes?'
				input={{
					id: 'validators',
					type: 'switch',
					value: false,
					off: 'No',
					on: 'Yes'
				}}
			/>

			<Field
				title='Which Provider?'
				help='You can deploy more nodes using another provider once this network has been created'
				validation={{
					'Provider is required': validate.required
				}}
				input={{
					id: 'provider',
					type: 'select',
					options: {
						'DO': 'Digital Ocean',
						'AWS': 'Amazon Web Services (AWS)',
						'GCP': 'Google Cloud Computing (GCP)'
					}
				}}
			/>

		</Step>

		<Step 
			title='Repo & Config' 
			buttons={{
				back: 'Back',
				next: 'Next: Confirm & Deploy'
			}}
			>
			<Field
				title='Repo URL'
				subtitle='Paraplant will clone and compile this git repo. This repo should compile when cargo build --release is run in the root directory, and the binary should be output to ./target/release/substrate'
				validation={{
					'Repo URL is required': validate.required,
					'Must be a valid URL': validate.url
				}}
				input={{
					id: 'repo',
					type: 'url',
					placeholder: "https://github.com/myaccount/myrepo",
				}}
			/>

			<Field
				title='Which Chain Config?'
				subtitle='xxxxxx'
				validation={{
					'Chain Config is required': validate.required
				}}
				input={{
					id: 'config',
					type: 'select',
					options: configOptions,
					placeholder: 'Choose a chain config'
				}}
			/>
		</Step>

		<Step 
			title='Confirm' 
			buttons={{
				back: 'Back',
				submit: 'Deploy'
			}}
			>
			<p>ksndksn</p>
			<p>ksndksn</p>
			<p>ksndksn</p>
			<p>ksndksn</p>
		</Step>
	</Form>
</PanelLayout>
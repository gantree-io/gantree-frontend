<script>
	import { form } from 'svelte-forms';
	import { mutation } from '@util/graphql'
	import PanelLayout from '@layouts/Panel.svelte'
	import Form, { Step, Field, Button, validate } from '@components/Form'

	export let onSuccess = () => {}
	export let onCancel = () => {}

	let step = 1;
	let subtitle = 1;

   	const mutationQuery = `
 	 	mutation addConfig($name: String!, $chainspec: JSON!) {
		 	addConfig(name: $name, chainspec: $chainspec){
		 		_id
		 		name
		 		chainspec
		 	}
 	 	}
 	 `;


	const handleSubmit = async ({fields, hasErrors, errors, setLoading}) => {
		console.log(fields, hasErrors, errors)
		
		setLoading(true)
		setTimeout(() => {
			setLoading(false)
		}, 2000)
				
		if(!hasErrors){
			
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
		onSubmit={handleSubmit}
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
				validation={{
					'Count is required': validate.required
				}}
				input={{
					id: 'count',
					type: 'number',
					placeholder: 3,
					value: 3
				}}
			/>

			<Field
				title='Provider'
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
					},
					placeholder: 'Choose a provider'
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
				title='Repo URL',
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
				title='Whcih Chain Config?',
				subtitle='xxxxxx'
				validation={{
					'Chain Config is required': validate.required
				}}
				input={{
					id: 'config',
					type: 'select',
					options: {
						'DO': 'Digital Ocean',
						'AWS': 'Amazon Web Services (AWS)',
						'GCP': 'Google Cloud Computing (GCP)'
					},
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
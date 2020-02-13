<script>
	import { form } from 'svelte-forms';
	import { mutation } from '@util/graphql'
	import PanelLayout from '@layouts/Panel.svelte'
	import Form, { Step, Field, Button, validate } from '@components/Form'

	export let onSuccess = () => {}
	export let onCancel = () => {}

	let step = 1;

   	const mutationQuery = `
 	 	mutation addConfig($name: String!, $chainspec: JSON!) {
		 	addConfig(name: $name, chainspec: $chainspec){
		 		_id
		 		name
		 		chainspec
		 	}
 	 	}
 	 `;


	const handleSubmit = async ({fields, hasErrors}) => {
		if(!hasErrors){
			console.log(fields)
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
		subtitle: 'sasas'
	}}
	>
	
	<Form 
		onSubmit={handleSubmit}
		onCancel={onCancel}
		>

		<Step 
			title='aaa'
			buttons={{
				next: 'Add Nodes'
			}}
			>
			<Field
				title='aaa'
				validation={{
					'AAA is required': validate.required
				}}
				input={{
					id: 'aaa',
					type: 'text',
					placeholder: " // aaa",
				}}
			/>
		</Step>

		<Step 
			title='bbb' 
			buttons={{
				back: 'Back',
				next: 'Confirm'
			}}
			>
			<Field
				title='bbb'
				validation={{
					'BBB is required': validate.required
				}}
				input={{
					id: 'bbb',
					type: 'text',
					placeholder: " // bbb",
				}}
			/>
		</Step>

		<Step 
			title='ccc' 
			buttons={{
				back: 'Back',
				submit: 'Deploy'
			}}
			>
			<Field
				title='ccc'
				validation={{
					'CCC is required': validate.required
				}}
				input={{
					id: 'ccc',
					type: 'text',
					placeholder: " // ccc",
				}}
			/>
		</Step>
	</Form>
</PanelLayout>
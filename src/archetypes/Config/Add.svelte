<script>
	import { form } from 'svelte-forms';
	import { mutation } from '@util/graphql'
	import PanelLayout from '@layouts/Panel.svelte'
	import Form, { Field, Submit, validate } from '@components/Form'

	export let onSuccess = () => {}
	export let onCancel = () => {}

   	const mutationQuery = `
 	 	mutation addConfig($name: String!, $chainspec: String!) {
		 	addConfig(name: $name, chainspec: $chainspec){
		 		_id
		 		name
		 		chainspec
		 	}
 	 	}
 	 `;


	const handleSubmit = async ({fields, hasErrors}) => {
		if(!hasErrors){
			let result = await mutation(
				mutationQuery, 
				{
					variables: {
						name: fields.name, 
						chainspec: JSON.stringify(fields.chainspec) 
					}
				}
			)
			
			onSuccess(result)
			PubSub.publish('CONFIG.ADD');
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
		title: 'Add Genesis Config',
	}}
	>
	<p class="mdc-typography--body1">Paraplant requires a genesis block file in order to create nodes on a particular network. This file should be .json fomat. You can <a href='#' target="_blank" nofollow noreferrer>find out how to generate one of these files here</a>. </p>
	<Form 
		onSubmit={handleSubmit}
		onCancel={onCancel}
		submitButtonText='Upload'
		cancelButtonText='cancel'
		>
		
		<Field
			title='Config Name'
			validation={{
				'Name is required': validate.required
			}}
			input={{
				id: 'name',
				type: 'text',
				placeholder: " // Network name",
			}}
		/>

		<Field
			title='Select File'
			validation={{
				'Chainspec is required': validate.required
			}}
			input={{
				id: 'chainspec',
				type: 'file',
				accept: "application/json, application/JSON"
			}}
		/>
	</Form>
</PanelLayout>
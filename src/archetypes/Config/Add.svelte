<script>
	import { form } from 'svelte-forms';
	import { mutation } from '@util/graphql'
	import PanelLayout from '@layouts/Panel.svelte'
	import Form, { Field, validate } from '@components/Form'
	import { toast } from '@components/Toaster.svelte'

	export let onSuccess = () => {}
	export let onCancel = () => {}

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
			let result = await mutation(
				mutationQuery, 
				{
					variables: {
						name: fields.name, 
						chainspec: fields.chainspec 
					}
				}
			)
			
			toast.success(`Config ${result.name} added`)
			onSuccess(result)
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
	<p class="mdc-typography--body1">Paraplant requires a genesis block file in order to create nodes on a particular network. This file should be .json fomat. You can <a href='https://google.com' target="_blank" nofollow noreferrer>find out how to generate one of these files here</a>. </p>
	<Form 
		onSubmit={handleSubmit}
		onCancel={onCancel}
		buttons={{
			cancel: 'Cancel',
			submit: 'Add'
		}}
		>
		
		<Field
			title='Config Name'
			validation={{
				'Name is required': validate.required
			}}
			input={{
				id: 'name',
				type: 'text',
				placeholder: " // Production Config",
			}}
		/>

		<Field
			title='Select File'
			validation={{
				'Chainspec is required': validate.required
			}}
			input={{
				id: 'chainspec',
				type: 'json',
				accept: "application/json, application/JSON"
			}}
		/>
	</Form>
</PanelLayout>
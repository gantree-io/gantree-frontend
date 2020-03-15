<script>
	import { form } from 'svelte-forms';
	import { mutation } from '@util/graphql'
	import PanelLayout from '@layouts/Panel.svelte'
	import Form, { Step, Field, validate } from '@components/Form'
	import Chainspec, { fetchAll as fetchAllChainspecs } from '@archetypes/Chainspec/store'
	import Providers, { fetchAll as fetchAllProviders } from '@archetypes/Providers/store'
	import { toast } from '@components/Toaster.svelte'
	import Network, { addNetwork }  from './store.js'
	import GraphQLProgress from '@components/GraphQLProgress.svelte'
	import { dialog } from '@components/Dialog.svelte'

	export let onSuccess = () => {}
	export let onCancel = () => {}

	let subtitle = ''
	let _fields = {}

	// we want all available chainspecs
	let chainspecOptions
	Chainspec.query(fetchAllChainspecs).then(chainspecs => {
		let options = {
			default: 'Default Chainspec',
			new: 'Build New Chainspec'
		}
		chainspecs.forEach(chainspec => options[chainspec._id] = chainspec.name)
		chainspecOptions = options
	})
	
	// we want all available providers
	let providerOptions
	Providers.query(fetchAllProviders).then(providers => {
		let options = {}
		providers.forEach(provider => options[provider._id] = provider.name)
		providerOptions = options
	})

	// handle network deployment
	const handleDeploy = async ({fields, hasErrors, errors, setLoading}) => {
		if(!hasErrors){
			setLoading(true)
			Network.query(addNetwork, fields).then(data => {
				toast.success(`Deploying new network: ${data.name}. Check the status on the networks page`)
				onSuccess(data)
				setLoading(false)
			})
		}else{
			toast.warning(`Some fields have errors`)
		}
	}
</script>

<style lang="scss">
	:global(.mdc-typography--body1){
		margin-top: 0;
	}

	:global(.layout-panel) > :global(.body) > :global(form) :global(.form-button-group){
		display: flex;
	}
</style>

<PanelLayout 
	header={{
		title: 'Deploy Network',
		subtitle: subtitle
	}}
	>

	{#if !chainspecOptions || !providerOptions}
		<GraphQLProgress/>
	{:else}
		<Form 
			onSubmit={handleDeploy}
			onCancel={onCancel}
			onStep={({title, index}) => {
				subtitle = `${index}. ${title}`
			}}
			onChange={({fields}) => {
				_fields = fields
			}}
			>

			<Step 
				title='Name & Provider'
				buttons={{
					next: 'Next: Nodes'
				}}
				>

				<Field
					title='Network name'
					required
					input={{
						id: 'name',
						type: 'text',
						//value: 'testing', // TESTING
						placeholder: "Test Network",
					}}
				/>

				<Field
					title='Which Provider?'
					help='You can deploy more nodes using another provider once this network has been created'
					required
					validation={{
						//'Provider is required': validate.required
					}}
					input={{
						id: 'provider',
						type: 'select',
						options: providerOptions,
					}}
				/>
			</Step>

			<Step 
				title='Nodes'
				buttons={{
					back: 'Back',
					next: 'Next: Repo & Chainspec'
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
					required
					input={{
						id: 'validators',
						type: 'switch',
						off: 'No',
						on: 'Yes'
					}}
				/>

				<Field
					title='Which Chainspec?'
					required
					validation={{
						//'Chain Config is required': validate.required
					}}
					input={{
						id: 'chainspec',
						type: 'select',
						options: chainspecOptions,
						placeholder: 'Choose a chainspec'
					}}
				/>
			</Step>

			<Step 
				title='Binary & Chainspec' 
				buttons={{
					back: 'Back',
					next: 'Next: Confirm & Deploy'
				}}
				>
				<Field
					title='Binary Repo URL'
					subtitle='Paraplant will clone and compile this git repo. This repo should compile when cargo build --release is run in the root directory, and the binary should be output to ./target/release/substrate'
					required
					validation={{
						'Must be a valid URL': validate.url
					}}
					input={{
						id: 'binary_url',
						type: 'url',
						placeholder: "https://github.com/myaccount/myrepo",
					}}
				/>

				<Field
					title='Binary name'
					subtitle='Must match the binary name specified in the repo cargo.toml file'
					required
					input={{
						id: 'binary_name',
						type: 'text',
						placeholder: "Test Network",
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
				<p class='mdc-typography--body1'>
					You are about to deploy a new network called <strong>{_fields.name}</strong> consisting of <strong>{_fields.count} {_fields.validators ? 'Validator' : ''} Node{_fields.count > 1 ? 's' : ''}</strong> on <strong>{providerOptions[_fields.provider]}</strong> using the <strong>{chainspecOptions[_fields.chainspec]}</strong> chainspec.
				</p>

				<p class='mdc-typography--body1'>
					The Git repo you will be using to complie this network is <strong>{_fields.binary_url}</strong> and the binary name is defined as <strong>{_fields.binary_name}</strong>. 
				</p>
			</Step>
		</Form>
	{/if}
</PanelLayout>
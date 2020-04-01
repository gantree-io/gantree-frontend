<script>
	import { form } from 'svelte-forms'
	import _ from 'lodash'
	import { mutation } from '@util/graphql'
	import PanelLayout from '@layouts/Panel.svelte'
	import Form, { Step, Field, Hidden, validate } from '@components/Form'
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
			new: 'Build New Chainspec',
			default: 'Default Chainspec'
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

	let binPresets = [
		{
			name: 'Custom',
			value: 'custom',
			binary_name: 'Test Network',
			binary_url: 'https://substrate-node-bins.sgp1.digitaloceanspaces.com/node-template'
		}, 
		{
			name: 'Kusama',
			value: 'kusama',
			binary_name: 'polkadot-0.7.22',
			binary_url: 'https://github.com/paritytech/polkadot/releases/download/v0.7.22/polkadot',
		}, 
		{
			name: 'Edgeware',
			value: 'edgeware',
			binary_name: 'edgeware-3.0.1',
			binary_url: 'https://substrate-node-bins.sgp1.digitaloceanspaces.com/edgeware-3.0.1-CompiledByFlex',
		}
	]
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
						value: 'nt', // TESTING
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
						options: providerOptions
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
						value: 2,
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
						on: 'Yes',
						value: true
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
				title='Binary'
				buttons={{
					back: 'Back',
					next: 'Next: Confirm & Deploy'
				}}
				>

				<Field
					title="Binary Options"
					input={{
						id: 'preset_bin',
						type: 'radio',
						options: binPresets
					}}
				/>

				{#if _fields.preset_bin === 'custom'}
					<Field
						title='Binary Repository URL'
						help='Paraplant will clone and compile this git repo. This repo should compile when cargo build --release is run in the root directory.'
						validation={{
							'Must be a valid URL': validate.url
						}}
						input={{
							id: 'binary_url',
							type: 'url',
							placeholder: "https://github.com/myaccount/myrepo",
							value: 'https://substrate-node-bins.sgp1.digitaloceanspaces.com/node-template',
						}}
					/>

					<Field
						title='Binary name'
						help="Must match the binary name specified in the repository's cargo.toml file"
						required
						input={{
							id: 'binary_name',
							type: 'text',
							placeholder: "Test Network",
							value: 'node-template',
						}}
					/>

				{:else}
					<Hidden id='binary_url' value={_.get(_.find(binPresets, {value: _.get(_fields, 'preset_bin', null)}, {}), 'binary_url', null)}/>
					<Hidden id='binary_name' value={_.get(_.find(binPresets, {value: _.get(_fields, 'preset_bin', null)}, {}), 'binary_name', null)}/>
					<p class='mdc-typography--body2' style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title={_fields.binary_url}>
						<strong>Binary URL: </strong> {_fields.binary_url}<br/>
						<strong>Binary Name: </strong> {_fields.binary_name}
					</p>
				{/if}

				<Field						
					title={`Binary optons (${_.get(_fields, 'binary_opts', []).length})`}
					help="Binary options will be added to the binary at compile time"
					input={{
						id: 'binary_opts',
						type: 'pills',
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
					You are about to deploy a new network called <strong>{_fields.name}</strong> consisting of <strong>{_fields.count} {_fields.validators ? 'Validator' : ''} Node{_fields.count > 1 ? 's' : ''}</strong> on <strong>{providerOptions[_fields.provider]}</strong>.
				</p>

				<p class='mdc-typography--body1'>
					The Git repo you will be using to complie this network is <strong>{_fields.binary_url}</strong> and the binary name is defined as <strong>{_fields.binary_name}</strong>.
				</p>

				{#if _.get(_fields, 'binary_opts', []).length}
					<p class='mdc-typography--body1'>
						You have defined <strong>{_.get(_fields, 'binary_opts', []).length}</strong> custom binary options.
					</p>
				{/if}
			</Step>
		</Form>
	{/if}
</PanelLayout>
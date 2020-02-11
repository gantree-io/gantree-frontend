<script>
	import { form } from 'svelte-forms';
	import { mutation } from '@util/graphql' 

	export let onSuccess = () => {}
	let name = "";
	let chainspec = "";

  	const mutationQuery = `
 		mutation addConfig($name: String!, $chainspec: String!) {
			addConfig(name: $name, chainspec: $chainspec){
				_id
				name
				chainspec
			}
 		}
 	`;

	const myForm = form(() => ({
		name: {
			value: name,
			validators: ["required"]
		},
		chainspec: {
			value: chainspec,
			validators: ["required"]
		}
	}));

	const handleSubmit = async aa => {
		if($myForm.valid && $myForm.dirty){
			let result = await mutation(
				mutationQuery, 
				{
					variables: {
						name: name, 
						chainspec: JSON.stringify(chainspec[0]) 
					}
				}
			)
			
			onSuccess(result)
			PubSub.publish('CONFIG.ADD');
		}else{
			console.log('invalid form')
		}
	}
</script>

<style lang="scss">
	form{
		display: flex;
		flex-direction: column;
		> :global(*){
			margin-bottom: 1em;
			display: block;
		}
	}
</style>


<h2 class="mdc-typography--headline4">Add Genesis Config</h2>
<p class="mdc-typography--body1">Paraplant requires a genesis block file in order to create nodes on a particular network. This file should be .json fomat. You can find out how to generate one of these files here. </p>
<form on:submit={handleSubmit}>
	
	<input type="text" bind:value={name} class:valid={$myForm.name.valid}/>
	{#if $myForm.name.errors.includes('required') }<p>The name is required</p>{/if}

	<input type="file" bind:files={chainspec} class:valid={$myForm.chainspec.valid} accept="application/json"/>
	
	<button disabled={!$myForm.valid}>Login</button>
</form>
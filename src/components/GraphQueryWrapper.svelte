<script>
	import { onMount } from 'svelte'
	import { queryOld as GQLQuery } from '@util/graphql' 
	import GraphQLProgress from '@components/GraphQLProgress.svelte'
	export let query
	export let variables = {}
	export let field = null
	export let component
	export let props = {}
	export let emptyText = 'No items'
	export let errorText = 'Network Error'
	export let afterInit = () => {}

	let status = 'LOADING'
	let data
	$: data 

	const fetchData = async () => {
		status = 'LOADING'
		let res = await GQLQuery(query, {variables: variables})
		data = field ? res.data[field] : Object.values(res.data)[0]
		status = 'COMPLETE'
	}

   	onMount(async () => {
   		await fetchData()
   		afterInit({
   			refetch: fetchData,
   			data: data
   		})
   	})
</script>

{#if status === 'LOADING'}
	<GraphQLProgress/>
{:else if status === 'COMPLETE'}
	{#if Array.isArray(data)}
		{#each data as item}
			 <svelte:component this={component} {...props} {...item} />
		{:else}
			{emptyText}
		{/each}
	{:else}
		{#if Object.keys(data).length >= 0}
			<svelte:component this={component} {...props}/>
		{:else}
			{emptyText}
		{/if}
	{/if}
{:else}
	{errorText}
{/if}
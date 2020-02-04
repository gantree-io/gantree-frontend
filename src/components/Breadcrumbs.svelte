<script>
	import { beforeUpdate } from 'svelte';
	import Link from "@components/Link.svelte";
	import Icon from "@components/Icon.svelte";

	export let items;
	
	let breadcrumbs = []
	
	beforeUpdate(() => {
		let concatPath = ''
		breadcrumbs = items.map(item => {
			concatPath += `/${item}`
			return {
				title: item,
				url: concatPath
			}
		})
	});

</script>

<style lang="scss">
	.breadcrumbs{
		font-size: 0.9em;
		display: flex;
		align-items: center;
		line-height: 1em;
	}
	
	:global(.link){
		display: block;
		line-height: 1em;
		:global(svg){
			display: block
		}
	}

	.divider{
		padding: 0 0.3em;
		display: inline-block;
		opacity: 0.3;

		&:last-of-type{
			//display: none
		}
	}


</style>

<span class='breadcrumbs'>
	{#each breadcrumbs as breadcrumb}
		<Link to={breadcrumb.url}>
			{#if breadcrumb.title === '#'}
				<Icon type='home'/>
			{:else}
				{breadcrumb.title}
			{/if}
		</Link><span class='divider'>/</span>
	{/each}
</span>

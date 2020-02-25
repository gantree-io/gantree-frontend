<script>
	import { afterUpdate } from 'svelte';
	import { location } from 'svelte-spa-router'
	import Link from "@components/Link.svelte";
	import { Icon } from '@smui/common';
	
	let breadcrumbs = []

	 afterUpdate(() => {
		let concatPath = '#'
		breadcrumbs = $location.split('/').slice(0, -1).map(item => {
			concatPath += `${item}/`
			return {
				title: item === '' ? '#' : item,
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
		color: inherit;
		opacity: 0.6;
		font-weight: 300;

		&:visited{
			color: inherit;
		}

		&:hover{
			color: var(--color-highlight);
			opacity: 1;
		}

		:global(svg){
			display: block
		}

		:global(.material-icons.-home){
			display: block;
			font-size: 1.2em
		}
	}

	.divider{
		padding: 0 0.3em;
		display: inline-block;
		color: inherit;
		opacity: 0.2;

		&:last-of-type{
			//display: none
		}
	}
</style>

<span class='breadcrumbs'>
	{#each breadcrumbs as breadcrumb}
		<Link to={breadcrumb.url}>
			{#if breadcrumb.title === '#'}
				<!-- <Icon type='home'/> -->
				<Icon class="material-icons -home">house</Icon>
			{:else}
				{breadcrumb.title}
			{/if}
		</Link><span class='divider'>/</span>
	{/each}
</span>

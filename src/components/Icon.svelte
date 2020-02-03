<script>
	/*
		svg from here: https://github.com/FortAwesome/Font-Awesome/blob/538a5bc4cf7989821d052e3ff919e2bead07021c/svgs/solid
		1. add svg to icon dir
		2. add import below
		3. add entru in icons object
	*/

	export let type;
	import ChevronRight from '@icons/ChevronRight.svelte';
	import Clock from '@icons/Clock.svelte';
	import Home from '@icons/Home.svelte';
	import Sitemap from '@icons/Sitemap.svelte';

	const icons = {
		chevronRight: ChevronRight,
		clock: Clock,
		home: Home,
		sitemap: Sitemap
	}

	const icon = icons[type]
</script>

<style lang="scss">
	:global(svg){
		width: 1em;
		height: 1em;
		
		:global(path){
			fill: currentColor;
		}
	}
</style>

<svelte:component this={icon}/>
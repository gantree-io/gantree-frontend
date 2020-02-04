<script>
	/*
		1. find icon here: https://fontawesome.com/icons?d=gallery&q=node&m=free
		2. get svg here: https://github.com/FortAwesome/Font-Awesome/blob/538a5bc4cf7989821d052e3ff919e2bead07021c/svgs/solid
		3. add svg to icon dir
		4. add import below
		5. add entry in icons object
	*/

	import { beforeUpdate } from 'svelte';
	
	// icon imports
	import BookOpen from '@icons/BookOpen.svelte'
	import ChevronRight from '@icons/ChevronRight.svelte';
	import Clock from '@icons/Clock.svelte';
	import Cog from '@icons/Cog.svelte';
	import Cogs from '@icons/Cogs.svelte';
	import Home from '@icons/Home.svelte';
	import Invoice from '@icons/Invoice.svelte';
	import Key from '@icons/Key.svelte';
	import Network from '@icons/Network.svelte';
	import Plus from '@icons/Plus.svelte';
	import Server from '@icons/Server.svelte';
	import Sitemap from '@icons/Sitemap.svelte';
	import Spinner from '@icons/Spinner.svelte';
	import Tachometer from '@icons/Tachometer.svelte';
	import Trump from '@icons/Trump.svelte';
	import UserCircle from '@icons/UserCircle.svelte';
	import Users from '@icons/Users.svelte';

	export let type;

	const icons = {
		bookOpen: BookOpen,
		chevronRight: ChevronRight,
		clock: Clock,
		cog: Cog,
		cogs: Cogs,
		home: Home,
		invoice: Invoice,
		key: Key,
		network: Network,
		plus: Plus,
		server: Server,
		sitemap: Sitemap,
		spinner: Spinner,
		tachometer: Tachometer,
		trump: Trump,
		userCircle: UserCircle,
		users: Users,
	}

	let icon = icons[type]

	beforeUpdate(() => {
		icon = icons[type]
	});
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
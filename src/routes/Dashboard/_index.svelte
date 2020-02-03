<script>
	import Router from 'svelte-spa-router'
	import Dashboard from '@layouts/Dashboard.svelte'
	import Home from '@routes/Dashboard/Home.svelte'
	import Nodes from '@routes/Dashboard/Nodes.svelte'
	import Config from '@routes/Dashboard/Config.svelte'
	import Keys from '@routes/Dashboard/Keys.svelte'
	import Team from '@routes/Dashboard/Team.svelte'
	import Billing from '@routes/Dashboard/Billing.svelte'
	import Docs from '@routes/Dashboard/Docs.svelte'

	const routes = {
		'/': Home,
		'/nodes': Nodes,
		'/config': Config,
		'/keys': Keys,
		'/team': Team,
		'/billing': Billing,
		'/docs': Docs,
	}

	const tabs = [
		{
			text: 'Home',
			icon: 'home',
			href: '#/dashboard'
		},
		{
			text: 'Nodes',
			icon: 'sitemap',
			href: '#/dashboard/nodes'
		},
		{
			text: 'Config',
			icon: 'home',
			href: '#/dashboard/config'
		},
		{
			text: 'Keys',
			icon: 'home',
			href: '#/dashboard/keys'
		},
		{
			text: 'Team',
			icon: 'home',
			href: '#/dashboard/team'
		},
		{
			text: 'Billing',
			icon: 'home',
			href: '#/dashboard/billing'
		},
		{
			text: 'Docs',
			icon: 'home',
			href: '#/dashboard/docs'
		}
	]
</script>

<Dashboard tabs={tabs}>
	<Router {routes} prefix='/dashboard' />
</Dashboard>
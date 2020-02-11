<script>
	import Router from 'svelte-spa-router'
	import Dashboard from '@layouts/Dashboard.svelte'
	import Home from '@routes/Dashboard/Home.svelte'
	import NetworkIndex, { actions as networkActions } from '@archetypes/Network/Index.svelte'
	//import NodeIndex, { actions as nodeActions }  from '@archetypes/Node/Index.svelte'
	import Config, { actions as configActions } from '@archetypes/Config/Index.svelte'
	import Keys from '@routes/Dashboard/Keys.svelte'
	import Team from '@routes/Dashboard/Team.svelte'
	import Billing from '@routes/Dashboard/Billing.svelte'
	import Docs from '@routes/Dashboard/Docs.svelte'

	const routes = {
		'/': Home,
		'/networks': NetworkIndex,
		//'/nodes': NodeIndex,
		'/config': Config,
		'/keys': Keys,
		'/team': Team,
		'/billing': Billing,
		'/docs': Docs,
	}

	const tabs = [
		{
			name: 'Dashboard',
			icon: 'dashboard',
			href: '#/dashboard'
		},
		{
			name: 'Networks',
			icon: 'blur_on',
			href: '#/dashboard/networks',
			actions: networkActions
		},
		// {
		// 	name: ' - Nodes (testing)',
		// 	icon: 'storage',
		// 	href: '#/dashboard/nodes',
		// 	actions: nodeActions
		// },
		{
			name: 'Configs',
			icon: 'settings',
			href: '#/dashboard/config',
			actions: configActions
		},
		{
			name: 'Keys',
			icon: 'vpn_key',
			href: '#/dashboard/keys'
		},
		{
			name: 'Team',
			icon: 'people',
			href: '#/dashboard/team'
		},
		{
			name: 'Billing',
			icon: 'receipt',
			href: '#/dashboard/billing'
		},
		{
			name: 'Docs',
			icon: 'menu_book',
			href: '#/dashboard/docs'
		}
	]
</script>

<Dashboard tabs={tabs}>
	<Router {routes} prefix='/dashboard' />
</Dashboard>
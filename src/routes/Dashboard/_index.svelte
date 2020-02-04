<script>
	import Router from 'svelte-spa-router'
	import Dashboard from '@layouts/Dashboard.svelte'
	import Home from '@routes/Dashboard/Home.svelte'
	import Networks from '@routes/Dashboard/Networks.svelte'
	import Config from '@routes/Dashboard/Config.svelte'
	import Keys from '@routes/Dashboard/Keys.svelte'
	import Team from '@routes/Dashboard/Team.svelte'
	import Billing from '@routes/Dashboard/Billing.svelte'
	import Docs from '@routes/Dashboard/Docs.svelte'

	const routes = {
		'/': Home,
		'/networks': Networks,
		'/config': Config,
		'/keys': Keys,
		'/team': Team,
		'/billing': Billing,
		'/docs': Docs,
	}

	const tabs = [
		{
			name: 'Dashboard',
			icon: 'tachometer',
			href: '#/dashboard'
		},
		{
			name: 'Networks',
			icon: 'network',
			href: '#/dashboard/networks'
		},
		{
			name: 'Configs',
			icon: 'cogs',
			href: '#/dashboard/config'
		},
		{
			name: 'Keys',
			icon: 'key',
			href: '#/dashboard/keys'
		},
		{
			name: 'Team',
			icon: 'users',
			href: '#/dashboard/team'
		},
		{
			name: 'Billing',
			icon: 'invoice',
			href: '#/dashboard/billing'
		},
		{
			name: 'Docs',
			icon: 'bookOpen',
			href: '#/dashboard/docs'
		}
	]
</script>

<Dashboard tabs={tabs}>
	<Router {routes} prefix='/dashboard' />
</Dashboard>
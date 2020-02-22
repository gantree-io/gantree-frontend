<script>
	import Router from 'svelte-spa-router'
	import Home from '@routes/DashboardOld/Home.svelte'
	import NetworkIndex from '@archetypes/Network/Index.svelte'
	import Config from '@archetypes/Config/Index.svelte'
	import Keys from '@archetypes/Keys/Index.svelte'
	import Team from '@archetypes/Team/Index.svelte'
	import Billing from '@routes/DashboardOld/Billing.svelte'
	import Docs from '@routes/DashboardOld/Docs.svelte'

	//import ConfigAdd from '@archetypes/Config/Add.svelte'
	

	import { afterUpdate } from 'svelte';
 	import { location } from 'svelte-spa-router'
 	import _ from 'lodash'

 	import Drawer, {AppContent, Content, Header, Title, Subtitle} from '@smui/drawer';
 	import List, {Item, Text, Separator, Graphic} from '@smui/list';
 	import { Icon } from '@smui/common';
 	import Button from '@smui/button';
 
 	import RandomQuote from '@components/RandomQuote.svelte'
 	import UserAccountMenu from '@archetypes/User/AccountMenu.svelte'
 	
 	let active = {}
 	//let breadcrumbs = [] 
 	
 	afterUpdate(() => {
 		active = _.find(tabs, {href: `#${$location}`})
 		//breadcrumbs = active.href.split('/').slice(0, -1)
 	});




	const routes = {
		'/': Home,
		'/networks': NetworkIndex,
		'/config': Config,
		//'/configadd': ConfigAdd,
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
			href: '#/dashboard/networks'
		},
		{
			name: 'Configs',
			icon: 'settings',
			href: '#/dashboard/config',
		},
		// {
		// 	name: ' - Add Config',
		// 	icon: 'settings',
		// 	href: '#/dashboard/configadd',
		// },
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

<style lang="scss">
	main{
		min-height: 100vh;
		display: flex;
		position: relative;
		display: flex;
		width: 100%;
		overflow: hidden;
		z-index: 0;
		justify-content: stretch;
	
		> :global(.mdc-drawer) {
			min-height: 100vh;
			position: relative;
			filter: invert(90%);
			overflow: visible;

			> :global(.mdc-drawer__content > .mdc-list){
				&.bottom{
					position: absolute;
					bottom: 0;
					width: 100%;
				}

				> :global(.quote) {
					padding: 2em;
					opacity: 0.5;
					font-size: var(--font-size-xsmall);
				}
			}

			:global(.mdc-list-item) {
				margin: 0;
				padding: 0 1.2em;
				border-radius: 0;

				> :global(.material-icons.chevron) {
					position: absolute;
					right: 0.6em;
					top: 50%;
					transform: translateY(-50%);
					opacity: 0.7;
					transition: right 0.15s ease-in-out;
					margin: 0;
				}

				&:hover > :global(.material-icons.chevron) {
					right: 0.4em;
				}
			}
		}

		> :global(.mdc-drawer-app-content ) {
			width: 100%;
		}
	}

	.dashboard-header,
	.dashboard-inner{
		padding: 1.6em;
	}

	.dashboard-header{
		background: var(--color-dark-grey);
		color: var(--color-light);
		position: relative;

		h1{
			display: flex;
			align-items: center;
			margin: 0;
			padding: 0.3em 0 0;
			line-height: 1em;

			> :global(.material-icons) {
				margin-right: 0.2em;
				font-size: inherit;
			}
		}

		.extra{
			position: absolute;
			bottom: 1.4em;
			right: 1.4em;
		}
	}
</style>

<main>
	<Drawer>
		<Header>
			<Title>Gantree</Title>
			<Subtitle>We've got some oil for that</Subtitle>
		</Header>
		<Content>
			<List>
				<Separator nav />
				{#each tabs as tab}
					<Item href={tab.href||'#'}>
						<Graphic class="material-icons">{tab.icon}</Graphic>
						<Text>{tab.name}</Text>
						<Graphic class="material-icons chevron">chevron_right</Graphic>
					</Item>
				{/each}
			</List>
			<List class='bottom'>
				<RandomQuote/>
				<Separator nav />
				<UserAccountMenu/>
			</List>
		</Content>
	</Drawer>

	<AppContent>
		<Router {routes} prefix='/dashboard' />
	</AppContent>
</main>
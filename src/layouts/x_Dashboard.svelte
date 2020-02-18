<script>
 	import { afterUpdate } from 'svelte';
 	import { location } from 'svelte-spa-router'
 	import _ from 'lodash'

 	import Drawer, {AppContent, Content, Header, Title, Subtitle} from '@smui/drawer';
 	import List, {Item, Text, Separator, Graphic} from '@smui/list';
 	import { Icon } from '@smui/common';
 	import Button from '@smui/button';
 
 	import Breadcrumbs from '@components/Breadcrumbs.svelte'
 	import RandomQuote from '@components/RandomQuote.svelte'
 	import UserAccountMenu from '@archetypes/User/AccountMenu.svelte'
 	
 	export let tabs = []
 	let active = {}
 	let breadcrumbs = [] 
 	
 	afterUpdate(() => {
 		active = _.find(tabs, {href: `#${$location}`})
 		breadcrumbs = active.href.split('/').slice(0, -1)
 	});
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
			<Title>Ganwwtree</Title>
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
		<header class="dashboard-header">
			<Breadcrumbs items={breadcrumbs}/>
			<h1 class="mdc-typography--headline4">
				<Icon class="material-icons">{active.icon}</Icon> 
				{active.name}
			</h1>

			<span class="extra">
				{#each active.actions||[] as action}
					<Button variant='text' dense on:click={action.callback}>
						<Icon class="material-icons">{action.icon}</Icon> 
						{action.text}
					</Button>
				{/each}
			</span>
		</header>
		<div class="dashboard-inner">
			<slot></slot>
		</div>
	</AppContent>
</main>
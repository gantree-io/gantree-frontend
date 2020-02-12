<script>
 	import _ from 'lodash'

 	import Drawer, {AppContent, Content, Header, Title, Subtitle} from '@smui/drawer';
 	import List, {Item, Text, Separator, Graphic} from '@smui/list';
 	import IconButton, { Icon as IconButtonIcon } from '@smui/icon-button';
 	import Menu from '@smui/menu';

 	import { Icon } from '@smui/common';
 	import Button from '@smui/button';
 	import Breadcrumbs from '@components/Breadcrumbs.svelte'

 	export let header
 	export let showBreadcrumbs = false
 	export let actions = []

	let menu;
 	let menuAnchor;
</script>

<style lang="scss">


	.layout-panel{
		background: var(--color-light);
		overflow: hidden;
		width: auto;
		height: auto;
		display: block;
		padding:0;
		display: flex;
		flex-direction: column;

		>.header{
			border-bottom: 1px solid var(--color-light-grey);
			position: relative;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.left{
				padding: 1em 1em 1em 2em;
				display: block;

				:global(.breadcrumbs){
					margin-bottom: 0.3em;
					color: var(--color-dark);
				}

				.title{
					display: flex;
					align-items: baseline;

					h1,p{
						margin: 0;
						display: inline-block;
					}

					h1{
						font-weight: 100;
						:global(.placeholder){
							line-height: inherit;
							font-size: inherit;
							vertical-align: bottom;
							opacity: 0.2;
							animation-name: spin;
							animation-duration: 4000ms;
							animation-iteration-count: infinite;
							animation-timing-function: linear;
						}
					}

					p{
						font-weight: 100;
						opacity: 0.8;
						margin: 0 0.5em;
					}
				}
				
				
			}

			.right{
				padding: 0;
				display: flex;
				align-items: center;
				justify-content: flex-end;
				align-self: stretch;

				.menu{
					margin-right: 1em;
					:global(.mdc-icon-button){
						opacity: 0.4;
						&:hover{
							opacity: 1;
						}
					}
				}
			}
		}

		>.body{
			padding: 1.5em 2em;
			overflow: scroll;
		}
	}
</style>

<section class='layout-panel'>
	{#if header}
		<header class="header">
			<span class="left">
				{#if showBreadcrumbs}<Breadcrumbs/>{/if}
				{#if header.title || header.subtitle}
					<div class="title">
						<h1 class="mdc-typography--headline4">
							{#if header.icon}
								<Icon class="material-icons">{header.icon}</Icon>
							{/if}
							{#if header.title}
								{header.title}
							{:else}
								<Icon class="material-icons placeholder">autorenew</Icon>
							{/if}
						</h1>
						{#if header.subtitle}
							<p class="mdc-typography--body2">
								// {header.subtitle}
							</p>
						{/if}
					</div>
				{/if}
			</span>

			<span class="right">
				{#if header.actions}
					<div class='menu' bind:this={menuAnchor}>
						<IconButton on:click={() => menu.setOpen(true)}>
							<IconButtonIcon class="material-icons">menu</IconButtonIcon>
						</IconButton>
						<Menu 
							bind:this={menu} 
							bind:anchorElement={menuAnchor} 
							anchorCorner="BOTTOM_LEFT"
							>
							<List dense>
								{#each header.actions||[] as action}
									<Item on:click={() => action.callback()}>
										<Graphic class="material-icons">{action.icon}</Graphic>
										<Text>{action.text}</Text>
									</Item>
								{/each}
							</List>
						</Menu>
					</div>
				{/if}
			</span>
		</header>
	{/if}

	<div class="body">
		<slot></slot>
	</div>
</section>

<!-- <div class='layout-panel'>
	
	{#if title || subtitle || actions}
		<header class="header">
			{#if showBreadcrumbs}<Breadcrumbs items={breadcrumbs}/>{/if}
			
			<h1 class="mdc-typography--headline4">
				<Icon class="material-icons">{icon}</Icon> 
				{title}
			</h1>

			<span class="extra">
				{#each actions||[] as action}
					<Button variant='text' dense on:click={action.callback}>
						<Icon class="material-icons">{action.icon}</Icon> 
						{action.text}
					</Button>
				{/each}
			</span>
		</header>
	{/if}
	
	<section class="body">
		<slot></slot>
	</section>
</div> -->
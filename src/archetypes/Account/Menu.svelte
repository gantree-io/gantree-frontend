<script>
	import { onMount } from 'svelte'
	import Account, { AuthStatus } from './store'
	import { Icon } from '@smui/common';
	import Menu from '@smui/menu';
	import List, {Item, Text, Separator, Graphic} from '@smui/list';
	import IconButton, { Icon as IconButtonIcon } from '@smui/icon-button';
	import { open as OpenDrawer } from '@components/Drawer.svelte';
	import AccountDetail from './Detail.svelte'

	export let providers = []
	
	let username
	let status
	let menu;
	let menuAnchor;

	Account.subscribe(account => {
		username = account.user.name
		status = account.authStatus
	});
</script>

<style lang="scss">
	.account-menu{
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.5em 1em;
		position: relative;

		>span{
			display: flex;
			align-items: center;
			white-space: nowrap;
			max-width: 80%;
			overflow: hidden;

			>span{
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				margin: 0 0.5em;
			}

			> :global(.material-icons){
				//margin-right: 0.5em;
			}
		}

		:global(.mdc-list-item > *){
			color: var(--color-theme-dark)
		}

		:global(.mdc-icon-button){
			width: 36px;
			height: 36px;
			padding: 6px;
		}
	}
</style>

<div class='account-menu'>
	{#if status === AuthStatus.LOADING || status === AuthStatus.UNAUTHENTICAED}
		<Icon class="material-icons -animation-spin">autorenew</Icon>
	{:else if status === AuthStatus.AUTHENTICATED}
		<span class='user'>
			<Icon class="material-icons">person</Icon>
			<span>{username}</span>
		</span>

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
					<Item on:click={() => OpenDrawer(AccountDetail)} >
						<Graphic class="material-icons">person</Graphic>
						<Text>My Account</Text>
					</Item>
					<Item href='#/dashboard/team'>
						<Graphic class="material-icons">people</Graphic>
						<Text>My Team</Text>
					</Item>
					<Item on:click={() => Account.signout()}>
						<Graphic class="material-icons">power_settings_new</Graphic>
						<Text>Logout</Text>
					</Item>
				</List>
			</Menu>
		</div>
	{/if}
</div>
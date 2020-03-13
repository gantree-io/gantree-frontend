<script>
	import { onMount } from 'svelte'
	import AccountStore, { AuthStatus } from './store'
	import { Icon } from '@smui/common';
	import Menu from '@smui/menu';
	import List, {Item, Text, Separator, Graphic} from '@smui/list';
	import IconButton, { Icon as IconButtonIcon } from '@smui/icon-button';

	export let providers = []
	
	let username
	let status
	let menu;
	let menuAnchor;

	AccountStore.subscribe(account => {
		username = account.user.name
		status = account.authStatus

		console.log(status)
	});
</script>

<style lang="scss">
	.account-menu{
		display: flex;
		align-items: center;
		padding: 0.5em 1em;

		>*{
			margin: 0 1em;
			line-height: 1em;
			white-space: nowrap
		}
	}
</style>

<div class='account-menu'>
	{#if status === AuthStatus.LOADING || status === AuthStatus.UNAUTHENTICAED}
		<Icon class="material-icons -animation-spin">autorenew</Icon>
	{:else if status === AuthStatus.AUTHENTICATED}
		<Icon class="material-icons">person</Icon>
		<span>{username}</span>

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
					<Item href='#/account'>
						<Graphic class="material-icons">person</Graphic>
						<Text>My Account</Text>
					</Item>
					<Item href='#/dashboard/team'>
						<Graphic class="material-icons">person</Graphic>
						<Text>My Team</Text>
					</Item>
					<Item on:click={() => AccountStore.logout()}>
						<Graphic class="material-icons">power_settings_new</Graphic>
						<Text>Logout</Text>
					</Item>
				</List>
			</Menu>
		</div>
	{/if}
</div>
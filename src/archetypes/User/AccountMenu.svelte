<script>
	import { onMount } from 'svelte'
	import UserStore, { UserStatus } from './store'
	import { Icon } from '@smui/common';
	import Menu from '@smui/menu';
	import List, {Item, Text, Separator, Graphic} from '@smui/list';
	import IconButton, { Icon as IconButtonIcon } from '@smui/icon-button';

	export let providers = []
	
	let _username
	let _status
	let menu;
	let menuAnchor;

	UserStore.subscribe(({user, status})=> {
		_username = user.name
		_status = status
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
	{#if _status === UserStatus.LOADING || _status === UserStatus.UNAUTHENTICAED}
		<Icon class="material-icons -animation-spin">autorenew</Icon>
	{:else if _status === UserStatus.AUTHENTICATED}
		<Icon class="material-icons">person</Icon>
		<span>{_username}</span>

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
					<Item>
						<Graphic class="material-icons">person</Graphic>
						<Text>My Account</Text>
					</Item>
					<Item>
						<Graphic class="material-icons">person</Graphic>
						<Text>My Team</Text>
					</Item>
					<Item on:click={UserStore.logout}>
						<Graphic class="material-icons">power_settings_new</Graphic>
						<Text>Logout</Text>
					</Item>
				</List>
			</Menu>
		</div>
	{/if}
</div>

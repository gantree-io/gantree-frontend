<script>
	import { onMount, onDestroy } from 'svelte';
	import Paper, { Title, Subtitle, Content} from '@smui/paper';
	import { Icon } from '@smui/common';
	import Menu from '@smui/menu';
	import List, {Item, Text, Separator, Graphic} from '@smui/list';
	import IconButton, { Icon as IconButtonIcon } from '@smui/icon-button';
	import { toast } from '@components/Toaster.svelte'
	
	import User, { resendInvitation, activate, deactivate, deleteUser } from './store'
	import AppStore from '@app/store'
	import Hotwire from '@util/hotwire.js'

	export let _id
	export let name
	export let email
	export let status
	export let isTeamOwner = false
	export let bossPrivileges = false
	
	let menu;
	let menuAnchor;
	let _you

	onMount(async () => {
		AppStore.subscribe(({user}) => {
			_you = user._id === _id
		})

		const unwatch = await Hotwire.subscribe(`${_id}.UPDATE`, user => {
			name = user.name
			email = user.email
			status = user.status
		})

		return () => unwatch()
	})
</script>

<style lang="scss">
	:global(.user-teaser.smui-paper){
		background-color: var(--color-dark);
		color: var(--color-light);
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.6em;
		margin-bottom: 0.6em;
		padding: 14px 16px;

		&[data-status='INVITATION_SENT']{
			background-color: var(--color-dark-grey);
		}

		&[data-status='INACTIVE']{
			background-color: var(--color-mid-grey);
		}

		.title{
			display: flex;
			align-items: flex-end;

			:global(.smui-paper__title){
				margin: 0 0.3em;
				line-height: 1em;
			}

			:global(.smui-paper__content){
				font-size: 0.9em;
				font-weight: 300;
				line-height: 1em;
				opacity: 0.8;
				margin: 0 0.3em;
				display: flex;
				align-items: flex-end;

				:global(.material-icons.owner){
					color: var(--color-yellow);
					font-size: 1em;
					margin-right: 0.3em;
				}
			};
		}

		.controls{
			display: flex;
			align-items: center;

			.status{
				display: flex;
				align-items: center;

				:global(.material-icons){
					font-size: 1.2em;
					margin-left: 0.3em
				}

				&.status-active{ color: var(--color-status-success) }
				&.status-invitation_sent{ color: var(--color-status-warning) }
				&.status-inactive{ color: var(--color-status-error) }
			}
		}
	}
</style>

<Paper class='user-teaser' data-status={status} elevation="4">
	<div class='title'>
		<Icon class='material-icons'>person</Icon>
		{#if name}<Title>{name}</Title>{/if}
		<Content>
			{#if isTeamOwner}<Icon class="material-icons owner">stars</Icon>{/if}
			{email}
			{#if _you}(you){/if}
		</Content>
		<!-- {#if isTeamOwner}<Icon class="material-icons owner">stars</Icon>{/if} -->
	</div>
	<div class='controls'>
		<div class={`mdc-typography--caption status status-${status.toLowerCase()}`}>
			{#if status === 'ACTIVE'}
				Active <Icon class='material-icons'>check_circle</Icon>
			{:else if status === 'INVITATION_SENT'}
				Invite Sent<Icon class='material-icons'>watch_later</Icon>
			{:else}
				Inactive <Icon class='material-icons'>error</Icon>
			{/if}
		</div>

		{#if bossPrivileges}
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
						{#if !isTeamOwner}
							{#if status === 'ACTIVE'}
								<Item on:click={() => console.log('todo')}>
									<Graphic class="material-icons">person</Graphic>
									<Text>Make Team Owner</Text>
								</Item>
								<Item on:click={() => User.query(deactivate, {_id: _id}).then(() => toast.warning(`User deactivated`))}>
									<Graphic class="material-icons">person</Graphic>
									<Text>Deactivate</Text>
								</Item>
							{/if}

							{#if status === 'INVITATION_SENT'}
								<Item 
									on:click={() => {
										const _t = toast.loading(`Resending invitation...`)
										User.query(resendInvitation, {_id: _id}).then(() => _t.success(`Invitation sent!`))
									}}>
									<Graphic class="material-icons">person</Graphic>
									<Text>Resend Invitation</Text>
								</Item>
							{/if}

							{#if status === 'INACTIVE'}
								<Item on:click={() => User.query(activate, {_id: _id}).then(() => toast.success(`User activated`))}>
									<Graphic class="material-icons">person</Graphic>
									<Text>Activate</Text>
								</Item>
							{/if}

							<Item on:click={() => User.query(deleteUser, {_id: _id}).then(() => toast.success(`User deleted`))}>
								<Graphic class="material-icons">person</Graphic>
								<Text>Delete</Text>
							</Item>
						{:else}
							<Item>
								<Text>You keep on doing you!</Text>
							</Item>
						{/if}

					</List>
				</Menu>
			</div>
		{/if}
	</div>
</Paper>
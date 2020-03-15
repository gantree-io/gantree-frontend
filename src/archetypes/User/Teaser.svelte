<script>
	import { onMount, onDestroy } from 'svelte';
	import Paper, { Title, Subtitle, Content} from '@smui/paper';
	import { Icon } from '@smui/common';
	import Menu from '@smui/menu';
	import List, {Item, Text, Separator, Graphic} from '@smui/list';
	import IconButton, { Icon as IconButtonIcon } from '@smui/icon-button';
	import User, { resendInvitation, activate, deactivate, deleteUser } from './store'
	import Account from '@archetypes/Account/store'
	import Team, { updateOwner } from '@archetypes/Team/store'
	import Hotwire from '@components/Hotwire.svelte'
	import { dialog } from '@components/Dialog.svelte'
	import { toast } from '@components/Toaster.svelte'

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
		Account.subscribe(({user}) => {
			_you = user._id === _id
		})
	})
</script>

<style lang="scss">
	:global(.user-teaser.smui-paper){
		cursor: default;
		&[data-status='INVITATION_SENT']{
			background-color: var(--color-theme-mid);
			filter: saturate(0.8);
		}

		&[data-status='INACTIVE']{
			background-color: var(--color-theme-mid);
			filter: saturate(0.3);
		}

		.controls{
			.status,
			.owner{
				display: flex;
				align-items: center;
				:global(.material-icons){
					font-size: 1.2em;
					margin-left: 0.3em
				}
			}

			.status{
				&.status-active{ color: var(--color-status-success) }
				&.status-invitation_sent{ color: var(--color-status-warning) }
				&.status-inactive{ color: var(--color-status-error) }
			}

			.owner{
				margin-right: 1em;
				color: var(--color-theme-highlight);
			}
		}
	}
</style>

<Hotwire
	subscriptions={[
		{
			name: _id,
			event: `UPDATE`,
			callback: user => {
				name = user.name
				email = user.email
				status = user.status
			}
		}
	]}
	>
	<Paper class='user-teaser' data-status={status} >
		<div class='title'>
			<Icon class='material-icons'>person</Icon>
			{#if name}<Title>{name}</Title>{/if}
			<Content>
				{email}
				{#if _you}(you){/if}
			</Content>
		</div>
		<div class='controls'>
			{#if isTeamOwner}
				<div class={`mdc-typography--caption owner`}>
					Owner <Icon class="material-icons">stars</Icon>
				</div>
			{/if}
			
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
									<Item on:click={() => User.query(deactivate, {_id: _id}).then(() => toast.warning(`User deactivated`))}>
										<Graphic class="material-icons">toggle_off</Graphic>
										<Text>Deactivate</Text>
									</Item>
									<Item
										on:click={e => {
											e.preventDefault()
											e.stopPropagation()
											dialog.warning({
												title: "Transfer ownership",
												subtitle: 'Make this user the team owner? Warning: You will be removed as owner and no longer have ownership privileges.',
												confirmButton: 'Confirm Transfer',
												onConfirm: () => {
													Team.mutation(updateOwner, {_id: _id})
														.then(() => {
															toast.success(`You have successfully given away team ownership`)
															//dialog.close()
														})
												},
												cancelButton: 'Take me back!',
											})
										}}>
										<Graphic class="material-icons">star</Graphic>
										<Text>Make Team Owner</Text>
									</Item>
								{/if}

								{#if status === 'INVITATION_SENT'}
									<Item 
										on:click={() => {
											const _t = toast.loading(`Resending invitation...`)
											User.query(resendInvitation, {_id: _id}).then(() => _t.success(`Invitation resent!`))
										}}>
										<Graphic class="material-icons">email</Graphic>
										<Text>Resend Invitation</Text>
									</Item>
								{/if}

								{#if status === 'INACTIVE'}
									<Item on:click={() => User.mutation(activate, {_id: _id}).then(() => toast.success(`User activated`))}>
										<Graphic class="material-icons">toggle_on</Graphic>
										<Text>Activate</Text>
									</Item>
								{/if}

								<Item 
									on:click={e => {
										e.preventDefault()
										e.stopPropagation()
										dialog.warning({
											title: "Delete user",
											subtitle: 'This account will be removed and will no longer have access to Gantree.',
											confirmButton: 'Confirm Delete',
											onConfirm: () => {
												User.mutation(deleteUser, {_id: _id})
													.then(() => toast.success(`User deleted`))
													.catch(msg => toast.error(msg))
												},
											cancelButton: 'Take me back!',
										})
									}}
									>
									<Graphic class="material-icons">delete</Graphic>
									<Text>Delete</Text>
								</Item>
							{:else}
								<Item on:click={() => toast.success(`Oh, yes you do!`)}>
									<Graphic class="material-icons">favorite</Graphic>
									<Text>You look amazing today!</Text>
								</Item>
							{/if}

						</List>
					</Menu>
				</div>
			{/if}
		</div>
	</Paper>
</Hotwire>
<script>
	import { onMount, onDestroy } from 'svelte';
	import Paper, { Title, Subtitle, Content} from '@smui/paper';
	import { Icon } from '@smui/common';
	import Menu from '@smui/menu';
	import Button, {Label} from '@smui/button';
	import List, {Item, Text, Separator, Graphic} from '@smui/list';
	import IconButton, { Icon as IconButtonIcon } from '@smui/icon-button';
	import { toast } from '@components/Toaster.svelte'
	import { open as OpenModal, close as CloseModal} from '@components/Modal.svelte'
	import Key, { deleteKey } from './store'

	import KeyAdd from './Add.svelte'
	
	//import User, { resendInvitation, activate, deactivate, deleteUser } from './store'
	//import AppStore from '@app/store'
	import Hotwire from '@util/hotwire.js'

	export let _id
	export let provider
	export let name
	export let key
	
	let menu;
	let menuAnchor;

	onMount(async () => {
		const unwatch = await Hotwire.subscribe(`${_id}.UPDATE`, _key => {
			key = _key
		})
		return () => unwatch()
	})
</script>

<style lang="scss">
	:global(.key-teaser.smui-paper){
		background-color: var(--color-grey);
		color: var(--color-light);
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.6em;
		margin-bottom: 0.6em;
		padding: 14px 16px;

		.title{
			display: flex;
			align-items: flex-end;

			:global(.material-icons){
				color: var(--color-status-error);
			}

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
			};
		}

		.controls{
			display: flex;
			align-items: center;
		}

		&[data-active='true']{
			background-color: var(--color-dark);

			.title{
				:global(.material-icons){
					color: var(--color-status-success);
				}
			}
		}

		&[data-active='false']{
			background-color: var(--color-dark-grey);

			.title{
				:global(.material-icons){
					color: var(--color-status-error);
					opacity: 0.6;
				}
			}
		}

	}
</style>

<Paper class='key-teaser' data-active={!!key} elevation={key ? 4 : 0}>
	<div class='title'>
		<!-- <Icon class='material-icons'>vpn_key</Icon> -->
		<Icon class='material-icons'>{!!key ? 'check_circle' : 'cancel'}</Icon>
		<Title>{provider}</Title>
		<Content>{name}</Content>
	</div>
	<div class='controls'>
		<div class={`mdc-typography--caption`}>
			{#if key}
				<Button 
					on:click={() => {
						Key.query(deleteKey, {_id: _id}).then(() => {
							toast.success(`Key removed`)
						})
					}}
					>
					remove
					<Icon class='material-icons'>close</Icon>
				</Button>
			{:else}
				<Button 
					on:click={() => {
						OpenModal(KeyAdd, {
							onSuccess: () => CloseModal(),
							name: name,
							provider: provider
						})
					}}
					>
					Configure Key&nbsp;&nbsp;
					<Icon class='material-icons'>vpn_key</Icon>
				</Button>
			{/if}
		</div>

		<!-- <div class='menu' bind:this={menuAnchor}>
			<IconButton on:click={() => menu.setOpen(true)}>
				<IconButtonIcon class="material-icons">menu</IconButtonIcon>
			</IconButton>
			<Menu 
				bind:this={menu} 
				bind:anchorElement={menuAnchor} 
				anchorCorner="BOTTOM_LEFT"
				>
				<List dense>
					{#if !key}
						<Item on:click={() => console.log('todo: add')}>
							<Graphic class="material-icons">person</Graphic>
							<Text>Add Key</Text>
						</Item>
					{:else}
						<Item on:click={() => console.log('todo: delete')}>
							<Graphic class="material-icons">person</Graphic>
							<Text>Delete Key</Text>
						</Item>
					{/if}
				</List>
			</Menu>
		</div> -->

	</div>
</Paper>
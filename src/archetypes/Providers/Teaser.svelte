<script>
	import { onMount, onDestroy } from 'svelte';
	import Paper, { Title, Content} from '@smui/paper';
	import { Icon } from '@smui/common';
	import Button, { Label } from '@smui/button';
	import { toast } from '@components/Toaster.svelte'
	import { dialog } from '@components/Dialog.svelte'
	import { open as OpenModal, close as CloseModal} from '@components/Modal.svelte'
	import Credentials, { deleteProvider } from './store'
	import AddAWS from './AddAWS.svelte'
	import AddGCP from './AddGCP.svelte'
	import AddDO from './AddDO.svelte'

	import Menu from '@smui/menu';
	import List, {Item, Text, Graphic, PrimaryText, SecondaryText } from '@smui/list';
	import IconButton, { Icon as IconButtonIcon } from '@smui/icon-button';


	export let _id
	export let provider
	export let name
	export let networkCount = 0
	export let nodeCount = 0

	let menu;
	let menuAnchor;
</script>

<style lang="scss">
	:global(.provider-teaser.smui-paper){

		.title{
			:global(.material-icons.key){
				margin-left: -0.1em;
				width: 0.5em;
				overflow: hidden;
				direction: rtl;
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

			.status{
				display: flex;
				align-items: center;
				color: var(--color-mid-grey);

				&[data-used="true"]{ color: var(--color-status-success) }
				&[data-used="false"]{ color: var(--color-white); opacity: 0.7; }

				:global(.material-icons){
					font-size: 1.2em;
					margin-left: 0.3em
				}
			}
		}

		&[data-active='true']{
			.title{
				:global(.material-icons){
					color: var(--color-status-success);
				}
			}
		}

		&[data-active='false']{
			background-color: var(--color-theme-mid);
			filter: saturate(0.3);

			.title{
				:global(.material-icons){
					color: var(--color-status-error);

				}
			}
		}

	}
</style>

<Paper class='provider-teaser' data-active={!!_id} elevation="0">
	<div class='title'>
		<Icon class='material-icons'>{!!_id ? 'check_circle' : 'cancel'}</Icon>
		<Icon class='material-icons key'>vpn_key</Icon>
		<Title>{provider}</Title>
		<Content>{name}</Content>
	</div>
	<div class='controls'>

		<div class={`mdc-typography--caption status`} data-used={networkCount > 0}>
			{#if _id}
				{#if networkCount > 0}
					Used by {networkCount} network{networkCount > 1 ? 's' : ''} / {nodeCount} node{nodeCount > 1 ? 's' : ''} <Icon class='material-icons'>check_circle</Icon>
				{:else}
					Used by 0 networks <Icon class='material-icons'>lens</Icon>
				{/if}
			{:else}
				No credentials <Icon class='material-icons'>cancel</Icon>
			{/if}
		</div>

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
					{#if _id}
						{#if networkCount <= 0}
							<Item
								on:click={() => {
									dialog.warning({
										title: "Confirm deletion",
										subtitle: `Removing this key will no longer allow you to create or reprovision a network on ${name}.`,
										confirmButton: 'Delete Credentials',
										onConfirm: () => Credentials.query(deleteProvider, {_id: _id}).then(() => toast.success(`Key removed`)),
										cancelButton: 'Take me back!',
										confirmWord: 'DELETE'
									})
								}}
								>
								<Graphic class="material-icons">delete</Graphic>
								<Text>Remove Credentials</Text>
							</Item>
						{:else}
							<Item>
								<Graphic class="material-icons">not_interested</Graphic>
								<Text>In Use: No Actions</Text>
							</Item>
						{/if}
					{:else}
						<Item
							on:click={() => {
								let modal
								switch (provider) {
									case 'AWS': modal = AddAWS; break;
									case 'GCP': modal = AddGCP; break;
									case 'DO': modal = AddDO; break;
									default: break;
								}

								OpenModal(modal, {
									onSuccess: () => {
										CloseModal()
										window.location.reload()
									},
									onCancel: () => CloseModal()
								})
							}}
							>
							<Graphic class="material-icons">add</Graphic>
							<Text>Add Credentials</Text>
						</Item>
					{/if}

				</List>
			</Menu>
		</div>
	</div>
</Paper>
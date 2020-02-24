<script>
	import { onMount, onDestroy } from 'svelte';
	import Paper, { Title, Content} from '@smui/paper';
	import { Icon } from '@smui/common';
	import Button, { Label } from '@smui/button';
	import { toast } from '@components/Toaster.svelte'
	import { open as OpenModal, close as CloseModal} from '@components/Modal.svelte'
	import Key, { deleteKey } from './store'
	import KeyAdd from './Add.svelte'
	
	export let _id
	export let provider
	export let name
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
				&.key{
					margin-left: -0.1em;
					width: 0.5em;
					overflow: hidden;
					direction: rtl;
				}
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
			opacity: 0.9;

			.title{
				:global(.material-icons){
					color: var(--color-status-error);
					opacity: 0.6;
				}
			}
		}

	}
</style>

<Paper class='key-teaser' data-active={!!_id} elevation={_id ? 4 : 0}>
	<div class='title'>
		<Icon class='material-icons'>{!!_id ? 'check_circle' : 'cancel'}</Icon>
		<Icon class='material-icons key'>vpn_key</Icon>
		<Title>{provider}</Title>
		<Content>{name}</Content>
	</div>
	<div class='controls'>
		<div class={`mdc-typography--caption`}>
			{#if _id}
				<Button 
					on:click={() => {
						Key.query(deleteKey, {_id: _id}).then(() => {
							toast.success(`Key removed`)
						})
					}}
					>
					<Label>Delete Key</Label>
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
					<Label>Add Key</Label>
					<Icon class='material-icons'>add</Icon>
				</Button>
			{/if}
		</div>
	</div>
</Paper>
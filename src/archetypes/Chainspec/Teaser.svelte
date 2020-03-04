<script>
	import Paper, { Title } from '@smui/paper';
	import { open as OpenDrawer } from '@components/Drawer.svelte';
	import { Icon } from '@smui/common';
	import Menu from '@smui/menu';
	import List, {Item, Text, Separator, Graphic} from '@smui/list';
	import IconButton, { Icon as IconButtonIcon } from '@smui/icon-button';
	import Chainspec, { deleteOne } from './store.js'
	import { toast } from '@components/Toaster.svelte'

	import ChainspecDetail from '@archetypes/Chainspec/Detail.svelte'

	export let _id
	export let name

	let menu;
	let menuAnchor;
</script>

<style lang="scss">
	:global(.chainspec-teaser.smui-paper){
		background-color: var(--color-dark-grey);
		color: var(--color-light);
		display: flex;
		justify-content: space-between;
		align-items: center;
		cursor: pointer;
		transition: all 0.2s ease-in-out;
		margin-bottom: 0.6em;
		padding: 14px 16px;

		* :global(.smui-paper__title){
			margin: 0;
			display: flex;
			align-items: center;
		}

		* :global(.badge){
			display: inline-flex;
			margin-left: 1em;

			:global(.value){
				color: var(--color-dark)
			}

			:global(.label){
				text-transform: uppercase;
				color: var(--color-grey)
			}
		}

		.controls{
			display: flex;
			align-items: center;
		}

		&:hover{
			background-color: var(--color-dark);
			box-shadow: none
		}
	}
</style>

<Paper class='chainspec-teaser' on:click={() => OpenDrawer(ChainspecDetail, {_id: _id})} elevation="4">
	<div>
		<Title><Icon class="material-icons">code</Icon>&nbsp;{name}</Title>
	</div>
	<div class='controls'>
		<div 
			class='menu' 
			bind:this={menuAnchor} 
			on:click={e => {
				e.preventDefault()
				e.stopPropagation()
			}}
			>
			<IconButton on:click={() => menu.setOpen(true)}>
				<IconButtonIcon class="material-icons">menu</IconButtonIcon>
			</IconButton>
			<Menu 
				bind:this={menu} 
				bind:anchorElement={menuAnchor} 
				anchorCorner="BOTTOM_LEFT"
				>
				<List dense>
					<Item 
						on:click={e => {
							e.preventDefault()
							e.stopPropagation()
							Chainspec.query(deleteOne, {_id: _id}).then(() => toast.success(`Chainspec deleted`))
						}}
						>
						<Graphic class="material-icons">delete</Graphic>
						<Text>Delete</Text>
					</Item>
				</List>
			</Menu>
		</div>
	</div>
</Paper>
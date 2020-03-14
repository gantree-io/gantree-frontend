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
	export let networkCount = 0

	let menu;
	let menuAnchor;
</script>

<style lang="scss">
	.chainspec-teaser{
		.controls{
			.status{
				display: flex;
				align-items: center;

				&[data-used="true"]{ color: var(--color-status-success) }
				&[data-used="false"]{ color: var(--color-white); opacity: 0.7; }

				:global(.material-icons){
					font-size: 1.2em;
					margin-left: 0.3em
				}
			}
		}
	}
</style>

<Paper class='chainspec-teaser' on:click={() => OpenDrawer(ChainspecDetail, {_id: _id})} elevation="0">
	<div>
		<Icon class="material-icons">code</Icon>
		<Title>{name}</Title>
	</div>
	
	<div class='controls'>
		
		<div class={`mdc-typography--caption status`} data-used={networkCount > 0}>
			{#if networkCount > 0}
				Used by {networkCount} network{networkCount > 1 ? 's' : ''}<Icon class='material-icons'>check_circle</Icon>
			{:else}
				Used by 0 networks <Icon class='material-icons'>lens</Icon>
			{/if}
		</div>

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
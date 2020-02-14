<script>
	import IconButton, { Icon as IconButtonIcon } from '@smui/icon-button';
	import Menu from '@smui/menu';
	import { Anchor } from '@smui/menu-surface';
	import List, {Item, Text, Graphic} from '@smui/list';
	import { panel } from '@app/store.js';

	let open = false
	let component = null
	let props = {}
	let header = []
	let menu;
	let menuAnchor;
	const transitionSpeed = 0.4

	// handle panel close
	const handleClose = (cb => {
		document.removeEventListener("keydown", handleKeyDown);
		open = false
		setTimeout(() => {
			component = null
			props = {}
			header = []
			typeof cb === "function" && cb()
		}, transitionSpeed * 1000)
	})
	
	// handle panel open
	const handleOpen = (data => {
		component = data.component
		props = data.props
		header = data.header
		open = true
		document.addEventListener("keydown", handleKeyDown);
	})
	
	// watch for ESC key press & close
	const handleKeyDown = e => e.keyCode === 27 && handleClose()

	// subscribe to incoming requests
	panel.subscribe(data => {
		if(component !== data.component){
			// already open
			if(open){
				// new component? close and reopen
				if(!!data.component){
					handleClose(() => handleOpen(data))
				}
				// close
				else{
					handleClose()
				}
			}else{
				handleOpen(data)
			}

		}
	});
</script>

<style lang="scss">
	.panel{
		position: fixed;
		top: 0;
		right: 0;
		overflow: hidden;
		width: 0;
		height: 100vh;

		>.overlay{
			position: absolute;
			top: 0;
			right: 0;
			width: 100%;
			height: 100%;
			transition: background 0.4s;
			background: rgba(0,0,0,0);
			cursor: e-resize;
		}

		>.inner{
			position: fixed;
			top: 0;
			right: 0;
			background: var(--color-light);
			overflow: hidden;
			width: 0;
			height: 100vh;
			padding:0;
			opacity: 0.5;
			transition: all 0.35s ease-out;
			box-shadow: 0 0 2em rgba(0,0,0,0.8);
			overflow: scroll;

			>header{
				border-bottom: 1px solid var(--color-light-grey);
				position: relative;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.left{
					padding: 1em 1em 1em 2em;
					display: flex;
					align-items: baseline;
					
					h1,p{
						margin: 0;
						display: inline-block;
					}

					p{
						font-weight: 100;
						opacity: 0.8;
						margin: 0 0.5em;
					}
				}

				.right{
					padding: 0;
					display: flex;
					align-items: center;
					justify-content: flex-end;
					align-self: stretch;

					.menu{
						margin-right: 1em;
						:global(.mdc-icon-button){
							opacity: 0.4;
							&:hover{
								opacity: 1;
							}
						}
					}

					.close{
						align-self: stretch;
						//height: 66px;
						//width: 66px;
						

						:global(.mdc-icon-button){
							height: 66px;
							width: 66px;
							padding: 0;
							background: var(--color-dark-grey);
						color: var(--color-light);
						}
					}

					:global(.close){

					}
				}
			}

			>article{
				padding: 1.5em 2em;
			}

		}

		&[data-open='true']{
			width: 100vw;

			>.overlay{
				background: rgba(0,0,0,0.8);
				backdrop-filter: blur(0.1em);
			}

			>.inner{
				width: 85vw;
				opacity: 1;
			}
		}
	}
</style>

<section class='panel' data-open={open}>
	<div class="overlay" on:click={handleClose} style={`transition: background ${transitionSpeed}s ease-in-out`}/>
	<div class='inner' style={`transition: all ${transitionSpeed*0.75}s ease-out`}>
		<header class="dashboard-header">
			<span class="left">
				{#if header.title}<h1 class="mdc-typography--headline5">{header.title}</h1>{:else}---{/if}
				{#if header.subtitle}<p class="mdc-typography--body2">// {header.subtitle}</p>{:else}---{/if}
			</span>	

			<span class="right">
				{#if header.actions}
					<div class='menu' use:Anchor bind:this={menuAnchor}>
						<IconButton on:click={() => menu.setOpen(true)}>
							<IconButtonIcon class="material-icons">menu</IconButtonIcon>
						</IconButton>
						<Menu bind:this={menu} anchor={false} bind:anchorElement={menuAnchor} anchorCorner="BOTTOM_LEFT">
							<List dense>
								{#each header.actions||[] as action}
									<Item on:click={() => action.callback()}>
										<Graphic class="material-icons">{action.icon}</Graphic>
										<Text>{action.text}</Text>
									</Item>
								{/each}
							</List>
						</Menu>
					</div>
				{/if}

				<span class="close">
					<IconButton 
						on:click={handleClose} 
						>
						<IconButtonIcon class="material-icons">close</IconButtonIcon>
					</IconButton>
				</span>

			</span>
		</header>
		
		<article>
			{#if component}<svelte:component this={component} {...props}/>{/if}
		</article>
	</div>
</section>
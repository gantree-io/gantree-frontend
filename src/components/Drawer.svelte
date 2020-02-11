<script>
	import IconButton, { Icon as IconButtonIcon } from '@smui/icon-button';
	import Menu from '@smui/menu';
	import { Anchor } from '@smui/menu-surface';
	import List, {Item, Text, Graphic} from '@smui/list';
	import { drawer } from '@app/store.js';

	let open = false
	let component = null
	let props = {}
	let header = []
	let menu;
	let menuAnchor;
	const transitionSpeed = 0.4

	// handle drawer close
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
	
	// handle drawer open
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
	drawer.subscribe(data => {
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
	.drawer{
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

<section class='drawer' data-open={open}>
	<div class="overlay" on:click={handleClose} style={`transition: background ${transitionSpeed}s ease-in-out`}/>
	<div class='inner' style={`transition: all ${transitionSpeed*0.75}s ease-out`}>
		<svelte:component this={component} {...props}/>
	</div>
</section>
<script>
	import IconButton, { Icon as IconButtonIcon } from '@smui/icon-button';
	import Menu from '@smui/menu';
	import { Anchor } from '@smui/menu-surface';
	import List, {Item, Text, Graphic} from '@smui/list';
	import { Icon } from '@smui/common';
	import { modal } from '@app/store.js';


	let open = false
	let status = 'CLOSED'
	let component = null
	let props = {}
	let header = []
	let menu;
	let menuAnchor;
	const transitionSpeed = 0.4

	// handle modal close
	const handleClose = (cb => {
		document.removeEventListener("keydown", handleKeyDown);
		open = false
		status = 'CLOSING'
		setTimeout(() => {
			component = null
			props = {}
			header = []
			typeof cb === "function" && cb()
			status = 'CLOSED'
		}, transitionSpeed * 1000)
	})
	
	// handle modal open
	const handleOpen = (data => {
		component = data.component
		props = data.props
		header = data.header
		open = true
		status = 'OPEN'
		document.addEventListener("keydown", handleKeyDown);
	})
	
	// watch for ESC key press & close
	const handleKeyDown = e => e.keyCode === 27 && handleClose()

	// subscribe to incoming requests
	modal.subscribe(data => {
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
	.modal{
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		pointer-events: all;

		>.overlay{
			position: absolute;
			top: 0;
			left: 0;
			background: rgba(0,0,0,0.85);
			width: 100vw;
			height: 100vh;
			transition: background 0.4s;
			z-index: 1;
			backdrop-filter: blur(0.1em);
		}

		>.inner{
			position: absolute;
			top: 40vh;
			left: 50vw;
			transform: translate(-50%, -50%);
			background: var(--color-light);
			width: 90vw;
			height: auto;
			max-width: 40rem;
			max-height: 30rem;
			padding: 0;
			opacity: 1;
			transition: all 0.15s ease-out;
			display:flex;
			flex-direction: column;
			z-index: 2;

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
				}
			}

			>article{
				padding: 1.5em 2em;
			}

			:global(.close){
				position: absolute;
				bottom: calc(100% - 0.2em);
				left: calc(100% - 0.2em);
				color: var(--color-grey);
				font-size: 2em;
				padding: 0.2em;
				cursor: alias;
				z-index: 1;
				transition: transform 0.1s;
			}

		}
		&[data-status="CLOSING"],
		&[data-status="CLOSED"]{
			pointer-events: none;

			>.overlay{
				background: rgba(0,0,0,0);
				width: 0;
				height: 0;
			}

			>.inner{
				opacity: 0;
				top: calc(40vh - 2em);;
			}
		}

		&[data-status="CLOSED"]{
			width: 0;
			height: 0;
		}
	}
</style>

<section class='modal' data-open={open} data-status={status}>
	<div class="overlay" style={`transition: background ${transitionSpeed}s ease-in-out`}/>
	<div class='inner' style={`transition: all ${transitionSpeed*0.75}s ease-out`}>
		<Icon class="material-icons close" on:click={handleClose}>close</Icon>
		<svelte:component this={component} {...props}/>
	</div>
</section>
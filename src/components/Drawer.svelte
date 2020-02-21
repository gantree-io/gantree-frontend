<script context="module">
	import { writable } from 'svelte/store';
	import md5 from 'md5'

	const { set, subscribe } = writable(null);

	export const open = (component, props) => set({
		component: component, 
		props: props||{}, 
	})
	export const close = () => set(null)
</script>

<script>
	import IconButton, { Icon as IconButtonIcon } from '@smui/icon-button';
	import { Icon } from '@smui/common';

	let isOpen = false
	let component = null
	let props = {}
	const transitionSpeed = 0.4

	// handle drawer close
	const handleClose = (cb => {
		document.removeEventListener("keydown", handleKeyDown);
		isOpen = false
		setTimeout(() => {
			component = null
			props = {}
			typeof cb === "function" && cb()
		}, transitionSpeed * 1000)
	})
	
	// handle drawer open
	const handleOpen = (data => {
		component = data.component
		props = data.props
		isOpen = true
		document.addEventListener("keydown", handleKeyDown);
	})
	
	// watch for ESC key press & close
	const handleKeyDown = e => e.keyCode === 27 && handleClose()

	

	//subscribe to incoming requests
	subscribe(data => {

		// no data = close drawer
		if(!data){
			handleClose()
		}

		//
		else if(component !== data.component){
			// already open
			if(isOpen){
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
			z-index: 1
		}

		>.inner{
			position: absolute;
			top: 0;
			right: 0;
			background: var(--color-light);
			width: 0;
			height: 100vh;
			padding:0;
			opacity: 0.5;
			transition: all 0.35s ease-out;
			display:flex;
			flex-direction: column;
			z-index: 2;
		
			:global(.close){
				position: absolute;
				top: 0.8rem;
				right: calc(100% - 2em);
				color: var(--color-grey);
				font-size: 1.5em;
				padding: 0.4em 0.1em 0.3em 0.3em;
				background: var(--color-light);
				border-radius: 0.1em 0em 0em 0.1em;
				cursor: e-resize;
				z-index: -1;
				transition: all 0.1s;

				&:hover{
					transform: translateX(0.1em);
					opacity: 0.9;
				}
			}

		}

		&[data-open='true']{
			>.overlay{
				background: rgba(0,0,0,0.8);
				backdrop-filter: blur(0.1em);
				width: 100vw;
			}

			>.inner{
				width: 85vw;
				opacity: 1;

				:global(.close){
					right: 100%;
				}
			}
		}
	}
</style>

<section class='drawer' data-open={isOpen}>
	<div class="overlay" on:click={handleClose} style={`transition: background ${transitionSpeed}s ease-in-out`}/>
	<div class='inner' style={`transition: all ${transitionSpeed*0.75}s ease-out`}>
		<Icon class="material-icons close" on:click={handleClose}>close</Icon>
		<svelte:component this={component} {...props}/>
	</div>
</section>
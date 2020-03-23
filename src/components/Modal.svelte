<script context="module">
	import { writable } from 'svelte/store';
	// import md5 from 'md5'

	const { set, subscribe } = writable(null);

	export const open = (component, props) => set({
		component: component,
		props: props||{},
	})
	export const close = () => set(null)
</script>

<script>
	import { Icon } from '@smui/common';

	let isOpen = false
	let status = 'CLOSED'
	let component = null
	let props = {}
	const transitionSpeed = 0.4

	// handle modal close
	const handleClose = (cb => {
		document.removeEventListener("keydown", handleKeyDown);
		isOpen = false
		status = 'CLOSING'
		setTimeout(() => {
			component = null
			props = {}
			typeof cb === "function" && cb()
			status = 'CLOSED'
		}, transitionSpeed * 1000)
	})

	// handle modal open
	const handleOpen = (data => {
		component = data.component
		props = data.props
		isOpen = true
		status = 'OPEN'
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
			background: rgba(0,0,0,0.9);
			width: 100vw;
			height: 100vh;
			transition: background 0.2s;
			z-index: 1;
			/*backdrop-filter: blur(0.1em);*/
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
			padding: 0;
			opacity: 1;
			transition: all 0.15s ease-out;
			display:flex;
			flex-direction: column;
			z-index: 2;

			:global(.close){
				position: absolute;
				bottom: calc(100% - 0.2em);
				left: calc(100% - 0.2em);
				color: var(--color-theme-white);
				font-size: 2em;
				padding: 0.2em;
				cursor: alias;
				z-index: 1;
				transition: transform 0.1s;
			}

			:global(.layout-panel > .body){
				height: auto;
				overflow: hidden;
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
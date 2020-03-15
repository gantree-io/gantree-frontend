<script>
	import { fade } from 'svelte/transition';
	import Button, { Label, Icon } from '@smui/button';
	import NodeCanvas from '@components/NodeCanvas.svelte'

	export let icon = null
	export let title = null
	export let subtitle = null
	export let copy = null
	export let maxWidth = '40rem'
</script>

<style lang="scss">
	.layout.-centered{
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		color: white;


		background-image: linear-gradient(
			var(--color-theme-xdark) 0%, 
			var(--color-theme-dark) 25%, 
			var(--color-theme-light) 100%
		);

		> :global(.node-canvas){
			position: absolute;
			top: 0;
			left: 0;
			width: 100vw;
			height: 100vh;
			z-index: 0;
		}

		> :global(.mdc-button.back){
			position: absolute;
			top: 0.5em;
			left: 50%;
			transform: translateX(-50%);
			z-index: 1;

			:global(.mdc-button__icon){
				margin: 0;

				& + :global(.mdc-button__label){
					margin-left: 0.5em
				}
			}
		}

		> :global(.gantree){
			position: absolute;
			top: 0;
			right: 0;
			filter: invert(1);
			mix-blend-mode: screen;
			opacity: 0.15;
			width: 40vw;
			height: auto;
			//z-index: 1;
		}

		.content{
			text-align: center;
			margin: calc(-5vw - 5vh) auto 0;
			max-width: 40rem;
			width: 100%;
			//z-index: 1;

			:global(.material-icons.title-icon){
				font-size: 3em;
				margin: 0.1em 0
			}

			>h1{
				display: block;
				margin: 0.2em 0;
			}

			>h2{
				display: block;
				margin: 0.3em 0;
				font-weight: 300;
			}

			>p{
				display: block;
				margin: 1.2em 0;
			}

			.children{
				margin-top: 3em
			}
		}

		:global(*[slot="header"]),
		:global(*[slot="footer"]){
			position: absolute;
			left: 0;
			width: 100%;
			padding: 1em;
			justify-content: center;
			display: flex;
		}
		
		:global(*[slot="header"]){ top: 0 }
		:global(*[slot="footer"]){ bottom: 0 }
	}
</style>

<main class={`layout -centered ${$$props.class||''}`}>
	<NodeCanvas/>
	<slot name='header'/>
	<div class="content" style={`max-width: ${maxWidth}`} transition:fade="{{delay: 0, duration: 150}}">
		{#if icon}<Icon class="material-icons title-icon">{icon}</Icon>{/if}
		{#if title}<h1 class='mdc-typography--headline3'>{title}</h1>{/if}
		{#if subtitle}<h2 class='mdc-typography--headline5'>{subtitle}</h2>{/if}
		{#if copy}<p class="mdc-typography--body1">{copy}</p>{/if}
		<div class="children"><slot/></div>
	</div>
	<slot name='footer'/>
</main>
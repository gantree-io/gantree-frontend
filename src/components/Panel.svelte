<script>
	import { Icon } from '@smui/common';
	import IconButton, { Icon as IconButtonIcon } from '@smui/icon-button';
	//import Button, { Icon as ButtonIcon, Label } from '@smui/button';
	import { panel } from '@app/store.js';

	let open = false
	let component = null
	let props = {}

	panel.subscribe(data => {
		//todo | handle new panel open
		// 1. hash data as ID
		// 2. check new data if is same hash
		// 3. if not, close panel, insert new data and re-open,
		// 4. if same, do nothing

		if(data.component){
			component = data.component
			props = data.props
			open = true
		}else{
			component = null
			props = data.props
			open = false
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
		transition: background 0.4s;
		background: rgba(0,0,0,0);

		>article{
			position: fixed;
			top: 0;
			right: 0;
			background: var(--color-light);
			overflow: hidden;
			width: 0;
			//min-width: 0;
			height: 100vh;
			padding: 5vh 0;
			opacity: 0.5;
			transition: all 0.35s ease-out;
			box-shadow: 0 0 2em rgba(0,0,0,0.8);

			:global(.close){
				position: absolute;
				top: 0.2em;
				right: 0.2em;
			}
		}

		&[data-open='true']{
			background: rgba(0,0,0,0.8);
			width: 100vw;

			>article{
				width: 70vw;
				//min-width: 30vw;
				padding: 5vh 4vw;
				opacity: 1;
			}
		}
	}
</style>

<section class='panel' data-open={open}>
	<article>
		{#if component}<svelte:component this={component} {...props}/>{/if}
		<IconButton 
			on:click={panel.close} 
			class='close'
			>
			<IconButtonIcon class="material-icons">close</IconButtonIcon>
		</IconButton>
	</article>
</section>
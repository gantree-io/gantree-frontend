<script>
	import { Icon } from '@smui/common';
	import IconButton, { Icon as IconButtonIcon } from '@smui/icon-button';
	import { panel } from '@app/store.js';

	let open = false
	let component = null
	let props = {}
	let header = []

	const handleKeyDown = e => e.keyCode === 27 ? panel.close() : null

	panel.subscribe(data => {
		//todo | handle new panel open
		// 1. hash data as ID
		// 2. check new data if is same hash
		// 3. if not, close panel, insert new data and re-open,
		// 4. if same, do nothing

		component = data.component
		props = data.props
		header = data.header

		open = !!data.component ? true : false

		if (open) {
			document.addEventListener("keydown", handleKeyDown);
		}else{
			document.removeEventListener("keydown", handleKeyDown);
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


			>header,
			>article{
				padding: 1.5em 2em;
			}

			>header{
				border-bottom: 1px solid var(--color-light-grey);
				position: relative;

				h1,p{
					margin: 0;
					display: inline-block;
				}

				p{
					font-weight: 100;
					opacity: 0.8
				}

				:global(.close){
					position: absolute;
					top: 50%;
					right: 1em;
					transform: translateY(-50%)
				}

			}
		}

		&[data-open='true']{
			width: 100vw;

			>.overlay{
				background: rgba(0,0,0,0.8);
			}

			>.inner{
				width: 85vw;
				opacity: 1;
			}
		}
	}
</style>

<section class='panel' data-open={open}>
	<div class="overlay" on:click={panel.close}/>
	<div class='inner'>
		<header class="dashboard-header">
			{#if header.title}<h1 class="mdc-typography--headline5">{header.title}</h1>{:else}---{/if}
			{#if header.subtitle}<p class="mdc-typography--overline">&nbsp;// {header.subtitle}</p>{:else}---{/if}

			<!-- <span class="extra">
				{#each active.actions||[] as action}
					<Button variant='text' dense>
						<Icon class="material-icons">{action.icon}</Icon> 
						{action.text}
					</Button>
				{/each}
			</span> -->

			<IconButton 
				on:click={panel.close} 
				class='close'
				>
				<IconButtonIcon class="material-icons">close</IconButtonIcon>
			</IconButton>
		</header>
		
		<article>
			{#if component}<svelte:component this={component} {...props}/>{/if}
		</article>
	</div>
</section>
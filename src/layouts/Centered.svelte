<script>
	import { push } from 'svelte-spa-router'
	//import IconButton, { Icon } from '@smui/icon-button';
	import Button, { Label, Icon } from '@smui/button';

	export let icon
	export let title
	export let subtitle
	export let copy
	export let back = {
		text: null,
		icon: 'home',
		action: () => push('/')
	}
</script>

<style lang="scss">
	main{
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100vh;

		:global(.mdc-button.back){
			position: absolute;
			top: 0.5em;
			left: 50%;
			transform: translateX(-50%);

			:global(.mdc-button__icon){
				margin: 0;

				& + :global(.mdc-button__label){
					margin-left: 0.5em
				}
			}
		}
	}

	.content{
		text-align: center;
		margin: calc(-5vw - 10vh) auto 0;
		max-width: 40rem;
		width: 100%;

		:global(.material-icons.title-icon){
			font-size: 3em;
			margin: 0.1em 0
		}

		>h1{
			margin: 0.2em 0;
		}

		>h2{
			margin: 0.3em 0;
		}

		>p{
			margin: 1.4em 0;
		}
	}
</style>

<main class='layout -centered'>
	{#if back}
		<Button class='back' on:click={back.action}>
			{#if back.icon}<Icon class="material-icons">{back.icon}</Icon>{/if}
			{#if back.text}<Label>{back.text}</Label>{/if}
		</Button>
		<!-- <IconButton class={'back'} on:click={back.action}>
			<Icon class="material-icons">{back.icon}</Icon>
		</IconButton> -->
	{/if}
	<div class="content">
		{#if icon}<Icon class="material-icons title-icon">{icon}</Icon>{/if}
		{#if title}<h1 class='mdc-typography--headline3'>{title}</h1>{/if}
		{#if subtitle}<h2 class='mdc-typography--headline5'>{subtitle}</h2>{/if}
		{#if copy}<p class="mdc-typography--body1">{copy}</p>{/if}
		<slot></slot>
	</div>
</main>
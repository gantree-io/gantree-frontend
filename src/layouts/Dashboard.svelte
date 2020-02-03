<script>
	import { location } from 'svelte-spa-router'

	import Header from '@components/Header.svelte'
	import Icon from "@components/Icon.svelte";
	import Link from "@components/Link.svelte";
	
	export let tabs = []
</script>

<style lang="scss">
	main{
		min-height: 100vh;
		display: flex;
	}

	nav{
		width: 15vw;
		background: var(--color-dark);
		color: var(--color-light);
		position: relative;

		.logo,
		.account{
			display: block;
			padding: 1.4em 1.4em;
			color: var(--color-light);
			background: rgba(255,255,255,0.1);
		}

		.account{
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
		}

		:global(.link){
			display: block;
			position: relative;
			padding: 1.2em 1.4em;
			color: var(--color-light);
			font-size: var(--font-size-small);
			font-weight: 100;
			background: rgba(255,255,255,0);
			transition: background 0.15s ease-in-out;
			text-decoration: none;
			display: flex;
			align-items: center;
			line-height: 1em;
			
			&:hover{
				background: rgba(255,255,255,0.1);

				:global(.icon.chevron-right){
					right: 0.4em;
				}
			}

			:global(.icon:not(.chevron-right)){
				margin-right: 0.5em;
			}

			:global(.icon.chevron-right){
				position: absolute;
				right: 0.6em;
				top: 50%;
				transform: translateY(-50%);
				width: 0.7em;
				height: 0.7em;
				opacity: 0.7;
				transition: right 0.15s ease-in-out;
			}
		}

		hr{
			border-top: none;
			border-bottom-color: var(--color-dark-grey);
			margin: 0;
		}
	}

	.content{
		width: 85vw;
		

		>header,
		.inner{
			padding: 1.4em;
		}

		>header{
			background: rgba(0,0,0,0.1);
		}

	}
</style>

<main>
	<nav>
		<span class="logo">[logo]</span>
		{#each tabs as tab}
			<hr/>
			<Link to={tab.href}><Icon type={tab.icon}/>{tab.text} <Icon type='chevronRight'/></Link>
		{/each}
		<span class="account"><Icon type='clock'/> [account]</span>
	</nav>
	<section class='content'>
		<header>{$location}</header>
		<div class="inner">
			<slot></slot>
		</div>
	</section>
</main>
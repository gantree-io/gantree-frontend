<script>
	import LoginButtons from '@archetypes/Account/LoginButtons.svelte';
	import Centered from '@layouts/Centered.svelte'
	import GantreeLogo from '@assets/GantreeLogo.svelte'
</script>

<style lang="scss">
	.gantree-logo{
		margin: 0;
		line-height: 1em;
		font-family: 'Monda', sans-serif;
		text-transform: uppercase;
		font-size: 4.7em;
		color: var(--color-light-purple);
		text-shadow: -2px 2px 0 var(--color-purple);
	}

	:global(.layout.-centered) :global(.children) > :global(.gantree-logo){
		font-size: 4.7em;
	}

	h2{
		margin: 0.3em auto 0;
		line-height: 1.1em;
		font-weight: 100;
		max-width: 23rem;
		color: var(--color-light-grey);
	}

	p.-content{
		margin: 4em auto;
		line-height: 1.3em;
		font-weight: 100;
		position: relative;
		color: var(--color-light-grey);

		&:before,
		&:after{
			content: '';
			position: absolute;
			left: 50%;
			width: 50%;
			transform: translateX(-50%);
			border-bottom: 1px solid rgba(255,255,255,0.2)
		}

		&:before{ top: -1.5em }
		&:after{ bottom: -1.5em }
	}

	p.-login{

	}

	:global(.user-login-buttons){
		margin-top: 3rem;
	}

	:global(.mdc-typography--caption.-credit){
		position: absolute;
		bottom: 1em;
		left: 50%;
		transform: translateX(-50%);

	}
</style>

<Centered>
	<GantreeLogo/>
	<h2 class="mdc-typography--headline6">A full service node infrastructure toolkit for Substrate-based chains</h2>
	<p class="mdc-typography--body1 -content">
		Deploying and maintaining  blockchains is difficult. We firmly believe that you shouldn't need to be a DevOps professional in order to develop blockchains Gantree can lighten the load on developers, allowing you to focus on building while we do the heavy lifting of managing your infrastructure.
	</p>
	<LoginButtons 
		providers={['Google', 'Twitter']} 
		email={{
			signin: 'LOG IN',
			signup: 'CREATE ACCOUNT'
		}}
	/>
	<span class="mdc-typography--caption -credit">Powered By FLEX / Web 3 Foundation / Polkadot | @2020 Flexdapps, All Rights Reserved | Privacy & Cookies</span>
</Centered>
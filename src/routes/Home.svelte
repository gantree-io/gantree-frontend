<script>
	import FirebaseLogin from '@components/FirebaseLogin.svelte';
	import Centered from '@layouts/Centered.svelte'
</script>

<style lang="scss">
	h1{
		margin-top: 0;
		font-size: var(--font-size-xxlarge);
	}
</style>

<Centered>
	<h1>Gantree</h1>
	<h2>Deploy and manage your Substrate-based infrastructure</h2>
	<FirebaseLogin/>

	
	<a href="#/dashboard">Dashboard</a>
</Centered>
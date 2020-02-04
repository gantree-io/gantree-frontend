<script>
	import Icon from "@components/Icon.svelte";

	//export let type;
	//https://api.whatdoestrumpthink.com/api/v1/quotes/random
	//https://api.kanye.rest/
	
	// let quote = new Promise((resolve, reject) => {
	// 	fetch('https://api.whatdoestrumpthink.com/api/v1/quotes/random')
	// 		.then(response => response.json())
	// 		.then(({message}) => resolve(message))
	// })

	let quote = 'Private jets cost a lot of money.'
</script>

<style lang="scss">
	.quote{
		padding: 1.2em;
		display: block;
		opacity: 0.5;
		font-size: var(--font-size-xsmall);
	}

	q{
		display: block;
	}

	.cite{
		display: block;
		font-size: 0.9em;
		padding: 0.5em;
		opacity: 0.98;
	}

	:global(.icon.trump){
		font-size: 1.5rem;
	}
</style>

<span class='quote'>
	{#await quote}
		<Icon type='spinner'/>
	{:then value}
		<Icon type='trump'/>
		<q>{value}</q>
		<span class="cite"> - Donald Trump</span>
	{/await}
</span>
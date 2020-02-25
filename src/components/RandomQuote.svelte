<script>
	import { Icon } from '@smui/common';

	//export let type;
	//https://api.whatdoestrumpthink.com/api/v1/quotes/random
	//https://api.kanye.rest/
	
	// let quote = new Promise((resolve, reject) => {
	// 	fetch('https://api.whatdoestrumpthink.com/api/v1/quotes/random')
	// 		.then(response => response.json())
	// 		.then(({message}) => resolve(message))
	// })

	let quote = `I love the poorly educated.`
</script>

<style lang="scss">
	.quote{
		display: block;
	}

	q{
		display: block;
		line-height: 1.5em;
	}

	.cite{
		display: block;
		font-size: 0.9em;
		padding: 0.5em;
		opacity: 0.7;
		line-height: 1em;
	}

	:global(.material-icons.-quote),
	:global(.material-icons.-loading){
		font-size: 1.5rem;
	}

	:global(.material-icons.-quote){
		display: block;
	}
</style>

<span class='quote'>
	{#await quote}
		<Icon class="material-icons -loading -animation-spin">autorenew</Icon>
	{:then value}
		<Icon class="material-icons -quote">format_quote</Icon>
		<q>{value}</q>
		<span class="cite"> - Donald Trump</span>
	{/await}
</span>
<script>
	import { Icon } from '@smui/common';

	export let endpoint = 'https://api.whatdoestrumpthink.com/api/v1/quotes/random'

	let quote = _env.MODE === 'production'
		? new Promise((resolve, reject) => {
			fetch(endpoint)
				.then(response => response.json())
				.then(({message}) => resolve(message))
		})
		: `I love the poorly educated.`

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
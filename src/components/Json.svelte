<script>
	export let data = null
	export let highlight = false
	export let darktheme;

	const parse = json => {
		json = typeof json === 'string'
			? JSON.stringify(JSON.parse(json), null, 2)
			: JSON.stringify(json, null, 2)

		return !highlight 
			? json
			: json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
				.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
					var cls = 'number';
					if (/^"/.test(match)) {
						if (/:$/.test(match)) {
							cls = 'key';
						} else {
							cls = 'string';
						}
					} else if (/true|false/.test(match)) {
						cls = 'boolean';
					} else if (/null/.test(match)) {
						cls = 'null';
					}
					return '<span class="' + cls + '">' + match + '</span>';
				});
	}
</script>

<style lang="scss">
	code{
		padding: 1em;
		display: block;
		border: 1px solid var(--color-light-grey);
		:global(.string){ color: rgb(54,186, 34); }
		:global(.number) { color: rgb(174,129,255); }
		:global(.boolean) { color: blue; }
		:global(.null) { color: rgb(174,129,255); }
		:global(.key) { color: rgb(152,192,221); }

		pre{
			margin: 0;
			font-weight: 100;
		}
		
		/* light theme */
		background: white;
		color: var(--color-dark-grey);
		
		/* dark theme */
		&[data-dark-theme='true']{
			background: var(--color-dark);
			color: var(--color-light-grey);
		}

	}
</style>

<code data-dark-theme={!!darktheme}>

	<pre>
		{@html parse(data)}
	</pre>
</code>
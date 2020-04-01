<script>
	import moment from 'moment'
	export let anchor = moment()
	let current = moment()

	$: anchor

	setInterval(() => {
		current = moment()
	}, 1000)
</script>

<span class={`elapsed ${$$props.class||''}`}>
	{current.diff(anchor, "seconds") + 1} seconds ago
</span>
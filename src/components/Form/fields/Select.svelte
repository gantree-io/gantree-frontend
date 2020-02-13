<script>
	export let options
	export let value
</script>

<style lang="scss">
</style>

<select type="file" bind:value={value} {...$$props}>
	{#each Object.keys(options) as key}
		<option value={key}>{options[key]}</option>
	{/each}
</select>
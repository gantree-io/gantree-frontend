<script>
	import _ from 'lodash'

	export let file
	let files

	$: {
	 	if(files){
	 		file = files[0]
	 	}
	 }
</script>

<style lang="scss">
</style>

<input type="file" bind:files={files} {...$$props}/>
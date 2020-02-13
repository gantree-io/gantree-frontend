<script>
	import _ from 'lodash'

	export let value
	let files
	let filename

	$: {
	 	if(files){
	 		const reader = new FileReader();
 		    reader.onloadend = () => {
 		    	value = reader.result.toString()
 		    };
 		    reader.readAsText(files[0]);
	 	}
	 }
</script>

<style lang="scss">
</style>

<input bind:files={files} {...$$props} type="file" value={filename}/>
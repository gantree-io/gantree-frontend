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
	input{
		padding: 0.8em 1em;
		border: 1px solid rgba(0,0,0,0.1);
		background: white;
		outline: none;
		font-weight: inherit
	}
</style>

<input bind:files={files} {...$$props} value={filename} type="file" />
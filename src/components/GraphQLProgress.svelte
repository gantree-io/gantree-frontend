<!-- TODO: tie this into a graphQL progress observer  -->

<script>
	import {onMount, onDestroy} from 'svelte';
	import LinearProgress from '@smui/linear-progress';

	export let duration = 3000
	export let interval = 50
	let elapsed = 0
	
	let progress = 0
	let buffer = 0.8
	let timer;
	
	let init = () => {
		progress = 0;
		timer = setInterval(() =>{
			if(elapsed >= duration) {
				clearInterval(timer)
				progress = 1
				buffer = 0
			}else{
				elapsed += interval
				progress = progress + ((1 - progress) * 0.15)
				buffer = progress + ((1 - progress) * 0.25)
			}
		}, interval)
	}

	onMount(init);
	onDestroy(() => clearInterval(timer))
</script>

<style lang="scss">
	
</style>

<LinearProgress progress={progress} buffer={buffer} />
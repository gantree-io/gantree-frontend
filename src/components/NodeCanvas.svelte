<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let id = Math.floor(Math.random() * 100000000000)
	let wWidth = window.innerWidth
	let wHeight = window.innerHeight
	let blocksize = 5
	let gap = 2
	let dissipation = 0.06 //percent
	let randomGapsProbability = 0.02
	let xCount = Math.ceil(window.innerWidth / (blocksize + gap))
	let fillStyle = 'rgba(255, 255, 255, 0.15)';
	let pixX = 0
	let pixY = 0
	let pixSize = 5
	let animationTick = 0

	const buildNodes = ctx => {
		let currentsize = blocksize
		let currentRow = 0

		const buildRow = (y, size) => {
			for (var i = 0; i < xCount; i++) {
				if(Math.random() > randomGapsProbability * ((blocksize - currentsize) * 11)){
					ctx.beginPath();
					ctx.fillStyle = fillStyle;
					ctx.fillRect(i * (blocksize + gap), y - blocksize, size, size);
				}
			}
		}

		// create nodes
		while (currentsize > 0.05) {
			let y = wHeight - (currentRow * (blocksize + gap))
			currentsize = blocksize - (currentRow * dissipation)
			buildRow(y, currentsize)
			currentRow ++
		}
	}

	const randomPix = () => {
		pixX = (Math.floor((Math.random() * xCount)) * (blocksize + gap))
		let pixYRow = Math.floor(Math.random() * (50 - 1 + 1)) + 1
		pixY = pixYRow * (blocksize + gap) - gap
		pixSize = blocksize - (pixYRow * dissipation)
		animationTick = animationTick === 1 ? 2 : 1
	}


	onMount(() => {
		const canvas = document.querySelector(`canvas[data-id='${id}']`)
		buildNodes(canvas.getContext("2d"))

		let interval = setInterval(randomPix, 1500)
		return () => clearInterval(interval)
	})
</script>

<style lang="scss">
	@keyframes tick1 {
  		0% {opacity: 1}
  		15% {opacity: 0}
  		30% {opacity: 1}
  		45% {opacity: 0}
  		60% {opacity: 1}
  		100% {opacity: 0}
  	}

  	@keyframes tick2 {
  		0% {opacity: 1}
  		15% {opacity: 0}
  		30% {opacity: 1}
  		45% {opacity: 0}
  		60% {opacity: 1}
  		100% {opacity: 0}
  	}

	.node-canvas{
		background-repeat: repeat-x;
		background-position: 0 100%;
	}

	i{
		position: absolute;
		background: var(--color-status-success);
		animation-duration: 800ms;
		animation-timing-function: linear;
		animation-fill-mode: forwards;

		&[data-tick="1"]{ animation-name: tick1 }

		&[data-tick="2"]{ animation-name: tick2 }
	}
</style>

<span class="node-canvas" transition:fade="{{delay: 0, duration: 150}}">
	<i style={`top: ${wHeight - pixY}px; left: ${pixX}px; width: ${pixSize}px; height: ${pixSize}px;`} data-tick={animationTick}/>
	<canvas data-id={id} width={wWidth} height={wHeight}/>
</span>
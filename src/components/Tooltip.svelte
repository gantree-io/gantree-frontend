<script>
	export let text
</script>

<style lang="scss">
	.tooltip{
		position: relative;
		display: inline-block;
		font-size: inherit;
		
		> :global(:not(.tip)){
			cursor: pointer;
			display: block;
			font-size: inherit;
		}

		.tip{
			background: rgba(0,0,0,0.8);
			padding: 0.5em 1em;
			color: white;
			font-size: 12px;
			width: 150px;
			display: block;
			position: absolute;
			top: 50%;
			left: calc(100% + 5px);
			transform: translateY(-50%);
			z-index: 1000;
			
			&:after{
				content: '';
				position: absolute;
				top: 50%;
				right: 100%;
				transform: translateY(-50%);
				width: 0; 
				height: 0; 
				border-top: 0.5em solid transparent;
				border-bottom: 0.5em solid transparent; 
				border-right:0.5em solid rgba(0,0,0,0.8); 
			}
		}

		&:not(:hover){
			.tip{
				display: none
			}
		}
	}
</style>

{#if text}
	<span class='tooltip'>
		<span class="tip">{text}</span>
		<slot></slot>
	</span>
{/if}
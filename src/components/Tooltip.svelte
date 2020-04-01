<script>
	export let text
	export let position = 'right'
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
			transform: translateY(-50%);
			z-index: 1000;
			
			&:after{
				content: '';
				position: absolute;
				width: 0; 
				height: 0; 
			}
		}

		&:not(:hover){
			.tip{
				display: none
			}
		}

		/*todo add more*/
		&[data-position='right']{
			.tip{
				top: 50%;
				left: calc(100% + 5px);
				transform: translateY(-50%);

				&:after{
					top: 50%;
					right: 100%;
					border-top: 0.5em solid transparent;
					border-bottom: 0.5em solid transparent; 
					border-right:0.5em solid rgba(0,0,0,0.8);
					transform: translateY(-50%);
				}
			}
		}

		&[data-position='top']{
			.tip{
				bottom: calc(100% + 5px);
				left: 50%;
				transform: translateX(-50%);
				text-align: center;

				&:after{
					top: 100%;
					right: 50%;
					border-right: 0.5em solid transparent;
					border-left: 0.5em solid transparent;
					border-top: 0.5em solid rgba(0,0,0,0.8);
				}
			}
		}


	}
</style>

{#if text}
	<span class='tooltip' data-position={position}>
		<span class="tip">{text}</span>
		<slot></slot>
	</span>
{/if}
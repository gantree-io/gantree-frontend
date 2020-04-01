<script>
	import _ from 'lodash'
	import { Icon } from '@smui/common';
	import { toast } from '@components/Toaster.svelte'

	export let onChange = () => {}
	export let value = []

	$: {
		onChange(value)
	}

	let addOpen = false
	let inputValue

	const handleAdd = () => {
		if(!inputValue){
			toast.warning(`Field cannot be empty`)
		}else{
			
			// append 2 dashes
			if(inputValue.substring(0, 2) !== '--'){
				inputValue = `--${inputValue}`
			}

			value.push(inputValue)
			value = value
			toggleAdd()
		}
	}

	const toggleAdd = () => {
		addOpen = !addOpen
		if(!addOpen){
			inputValue = null
		}
	}

	const handleRemove = i => {
		value.splice(i,1)
		value = value
	}
</script>

<style lang="scss">
	.pills{
		background: white;
		display: flex !important;
		align-items: center;
		justify-content: flex-start;
		flex-wrap: wrap;

		.add,
		.item{
			display: flex;
			align-items: center;
			position: relative;
			margin: 0 0.2em 0.2em 0;
			line-height: 0em;
			font-size: var(--font-size-small);

			:global(.material-icons){
				font-size: inherit;
				cursor: pointer;
			}
		}

		.item{
			background: var(--color-theme-light, #777);
			color: var(--color-theme-white, #fff);
			padding: 0.6em 1em;

			:global(.material-icons){
				width: 0;
				overflow: hidden;
				transition: all 0.1s;
			}

			&:hover{
				:global(.material-icons){
					width: 1em;
					margin-left: 0.4em;
				}
			}
		}

		.add{
			transition: all 0.15s;
			
			:global(.material-icons){
				padding: 0.6em;
				background: var(--color-theme-light, #777);
				color: var(--color-theme-white, #fff);
				opacity: 0.5;
				
				&:hover{
					opacity: 0.8;
				}
			}

			&.-fields{
				input{
					padding: 0.44em 0.6em;
					max-width: 7rem;
					margin: 0;
					font-size: var(--font-size-small);

					&.key{
						text-align: right
					}
				}

				:global(.material-icons){
					margin-left: 0.2em;
				}

				:global(.material-icons.-clear){
					background: none;
					color: var(--color-theme-grey, #777);
				}
			}
		}
	}
</style>

<div class='pills'>
	{#each value as item, i}
		<span class='item'>
			<span>{item}</span>
			<Icon class="material-icons" on:click={() => handleRemove(i)}>clear</Icon>
		</span>
	{/each}

	{#if addOpen}
		<span class='add -fields'>
			<input type="text" class='key' data-lpignore="true" bind:value={inputValue} placeholder='key'>
			<Icon class="material-icons -add" on:click={() => handleAdd()}>check</Icon>
			<Icon class="material-icons -clear" on:click={() => toggleAdd()}>clear</Icon>
		</span>
	{:else}
		<span class='add'>
			<Icon class="material-icons" on:click={() => toggleAdd()}>add</Icon>
		</span>
	{/if}
</div>

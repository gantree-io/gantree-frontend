<script>
	import _ from 'lodash'
	import Paper, { Title } from '@smui/paper';
	import { Icon } from '@smui/common';
	import { panel } from '@app/store.js';

	import ConfigDetail, { actions } from '@archetypes/Config/Detail.svelte'

	export let _id = null
	export let name = null

	const handleClick = () => {
		 panel.open(ConfigDetail, 
		 	{
		 		configId: _id
		 	}, 
		 	{
		 		title: `${name}`,
		 		subtitle: `chainspec.json`,
		 		actions: actions
		 	}
		 )
	}
</script>

<style lang="scss">
	:global(.config-teaser.smui-paper){
		background-color: var(--color-dark-grey);
		color: var(--color-light);
		display: flex;
		justify-content: space-between;
		align-items: center;
		cursor: pointer;
		transition: all 0.2s ease-in-out;
		margin-bottom: 0.6em;

		* :global(.smui-paper__title){
			margin: 0;
			display: flex;
			align-items: center;
		}

		* :global(.badge){
			display: inline-flex;
			margin-left: 1em;

			:global(.value){
				color: var(--color-dark)
			}

			:global(.label){
				text-transform: uppercase;
				color: var(--color-grey)
			}
		}

		.controls{
			display: flex;
			align-items: center;
		}

		&:hover{
			background-color: var(--color-dark);
			box-shadow: none
		}
	}
</style>

<Paper class='config-teaser' on:click={handleClick} elevation="4">
	<div>
		<Title><Icon class="material-icons">code</Icon>&nbsp;{name}</Title>
	</div>
	<div class='controls'>
		[controls]
	</div>
</Paper>
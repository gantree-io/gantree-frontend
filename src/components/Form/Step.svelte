<script>
	import { onMount, onDestroy, getContext } from 'svelte';
	import md5 from 'md5'
	import PubSub from 'pubsub-js'
	import { FIELDS } from './Wrapper.svelte';
	import ButtonGroup from './buttons/ButtonGroup.svelte';
	
	export let title;
	export let buttons
	

	let id = md5(JSON.stringify($$props) + Math.floor(Math.random() * Math.floor(1000000000)))
	let visible = false
	
	const { registerStep, stepForward, stepBack } = getContext(FIELDS);

	registerStep(id, title)

	onMount(() => {
		PubSub.subscribe('FORM.STEP', (msg, step) => {
			visible = step === id
		});
	})

	onDestroy(() => {
		PubSub.unsubscribe('FORM.STEP');
	})
</script>

<style lang="scss">
	.form-step{
		display: block;
		&[data-visible='false']{
			height: 0;
			overflow: hidden;
			display: none;
		}
	}
</style>

<div class='form-step' data-visible={visible}>
	<slot></slot>
	<ButtonGroup 
		{...buttons}
		onBackClick={stepBack}
		onNextClick={stepForward}
	/>
</div>
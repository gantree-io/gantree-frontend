<script>
	import { onMount, createEventDispatcher } from 'svelte';
	import md5 from 'md5'
	import { Icon } from '@smui/common';

	export let text

	$: _origText = text
	
	const dispatch = createEventDispatcher();
	let _origText
	let loading = false
	let el
	let contenteditable = false
	let id = md5(Math.floor(Math.random() * 100000000000))

	const setLoading = isLoading => loading = isLoading

	const setEditable = isEditable => {
		contenteditable = true
		setTimeout(() => {
			el.focus()
		}, 0);
	}

	const update = () => {
		contenteditable = false

		if(el.textContent !== _origText){
			text = el.textContent
			dispatch('change', {
				text: el.textContent,
				setLoading: setLoading
			})
		}
	}

	const cancel = () => {
		contenteditable = false
		text = _origText
		el.textContent = text
	}

	onMount(() => el = document.getElementById(id))
</script>
	
<style lang="scss">
	.editable-text{
		display: inline-flex;
		align-items: center;

		>:global(.material-icons){
			font-size: 1.6em;
			cursor: pointer;

			&:first-of-type{
				margin-left: 0.4em
			}

			&.-update{ color: var(--color-status-success, green) }
			&.-cancel{ color: var(--color-status-error, red) }
			&.-loading{ color: var(--color-light-grey, grey) }
		}

		.editable-text-field{
			cursor: pointer;

			&:hover{
				background: rgba(white, 0.3);
				padding: 0.2em 0.5em;
				margin: -0.2em -0.5em;
				
				/*&:before{
					content: '';
					position: absolute;
					top: ;
				}*/
			}
			

			&[contenteditable="true"]{
				cursor: text;
				background: white;
				padding: 0.2em 0.5em;
				margin: -0.2em -0.2em;
			}
		}
	}
</style>

<span class={'editable-text'} on:blur={cancel}>
	<span id={id} class={'editable-text-field'} on:click={setEditable} contenteditable={contenteditable}>
		{text}
	</span>
	{#if !!contenteditable}
		<Icon class="material-icons -update" on:click={update}>check_circle</Icon>
		<Icon class="material-icons -cancel" on:click={cancel}>cancel</Icon>
	{/if}
	{#if loading}
		<Icon class="material-icons -loading">autorenew</Icon>
	{/if}
</span>


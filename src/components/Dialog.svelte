<script context="module">
	import { writable } from 'svelte/store';
	// import md5 from 'md5'

	const { subscribe, set } = writable(null);
	const types = {
		SUCCESS: 'SUCCESS',
		WARNING: 'WARNING',
		ERROR: 'ERROR',
		NOTIFICATION: 'NOTIFICATION',
		NEUTRAL: 'NEUTRAL',
	}

	const _close = () => {
		set(null)
	}

	const _open = (type, props) => {
		set({...props, type: type})
	}

	const _dialog = props => _open(types.NEUTRAL, props)
	_dialog.success = props => _open(types.SUCCESS, props)
	_dialog.warning = props => _open(types.WARNING, props)
	_dialog.error = props => _open(types.ERROR, props)
	_dialog.notification = props => _open(types.NOTIFICATION, props)
	_dialog.neutral = props => _open(types.NEUTRAL, props)

	export const dialog = _dialog
</script>

<script>
	import { Icon } from '@smui/common';
	import _ from 'lodash'
	import Button, { Label } from '@smui/button';

 	let item = null
 	let status = 'CLOSED'
 	let confirmWord = ''
 	let confirmWordValue = ''
 	let disabled = false
	const transitionSpeed = 0.2

 	const isValid = (a, b) => {
 		if(!a){
 			return true
 		}else if(a.toLowerCase() !== b.toLowerCase()){
			return true
 		}else{
 			return false
 		}
 	}

 	$: {
 		disabled = isValid(confirmWord, confirmWordValue)
 	}

 	const handleConfirm = () => {
		if(!disabled){
			_.get(item, 'onConfirm', ()=>{})()
			setTimeout(() => _close(), 200)
		}
 	}

 	subscribe(_item => {
 		if(_item){
			item = _item
			confirmWord = _.get(_item, 'confirmWord', '')
			disabled = confirmWord ? true : false
			status = 'OPEN'
 		}else{
 			status = 'CLOSING'
 			setTimeout(() => {
 				item = null
 				status = 'CLOSED'
 				confirmWord = ''
 				confirmWordValue = ''
 				disabled = false
 			}, transitionSpeed * 1000)
 		}
 	});
</script>

<style lang="scss">
	.dialog{
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		pointer-events: all;

		>.overlay{
			position: absolute;
			top: 0;
			left: 0;
			background: rgba(0,0,0,0.9);
			width: 100vw;
			height: 100vh;
			transition: background 0.2s;
			z-index: 1;
			/*backdrop-filter: blur(0.1em);*/
		}

		>.inner{
			position: absolute;
			top: 40vh;
			left: 50vw;
			transform: translate(-50%, -50%) scale(1);
			background: var(--color-light);
			width: 90vw;
			height: auto;
			max-width: 32rem;
			padding: 0;
			opacity: 1;
			transition: all 0.15s ease-out;
			display:flex;
			flex-direction: column;
			z-index: 2;
			box-shadow: 0 0 2em black;

			header,
			article,
			footer{
				padding: 1em 1.5em;
				>*{
					margin: 0
				}
			}

			header{
				>*{
					margin: 0
				}

				h1{
					display: flex;
					align-items: center;
					margin-bottom: 0.3em;
					:global(.material-icons){
						font-size: 1.3em;
						margin-right: 0.2em
					}
				}
			}

			article{
				border-top: 1px solid var(--color-light-grey);
				border-bottom: 1px solid var(--color-light-grey);

				input{
					display: block;
					width: 100%;
					padding: 0.7em 0.9em;
					border: 1px solid rgba(0,0,0,0.1);
					background: white;
					outline: none;
					font-weight: inherit;
					margin: 0.3em 0 0 0;

					&:focus{
						border-bottom: 1px solid var(--color-theme-highlight);
					}

					&::placeholder{
						color: rgba(0,0,0,0.2);
						font-weight: 100;
					}
				}
			}

			footer{
				display: flex;
				align-items: center;
				justify-content: space-between;

				& > :global(.cancel){
					cursor: pointer;
					color: var(--color-theme-dark);
				}

				& > :global(.confirm){
					cursor: pointer;
					color: var(--color-theme-white);
				}
			}

			&[data-type='SUCCESS']{
				header h1{ color: var(--color-status-success) }
				footer > :global(.confirm:not([disabled])){ background-color: var(--color-status-success) }
			}
			&[data-type='WARNING']{
				header h1{ color: var(--color-status-warning) }
				footer > :global(.confirm:not([disabled])){ background-color: var(--color-status-warning) }
			}
			&[data-type='ERROR']{
				header h1{ color: var(--color-status-error) }
				footer > :global(.confirm:not([disabled])){ background-color: var(--color-status-error) }
			}
			&[data-type='NOTIFICATION']{
				header h1{ color: var(--color-status-notification) }
				footer > :global(.confirm:not([disabled])){ background-color: var(--color-status-notification) }
			}
			&[data-type='NEUTRAL']{
				header h1{ color: var(--color-status-neutral) }
				footer > :global(.confirm:not([disabled])){ background-color: var(--color-status-neutral); color: var(--color-dark) }
			}
		}

		&[data-status="CLOSING"],
		&[data-status="CLOSED"]{
			pointer-events: none;

			>.overlay{
				background: rgba(0,0,0,0);
				width: 0;
				height: 0;
			}

			>.inner{
				opacity: 0;
				top: calc(40vh - 2em);
				transform: translate(-50%, -50%) scale(0.9);
			}
		}

		&[data-status="CLOSED"]{
			width: 0;
			height: 0;
		}
	}
</style>

<section class='dialog' data-status={status}>
	<div class="overlay" style={`transition: background ${transitionSpeed}s ease-in-out`} on:click={_close}/>
	<div class='inner' style={`transition: all ${transitionSpeed*0.75}s ease-out`} data-type={_.get(item, 'type')}>
		{#if item}
			<header>
				<h1 class="mdc-typography--headline6">
					{#if item.type === 'SUCCESS'}<Icon class="material-icons">check_circle</Icon>{/if}
					{#if item.type === 'WARNING'}<Icon class="material-icons">error</Icon>{/if}
					{#if item.type === 'ERROR'}<Icon class="material-icons">cancel</Icon>{/if}
					{#if item.type === 'NOTIFICATION'}<Icon class="material-icons">notifications</Icon>{/if}
					<span class="text">{item.title.toUpperCase()}</span>
				</h1>
				<h2 class="mdc-typography--body1">{item.subtitle}</h2>
			</header>
			{#if confirmWord}
				<article>
					<p class="mdc-typography--body2">Please type <strong>{confirmWord}</strong> below to continue</p>
					<input type="text" bind:value={confirmWordValue} placeholder={`// ${confirmWord}`}>
				</article>
			{/if}
			<footer>
				<Button class={'cancel'} color="secondary" on:click={_close} dense>
					<Label>{item.cancelButton||'Cancel'}</Label>
				</Button>

				<Button class={'confirm'} on:click={handleConfirm} variant="unelevated" disabled={disabled}>
					<Label>{item.confirmButton||'Confirm'}</Label>
				</Button>
			</footer>
		{/if}
	</div>
</section>
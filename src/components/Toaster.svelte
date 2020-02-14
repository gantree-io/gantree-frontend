<script context="module">
	import { writable } from 'svelte/store';
	import md5 from 'md5'

	const items = []
	const { subscribe, set } = writable(items);
	const Type = {
		SUCCESS: 'SUCCESS',
		WARNING: 'WARNING',
		ERROR: 'ERROR',
		NOTIFICATION: 'NOTIFICATION',
		NEUTRAL: 'NEUTRAL',
	}

	const _remove = id => {
		delete items[id]
		set(items)
	}

	const _add = (type, text, duration=5000) => {
		let id = md5(text)
		
		items[id] = {
			text: text,
			state: 'HIDE',
			type: type
		}

		set(items)
		
		// set to in
		setTimeout(() => {
			items[id].state = 'SHOW'
			set(items)
			setTimeout(() => {
				items[id].state = 'HIDE'
				set(items)
				setTimeout(() => _remove(id), 200)
			}, duration)
		}, 10)
	}

	const _toast = (text, duration) => _add(Type.NEUTRAL, text, duration)
	_toast.success = (text, duration) => _add(Type.SUCCESS, text, duration)
	_toast.warning = (text, duration) => _add(Type.WARNING, text, duration)
	_toast.error = (text, duration) => _add(Type.ERROR, text, duration)
	_toast.notification = (text, duration) => _add(Type.NOTIFICATION, text, duration)
	_toast.neutral = (text, duration) => _add(Type.NEUTRAL, text, duration)

	export const toast = _toast

</script>


<script>
	import { fly } from 'svelte/transition';
	import { bounceInOut } from 'svelte/easing';
	import { Icon } from '@smui/common';

 	let items = {}
 	subscribe(data => {
 		items = data
 	});
</script>

<style lang="scss">
	.toaster{
		position: fixed;
		top: 1em;
		right: 1em;

		.slice{
			position: relative;
			display: flex;
			align-items: center;
			margin-bottom: 0.3em;
			background: var(--color-dark);
			color: var(--color-light);
			padding: 0.7em 1.3em;
			border-radius: 0.2em;
			width: 12rem;
			overflow: hidden;
			max-height: 10rem;
			opacity: 1;
			box-shadow: 0 0 0.3em rgba(0, 0, 0, 0.2);

			:global(.material-icons){
				padding-right: 0.4em;
				font-size: 1em;
			}
			
			&[data-state='HIDE']{
				max-height: 0;
				opacity: 0;
				padding: 0 1.3em;
				transition: all 0.2s;
			}

			&[data-type='SUCCESS']{ background: var(--color-status-success) }
			&[data-type='WARNING']{ background: var(--color-status-warning) }
			&[data-type='ERROR']{ background: var(--color-status-error) }
			&[data-type='NOTIFICATION']{ background: var(--color-status-notification) }
			&[data-type='NEUTRAL']{ background: var(--color-status-neutral); color: var(--color-dark) }
		}


	}
</style>

<span class='toaster'>
	{#each Object.values(items) as item}
		<span class="slice" data-state={item.state} data-type={item.type}>
			{#if item.type === 'SUCCESS'}<Icon class="material-icons">check_circle</Icon>{/if}
			{#if item.type === 'WARNING'}<Icon class="material-icons">error</Icon>{/if}
			{#if item.type === 'ERROR'}<Icon class="material-icons">cancel</Icon>{/if}
			{#if item.type === 'NOTIFICATION'}<Icon class="material-icons">notifications</Icon>{/if}
			{item.text}
		</span>
	{/each}
</span>
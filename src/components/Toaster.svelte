<script context="module">
	import { writable } from 'svelte/store';
	import md5 from 'md5'

	const items = {}
	const { subscribe, set } = writable(items);
	const types = {
		SUCCESS: 'SUCCESS',
		WARNING: 'WARNING',
		ERROR: 'ERROR',
		NOTIFICATION: 'NOTIFICATION',
		NEUTRAL: 'NEUTRAL',
		LOADING: 'LOADING',
	}

	const _remove = id => {
		delete items[id]
		set(items)
	}

	const _update = (id, type, text, duration=5000) => {
		if(items[id]){
			clearTimeout(items[id].closetimeout)
			items[id].type = type
			items[id].text = text
			items[id].closetimeout = setTimeout(() => {
				items[id].state = 'HIDE'
				set(items)
				setTimeout(() => _remove(id), 200)
			}, duration)
			set(items)
		}
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
			items[id].closetimeout = setTimeout(() => {
				items[id].state = 'HIDE'
				set(items)
				setTimeout(() => _remove(id), 200)
			}, duration)
			set(items)
		}, 10)

		return {
			success: (text, duration) => _update(id, types.SUCCESS, text, duration||2000),
			warning: (text, duration) => _update(id, types.WARNING, text, duration||2000),
			error: (text, duration) => _update(id, types.ERROR, text, duration||2000),
			notification: (text, duration) => _update(id, types.NOTIFICATION, text, duration||2000),
			neutral: (text, duration) => _update(id, types.NEUTRAL, text, duration||2000),
			loading: (text, duration) => _update(id, types.LOADING, text, duration||2000),
		}
	}

	const _toast = (text, duration) => _add(types.NEUTRAL, text, duration)
	_toast.success = (text, duration) => _add(types.SUCCESS, text, duration)
	_toast.warning = (text, duration) => _add(types.WARNING, text, duration)
	_toast.error = (text, duration) => _add(types.ERROR, text, duration)
	_toast.notification = (text, duration) => _add(types.NOTIFICATION, text, duration)
	_toast.neutral = (text, duration) => _add(types.NEUTRAL, text, duration)
	_toast.loading = (text, duration) => _add(types.LOADING, text, duration||10000)

	export const toast = _toast
</script>

<script>
	import { onDestroy } from 'svelte';
	import { fly } from 'svelte/transition';
	import { bounceInOut } from 'svelte/easing';
	import { Icon } from '@smui/common';

 	let _items = {}
 	subscribe(data => {
 		_items = data
 	});

 	onDestroy(() => {
 		console.log(111, 222, _items)
 	})
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
				font-size: 1em;
			}

			.text{
				padding-left: 0.5em;
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
			&[data-type='LOADING']{ 
				background: var(--color-status-notification);
				:global(.material-icons){
					animation-name: spin;
					animation-duration: 4000ms;
					animation-iteration-count: infinite;
					animation-timing-function: linear;
				}
			}
		}


	}
</style>

<span class='toaster'>
	{#each Object.values(_items) as item}
		<span class="slice" data-state={item.state} data-type={item.type}>
			{#if item.type === 'SUCCESS'}<Icon class="material-icons">check_circle</Icon>{/if}
			{#if item.type === 'WARNING'}<Icon class="material-icons">error</Icon>{/if}
			{#if item.type === 'ERROR'}<Icon class="material-icons">cancel</Icon>{/if}
			{#if item.type === 'NOTIFICATION'}<Icon class="material-icons">notifications</Icon>{/if}
			{#if item.type === 'LOADING'}<Icon class="material-icons">cached</Icon>{/if}
			<span class="text">{item.text}</span>
		</span>
	{/each}
</span>
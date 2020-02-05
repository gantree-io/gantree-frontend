import { writable } from 'svelte/store';

const Panel = () => {
	const { subscribe, set, update } = writable({
		component: null,
		props: {}
	});

	return {
		subscribe,
		open: (component, props) => update(() => ({component: component, props: props||{}})),
		close: () => update((val) => ({component: null, props: {}})),
	};
}

export const panel = Panel();
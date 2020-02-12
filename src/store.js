import { writable } from 'svelte/store';

const Panel = () => {

	const initialProps = {
		component: null,
		props: {},
		header: {
			title: null,
			subtitle: null,
			actions: []
		}
	}
	
	const { subscribe, set, update } = writable(initialProps);

	return {
		subscribe,
		open: (component, props, header) => update(() => ({
			component: component, 
			props: props||{}, 
			header: header||[]
		})),
		close: () => update((val) => initialProps),
	};
}

const Drawer = () => {
	const initialProps = {
		component: null,
		props: {},
		header: {
			title: null,
			subtitle: null,
			actions: []
		}
	}
	
	const { subscribe, set, update } = writable(initialProps);

	return {
		subscribe,
		open: (component, props, header) => update(() => ({
			component: component, 
			props: props||{}, 
			header: header||[]
		})),
		close: () => update((val) => initialProps),
	};
}

const Modal = () => {
	const initialProps = {
		component: null,
		props: {},
		header: {
			title: null,
			subtitle: null,
			actions: []
		}
	}
	
	const { subscribe, set, update } = writable(initialProps);

	return {
		subscribe,
		open: (component, props, header) => update(() => ({
			component: component, 
			props: props||{}, 
			header: header||[]
		})),
		close: () => update((val) => initialProps),
	};
}


export const panel = Panel();
export const drawer = Drawer();
export const modal = Modal();
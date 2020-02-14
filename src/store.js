import { writable } from 'svelte/store';

// const _Panel = () => {
// 
// 	const initialProps = {
// 		component: null,
// 		props: {},
// 		header: {
// 			title: null,
// 			subtitle: null,
// 			actions: []
// 		}
// 	}
// 	
// 	const { subscribe, update } = writable(initialProps);
// 
// 	return {
// 		subscribe,
// 		open: (component, props, header) => update(() => ({
// 			component: component, 
// 			props: props||{}, 
// 			header: header||[]
// 		})),
// 		close: () => update((val) => initialProps),
// 	};
// }

const _Drawer = () => {
	const initialProps = {
		component: null,
		props: {},
		header: {
			title: null,
			subtitle: null,
			actions: []
		}
	}
	
	const { subscribe, update } = writable(initialProps);

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

const _Modal = () => {
	const initialProps = {
		component: null,
		props: {},
		header: {
			title: null,
			subtitle: null,
			actions: []
		}
	}
	
	const { subscribe, update } = writable(initialProps);

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

const _Notification = () => {
	const { subscribe, set } = writable(null);

	return {
		subscribe,
		open: text => set(text),
		//close: () => set(null),
	};
}



//export const Panel = Panel();
export const Drawer = _Drawer();
export const Modal = _Modal();
export const Notification = _Notification();
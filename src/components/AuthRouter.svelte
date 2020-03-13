<script context="module">
	import { location as _location, push as _push, querystring as _querystring } from 'svelte-spa-router'

	let errorRoutes
	let onRoute
	let onPrivateRoute
	let onPublicRoute
	let onNotFoundRoute
	let onErrorRoute

	export const configure = props => {
		errorRoutes = props.errorRoutes || {}
		onRoute = props.onRoute || function(){} 
		onPrivateRoute = props.onPrivateRoute || function(){} 
		onPublicRoute = props.onPublicRoute || function(){} 
		onNotFoundRoute = props.onNotFoundRoute || function(){} 
		onErrorRoute = props.onErrorRoute || function(){} 
	}

	export const triggerError = (code, error) => {
		onErrorRoute(code)
		_push(`/error/${code}`)
	}

	export const location = _location
	export const push = _push
	export const querystring = _querystring
</script>

<script>
	import { onMount, afterUpdate } from 'svelte';
	import Router, { 
		location as __location, 
		push as __push , 
		pop as __pop , 
		replace as __replace 
	} from 'svelte-spa-router'

	export let routes = {}
	export let prefix = ''

	const buildRoutes = (_routes, parentPath='') => {
		let _builtRoutes = {}

		Object.keys(_routes).forEach(route => {
			// sub routes
			if(typeof _routes[route] === 'object'){
				let _subroutes = buildRoutes(_routes[route], route)
				_builtRoutes = {
					..._builtRoutes,
					..._subroutes
				}
			}
			// single route
			else{
				let aa = parentPath !== '' && route === '/'
					? ''
					: route

				_builtRoutes[`${prefix}${parentPath}${aa}`] = _routes[route]
			}
		})

		return _builtRoutes
	}
	
	let _publicRoutes = buildRoutes(routes.public||{})
	let _privateRoutes = buildRoutes(routes.private||{})
	let _errorRoutes = buildRoutes(errorRoutes||{}, '/error/')
	let _allroutes = Object.assign({}, _publicRoutes, _privateRoutes, _errorRoutes, {'*': errorRoutes[404] || '/'})

	afterUpdate(() => {
		
		let routerCallbacks = {
			location: $__location,
			push: __push, 
			pop: __pop, 
			replace: __replace
		}

		// fire on private routes
		if(Object.keys(_privateRoutes).includes($__location)){
			onPrivateRoute(routerCallbacks)
		}
		
		// fire on public routes
		if(Object.keys(_publicRoutes).includes($__location)){
			onPublicRoute(routerCallbacks)
		}
		
		// fire on all routes
		if(Object.keys(_allroutes).includes($__location)){
			onRoute(routerCallbacks)
		}
		// ---> else not found
		else{
			onNotFoundRoute(routerCallbacks)
		}
	});
</script>

<Router routes={_allroutes}/>
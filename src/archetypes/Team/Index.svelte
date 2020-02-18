<script>
	import { onMount, onDestroy } from 'svelte';
	import _ from 'lodash'
	import GraphQLProgress from '@components/GraphQLProgress.svelte'
	import PanelLayout from '@layouts/Panel.svelte'
	import { Modal } from '@app/store.js'
	//import NetworkAdd from './Add.svelte'
	import TeamStore from './store.js'
	import UserStore from '@archetypes/User/store.js'

	import UserTeaser from '@archetypes/User/Teaser.svelte'
	import UserAdd from '@archetypes/User/Add.svelte'
	
	// const query = `
 // 		query networks {
	// 		networks{
	// 			_id
	// 			name
	// 			nodes{
	// 				status
	// 			}
	// 		}
 // 		}
 // 	`
	

	// ugh! method
//  	let triggerRefetch;
//  	onMount(() => {
//  		PubSub.subscribe('TEAM.USER.DELETE', () => triggerRefetch());
//  		PubSub.subscribe('TEAM.USER.ADD', () => triggerRefetch());
//  	})
// 
//  	onDestroy(() => {
//  		PubSub.unsubscribe('TEAM.USER.DELETE');
//  		PubSub.unsubscribe('TEAM.USER.ADD');
//  	})

	// socket method
//  	let statusSubscription
//  	onMount(async () => {
// 		statusSubscription = await TeamStore.subscribe(_id, `UPDATE`, ({nodes}) => {
// 			onlineCount = nodes.online
// 			pendingCount = nodes.pending
// 			offlineCount = nodes.offline
// 		})
//  	})
// 
//  	onDestroy(() => {
//  		TeamStore.unsubscribe(statusSubscription)
//  	})

		let team
		let teamOwnerID
		let currentUserID

		onMount(() => {
			TeamStore.fetchAll().then(_team => {
				
				team = _team
				teamOwnerID = _.get(_team, 'owner._id')

				// {
				// 	active: _.filter(team.users, {status: 'ACTIVE'}),
				// 	pending: _.filter(team.users, {status: 'INVITATION_SENT'}),
				// 	inactive: _.filter(team.users, {status: 'INACTIVE'}),
				// }
			})

			UserStore.subscribe(({user}) => {
				currentUserID = user._id
			})
		})
</script>

<style>
	:global(h2){
		margin: 2em 0 1em 0;
	}

	:global(h2:first-child){
		margin-top: 0
	}
</style>

<PanelLayout 
	header={{
		title: 'Team',
		subtitle: _.get(team, 'name'),
		icon: 'people',
		actions: [
	 		{
				text: 'Invite Someone',
				icon: 'person_add',
				callback: () => {
					Modal.open(UserAdd, {
						team_id:  _.get(team, '_id'),
						onSuccess: () => Modal.close()
					})
				}
	 		}
	 	]
	}}
	showBreadcrumbs
	>
	{console.log(_.get(team, 'users'))}
	{#if !_.get(team, 'users')}
		<GraphQLProgress/>
	{:else}
		<p class="mdc-typography--body1">You can add and remove members of your team here. Please be aware that everyone in a team has full control over everything in your Paraplant environment, including other team members. Only invite those whom you fully trust.</p>
		
		{#each team.users as user}
			<UserTeaser {...user} isTeamOwner={teamOwnerID === user._id} bossPrivileges={teamOwnerID === currentUserID}/>
		{:else}
			...nothing 
		{/each}

		<!-- <h2 class='mdc-typography--headline6'>Pending Users</h2>
		{#each _users.pending as _user}
			<UserTeaser {..._user} fullPrivileges={_isTeamOwner}/>
		{:else}
			...nothing 
		{/each}

		<h2 class='mdc-typography--headline6'>Inactive Users</h2>
		{#each _users.inactive as _user}
			<UserTeaser {..._user} fullPrivileges={_isTeamOwner}/>
		{:else}
			...nothing 
		{/each} -->
	{/if}
</PanelLayout>
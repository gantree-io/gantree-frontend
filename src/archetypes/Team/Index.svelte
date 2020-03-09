<script>
	import { onMount } from 'svelte';
	import _ from 'lodash'
	import GraphQLProgress from '@components/GraphQLProgress.svelte'
	import PanelLayout from '@layouts/Panel.svelte'
	import { open as openModal, close as closeModal } from '@components/Modal.svelte'
	import Team, { fetchAll } from './store.js'
	import AppStore from '@app/store.js'
	import Hotwire from '@components/Hotwire.svelte'

	import UserTeaser from '@archetypes/User/Teaser.svelte'
	import UserAdd from '@archetypes/User/Add.svelte'
	
	let team
	let teamOwnerID
	let currentUserID

	// helper function to fetch all users
	// is called from multiple places
	const _fetchAll = () => {
		Team.query(fetchAll).then(_team => {
			team = _team
			teamOwnerID = _.get(_team, 'owner._id')
		})
	}

	onMount(async () => {
		_fetchAll()

		// get the curent user
		AppStore.subscribe(({user}) => currentUserID = user._id)
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

<Hotwire
	subscriptions={[
		{
			name: 'USER',
			event: `ADD`,
			callback: () => _fetchAll()
		},
		{
			name: 'USER',
			event: `DELETE`,
			callback: () => _fetchAll()
		},
		{
			name: 'TEAM',
			event: `UPDATE`,
			callback: () => _fetchAll()
		},
	]}
	>
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
						openModal(UserAdd, {
							team_id:  _.get(team, '_id'),
							onSuccess: () => closeModal()
						})
					}
		 		}
		 	]
		}}
		showBreadcrumbs
		>
		{#if !_.get(team, 'users')}
			<GraphQLProgress/>
		{:else}
			<p class="mdc-typography--body1">
				You can manage members of your team here. Please be aware that everyone in a team has full control over everything in your Paraplant environment. Only invite those whom you fully trust. 
			</p>
			{#each team.users as user}
				<UserTeaser {...user} isTeamOwner={teamOwnerID === user._id} bossPrivileges={teamOwnerID === currentUserID}/>
			{/each}
		{/if}
	</PanelLayout>
</Hotwire>
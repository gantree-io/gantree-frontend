<script>
	import PanelLayout from '@layouts/Panel.svelte'
	import Hotwire from '@components/Hotwire.svelte'
</script>

<style>
	:global(h2){
		margin: 2em 0 1em 0;
	}

	:global(h2:first-child){
		margin-top: 0
	}
</style>

<Hotwire>
	<PanelLayout 
		header={{
			title: 'Docs',
			icon: 'menu_book',
		}}
		showBreadcrumbs
		>
		[todo docs]
	</PanelLayout>
</Hotwire>
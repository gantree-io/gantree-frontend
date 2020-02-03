<style lang="scss">
	main{
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
	}

	div{
		text-align: center;
		margin: calc(-5vw - 10vh) 6vw 0;
	}
</style>

<main>
	<div class="content">
		<slot></slot>
	</div>
</main>
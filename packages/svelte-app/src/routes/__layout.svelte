<script>
	import '../app.scss';
	import Nav from '../components/Nav.svelte';
</script>

<header>
	<div class="spacer" />
	<Nav />
	<div class="spacer" />
</header>
<main>
	<slot />
</main>

<style lang="scss">
	header {
		width: 100%;
		padding-top: 0.75rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: $primary;
	}

	.spacer {
		flex-grow: 1;
	}
</style>

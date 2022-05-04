<script>
	import { getContext } from 'svelte';

	const links = [
		{
			label: 'Hem',
			path: '/'
		},
		{
			label: 'Produkter',
			path: '/allt'
		},
		{
			label: 'Om oss',
			path: '/omoss'
		}
	];
</script>

<nav>
	{#each links as link}
		<a href={link.path}>{link.label}</a>
	{/each}
	{#if !getContext('userId')}
		<a id="login" href="/loggain">Logga in</a>
	{/if}
</nav>

<style lang="scss">
	nav {
		height: 40px;
		width: 100%;
		max-width: map-get($grid-breakpoints, sm);
		background-color: white;
		border-radius: 2rem;
		display: flex;
		align-items: center;
		padding: 0 1.5rem;
		border: 2px solid $border-color;
	}

	a {
		color: black;
		text-decoration: none;
	}

	a + a {
		margin-left: 2rem;
	}

	#login {
		margin-left: auto;
		color: darken($secondary, 20);
	}
</style>

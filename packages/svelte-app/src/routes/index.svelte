<script lang="ts">
	import Hero from '../components/Hero.svelte';
	import DecorativeWaves from '../components/DecorativeWaves.svelte';
	import Listing from '../components/Listing.svelte';
	import { generateMockItemData } from '@wille430/common';
	import type { IListing } from '@wille430/common';

	const listings = generateMockItemData(20) as IListing[];
</script>

<Hero />
<DecorativeWaves />

<div class="grid">
	{#each listings as listing}
		<Listing {listing} />
	{/each}
</div>

<style lang="scss">
	.grid {
		display: flex;
		flex-wrap: wrap;
		grid-gap: 1rem;
	}
</style>

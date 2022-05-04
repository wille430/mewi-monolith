<script lang="ts">
	import type { IListing } from '@wille430/common';
	import FallbackImage from './FallbackImage.svelte';
	import OriginLabel from './OriginLabel.svelte';
	import { formatDistance } from 'date-fns';
	import { sv } from 'date-fns/locale';

	export let listing: IListing;
</script>

<article class="card">
	<div class="image-wrapper">
		<FallbackImage src={listing.imageUrl[0]} alt={listing.title} />
	</div>
	<div class="details">
		<div class="header">
			<span class="title">{listing.title}</span>

			<div class="d-flex flex-column text-end">
				<OriginLabel origin={listing.origin} />
				<span class="region">{listing.region}</span>
			</div>
		</div>
		<div class="bottom">
			<span class="price">{listing.price?.value} {listing.price?.currency}</span>
			<span class="timestamp">
				{formatDistance(new Date(listing.date), new Date(), {
					addSuffix: true,
					locale: sv
				}).replace('ungefär', 'ca.')}
			</span>
		</div>
	</div>
</article>

<style lang="scss">
	.card {
		width: 16rem;
		height: 16rem;
		display: flex;
		flex-direction: column;
		cursor: pointer;
	}

	.card :global(img) {
		object-fit: cover;
		width: 100%;
		height: 11rem;
	}

	.details {
		padding: 0.25rem;
		flex-grow: 1;
		display: flex;
		flex-direction: column;
	}

	.header {
		display: flex;
		font-size: small;
		overflow: hidden;
		flex: none;
		max-height: 5ch;
	}

	.title {
		font-size: small;
		flex-grow: 1;
		max-lines: 2;
		margin-right: 0.5rem;
	}

	.region {
		font-size: smaller;
		flex: none;
		min-width: 4rem;
		color: $gray-600;
	}

	.bottom {
		flex-grow: 1;
		width: 100%;
		font-size: small;
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
	}

	.timestamp {
		color: $gray-600;
	}
</style>

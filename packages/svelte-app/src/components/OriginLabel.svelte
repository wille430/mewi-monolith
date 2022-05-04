<script lang="ts">
	import type { ListingOrigins } from '@wille430/common';
	export let origin: ListingOrigins;

	const originColors: Record<ListingOrigins, string> = {
		Blocket: 'red',
		Blipp: 'green',
		Tradera: 'green',
		Sellpy: 'black'
	};
</script>

<span style="color: {originColors[origin]};">
	{origin}
</span>

<script lang="ts">
	import fallback from '../assets/missingImage.png';

	export let src: string;
	export let alt: string | undefined;

	const handleError = (e: any) => {
		e.target.src = fallback;
	};
</script>

<img {src} {alt} on:error={handleError} />

<style>
	img {
		width: 100%;
		height: auto;
	}
</style>

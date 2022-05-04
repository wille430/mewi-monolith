<script lang="ts">
	let query = '';
</script>

<div class="form-group d-flex flex-column">
	<form action="/sok" class="input-group">
		<input
			class="form-control"
			type="text"
			name="query"
			bind:value={query}
			placeholder="Vad letar du efter?"
		/>
		<input class="btn btn-secondary" type="submit" value="Sök" />
	</form>

	<a class="text-secondary small text-end mt-2" href="/filter">Advancerade filter >></a>
</div>

<style lang="scss">
	.input-group {
		width: 24rem;
		max-width: 100%;
	}
</style>

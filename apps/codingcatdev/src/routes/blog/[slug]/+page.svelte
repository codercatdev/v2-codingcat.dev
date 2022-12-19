<script>
	/** @type {import('./$types').PageData} */
	export let data;
</script>

{#if data.content}
	{@html data.content.content}
{:else}
	<p>No data found yet</p>
{/if}

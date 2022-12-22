<script>
	/** @type {import('$lib/types/index').Content | null} */
	export let content;
</script>

{#if content}
	<section class="prose">
		{@html content.content}
	</section>
{:else}
	<p>No data found yet</p>
{/if}

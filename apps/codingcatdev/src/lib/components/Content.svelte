<script>
	/** @type {import('$lib/types/index').Content | null} */
	export let content;
</script>

{#if content}
	<section class="prose lg:prose-xl xl:prose-2xl">
		{@html content.content}
	</section>
{:else}
	<p>No data found yet</p>
{/if}

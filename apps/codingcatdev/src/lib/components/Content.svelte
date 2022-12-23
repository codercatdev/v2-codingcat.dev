<script>
	/** @type {import('$lib/types/index').Content | null} */
	export let content;
	import 'prism-themes/themes/prism-shades-of-purple.min.css';
</script>

{#if content}
	<section class="prose lg:prose-xl xl:prose-2xl">
		{@html content.content}
	</section>
{:else}
	<p>No data found yet</p>
{/if}

<script>
	import Content from '$lib/components/Content.svelte';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<Content content={data.content} />

<script>
	import ContentCards from '$lib/components/ContentCards.svelte';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<ContentCards {data} />

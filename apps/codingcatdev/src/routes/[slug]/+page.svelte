<script>
	import Content from '$lib/components/Content.svelte';
	import { ContentType } from '$lib/types';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<Content type={ContentType.page} content={data.content} />

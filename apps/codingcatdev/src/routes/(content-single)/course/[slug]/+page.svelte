<script>
	import Content from '$lib/components/Content.svelte';
	import { ContentType } from '$lib/types';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<svelte:head>
	<title>Course |</title>
</svelte:head>

<Content type={ContentType.course} content={data.content} />

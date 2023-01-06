<script>
	import { ContentType } from '$lib/types/index';
	import RecentPostsList from '$lib/components/RecentPostsList.svelte';
	import Media from '$lib/components/content/Media.svelte';

	/** @type {import('./$types').LayoutData} */
	export let data;
</script>

<!-- TODO: Fix layout -->
<Media />

<section class="justify-center p-1 content-single xl:p-8 sm:flex">
	<div><slot /></div>
	<div class="hidden xl:block">
		<RecentPostsList contentType={ContentType.course} list={data.course} />
		<RecentPostsList contentType={ContentType.tutorial} list={data.tutorial} />
		<RecentPostsList contentType={ContentType.podcast} list={data.podcast} />
		<RecentPostsList contentType={ContentType.post} list={data.post} />
	</div>
</section>

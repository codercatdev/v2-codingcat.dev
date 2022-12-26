<script>
	import { ContentType } from '$lib/types/index';
	import RecentPostsList from '$lib/components/RecentPostsList.svelte';

	/** @type {import('./$types').LayoutData} */
	export let data;
</script>

<section class="content-single p-1 xl:p-8 sm:flex justify-center">
	<div><slot /></div>
	<div class="hidden xl:block">
		<RecentPostsList contentType={ContentType.course} list={data.course} />
		<RecentPostsList contentType={ContentType.tutorial} list={data.tutorial} />
		<RecentPostsList contentType={ContentType.podcast} list={data.podcast} />
		<RecentPostsList contentType={ContentType.post} list={data.post} />
	</div>
</section>

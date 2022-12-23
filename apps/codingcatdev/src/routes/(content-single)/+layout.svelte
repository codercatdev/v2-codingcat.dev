<script>
	import { ContentType } from '$lib/types/index';
	import RecentPostsList from '$lib/components/RecentPostsList.svelte';

	/** @type {import('./$types').LayoutData} */
	export let data;
</script>

<section class="content-single flex justify-center gap-4">
	<div class=" "><slot /></div>
	<RecentPostsList contentType={ContentType.post} list={data.post} />
</section>

<script>
	import { ContentType } from '$lib/types/index';
	import ContentCards from '$lib/components/ContentCards.svelte';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<div class="p-4 sm:p-10">
	<ContentCards type={ContentType.course} list={data.list} />
</div>

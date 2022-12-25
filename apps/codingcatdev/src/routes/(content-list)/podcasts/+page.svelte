<script>
	import { ContentType } from '$lib/types/index';
	import ContentCards from '$lib/components/ContentCards.svelte';
	import { onMount } from 'svelte';

	/** @type {import('./$types').PageData} */
	export let data;
	let next = {};
	const more = async () => {
		const response = await fetch('/api/more-content', {
			method: 'POST',
			body: JSON.stringify({ contentType: ContentType.podcast, after: next }),
			headers: {
				'content-type': 'application/json'
			}
		});
		const d = await response.json();
		data = {
			content: [...data.content, ...d.content],
			next
		};
		next = d.next;
	};

	onMount(async () => {
		next = data.next;
		console.log(next);
	});
</script>

<div class="flex flex-col gap-4 p-2">
	<div class="p-4 sm:p-10">
		<ContentCards type={ContentType.podcast} list={data.content} />
	</div>
	{#if Object.keys(next).length}
		<div class="flex justify-center">
			<button class="btn btn-primary" on:click={() => more()}> More </button>
		</div>
	{/if}
</div>

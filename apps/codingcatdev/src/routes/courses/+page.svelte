<script>
	/** @type {import('./$types').PageData} */
	export let data;
</script>

<ul>
	{#each data.list as content}
		<li><a href={`/course/${content.slug}`}>{content.title}</a></li>
	{/each}
</ul>

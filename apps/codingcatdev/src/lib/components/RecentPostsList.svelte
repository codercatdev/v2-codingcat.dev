<script>
	/** @type {import('$lib/types/index').Content[]} */
	export let list;
	/** @type {import('$lib/types/index').ContentType} */
	export let contentType;
</script>

<div class="pt-2">
	<ul class="card w-96 bg-primary shadow-xl">
		{#each list as content}
			<li class={`list-none cursor-pointer p-1 rounded m-1 flex flex-col justify-between`}>
				<a
					href={`/${contentType}/${content.slug}`}
					class="no-underline border-none hover:text-basics-50 dark:hover:text-basics-50"
				>
					{content.title}
				</a>
			</li>
		{/each}
	</ul>
</div>

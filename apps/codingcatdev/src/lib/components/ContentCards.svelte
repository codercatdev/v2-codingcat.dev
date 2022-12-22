<script>
	import AJPrimary from '$lib/components/global/icons/AJPrimary.svelte';

	/** @type {import('$lib/types/index').ContentType} */
	export let type;
	/** @type {import('$lib/types/index').Content[]} */
	export let list = [];
</script>

{#if !list.length}
	<div class="p-4 pt-8">
		<h1>Oh no! Nothing to show yet...</h1>
	</div>
{:else}
	<section class="relative grid gap-4 grid-cols-fit sm:gap-10">
		{#each list as content}
			<div
				class="grid transition-all rounded-md shadow-lg dark:text-primary-50 dark:bg-basics-900 grid-rows-auto-2 hover:shadow-2xl hover:scale-105 bg-base-100"
			>
				<a class="self-start" href={`/${type}/${content.slug}`}>
					{#if content?.cover}
						<img
							src={content.cover}
							alt={content.title}
							width="480"
							height="270"
							class="rounded-md rounded-b-none cursor-pointer"
						/>
					{:else}
						<div class="relative" style="paddingBottom: '56.25%'">
							<div
								class="absolute flex items-center flex-auto w-full h-full rounded-t-md bg-primary-900 dark:bg-primary-900"
							>
								<AJPrimary cls="w-full h-full p-4" />
							</div>
						</div>
					{/if}
				</a>

				<section class="grid h-full grid-cols-1 gap-2 p-4">
					<div class="space-y-2">
						<h3 class="font-sans text-lg tracking-wide text-bold">
							<a href={`/${type}/${content.slug}`}>{content.title}</a>
						</h3>
						{#if content.excerpt}
							<p class="text-sm font-hairline ">{content.excerpt}</p>
						{/if}
						{#if content.authors}
							<div class="flex flex-col">
								{#each content.authors as author}
									<a href={`/authors/${author.slug}`} class="font-sans text-lg">
										{author.displayName}
									</a>
								{/each}
							</div>
						{/if}
					</div>
				</section>
			</div>
		{/each}
	</section>
{/if}

<style>
	.grid-cols-fit {
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	}
</style>

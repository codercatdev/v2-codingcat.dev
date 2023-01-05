<script>
	/** @type {import('$lib/types/index').ContentType} */
	export let type;
	/** @type {import('$lib/types/index').Content | null} */
	export let content;
	import 'prism-themes/themes/prism-shades-of-purple.min.css';
	import { MetaTags } from 'svelte-meta-tags';
	import { PUBLIC_FACEBOOK_APP_ID } from '$env/static/public';
</script>

<MetaTags
	title={content?.title || 'CodingCat.dev'}
	description={content?.excerpt ||
		'Codingcat.dev is where you can find all the Purrfect Web Tutorials that you will ever need!'}
	canonical={`https://codingcat.dev/` + (type && `${type}/${content?.slug}`)}
	facebook={{
		appId: PUBLIC_FACEBOOK_APP_ID || ''
	}}
	openGraph={{
		type: 'website',
		url: `https://codingcat.dev/${type}/${content?.slug}`,
		title: 'CodingCatDev | Purrfect Web Tutorials',
		description:
			'Codingcat.dev is where you can find all the Purrfect Web Tutorials that you will ever need!',
		images: [
			{
				url: 'https://media.codingcat.dev/image/upload/f_jpg/dev-codingcatdev-photo/v60h88eohd7ufghkspgo',
				alt: 'AJ Logo Black Cat Face with CodingCat.dev Domain'
			}
		]
	}}
	twitter={{
		handle: '@CodingCatDev',
		site: '@CodingCatDev',
		cardType: 'summary_large_image'
	}}
/>

{#if content}
	<section class="prose w-full flex-grow lg:prose-xl xl:prose-2xl">
		{@html content.content}
	</section>
{:else}
	<p>No data found yet</p>
{/if}

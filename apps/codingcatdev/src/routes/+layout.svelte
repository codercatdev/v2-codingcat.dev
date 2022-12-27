<script>
	import '../app.postcss';
	import TopNav from '$lib/components/layout/TopNav.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import DrawerNav from '$lib/components/layout/DrawerNav.svelte';

	// TODO: https://github.com/sveltejs/kit/issues/2733
	import { afterNavigate, beforeNavigate } from '$app/navigation';

	/** @type {HTMLElement} */
	let content;

	afterNavigate(() => {
		console.log('navigating');
		setTimeout(() => {
			content.scrollTo(0, 0);
		}, 0);
	});
</script>

<div class="drawer drawer-end">
	<input id="ccd-drawer" type="checkbox" class="drawer-toggle" />
	<div
		bind:this={content}
		class="flex flex-col drawer-content"
		style="scroll-behavior: smooth; scroll-padding-top: 5rem;"
	>
		<TopNav />
		<main class="flex-1">
			<slot />
		</main>
		<Footer />
	</div>
	<div class="drawer-side">
		<label for="ccd-drawer" class="drawer-overlay" />
		<DrawerNav />
	</div>
</div>

<script>
	import '../app.postcss';
	import TopNav from '$lib/components/layout/TopNav.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import { PUBLIC_NAME } from '$env/static/public';
	import DrawerNav from '$lib/components/layout/DrawerNav.svelte';
</script>

<div class="drawer drawer-end">
	<input id="ccd-drawer" type="checkbox" class="drawer-toggle" />
	<div class="flex flex-col drawer-content">
		<TopNav />
		<main class="flex justify-center">
			<slot />
		</main>
		<Footer />
	</div>
	<div class="drawer-side">
		<label for="ccd-drawer" class="drawer-overlay" />
		<DrawerNav />
	</div>
</div>

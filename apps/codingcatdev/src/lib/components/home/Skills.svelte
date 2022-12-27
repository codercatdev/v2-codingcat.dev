<script>
	import ReactLogo from '$lib/components/global/icons/vendor/ReactLogo.svelte';
	import AngularLogo from '$lib/components/global/icons/vendor/AngularLogo.svelte';
	import VueLogo from '$lib/components/global/icons/vendor/VueLogo.svelte';
	import SvelteLogo from '$lib/components/global/icons/vendor/SvelteLogo.svelte';
	import CssLogo from '$lib/components/global/icons/vendor/CssLogo.svelte';
	import HtmlLogo from '$lib/components/global/icons/vendor/HtmlLogo.svelte';
</script>

<a href="/languages/html">
	<span class="sr-only">HTML</span>
	<HtmlLogo props={{ class: 'h-16 md:h-20' }} />
</a>
<a href="/frameworks/angular">
	<span class="sr-only">Angular</span>
	<AngularLogo props={{ class: 'h-14 md:h-16' }} />
</a>
<a href="/frameworks/vue">
	<span class="sr-only">Vue</span>
	<VueLogo props={{ class: 'h-14 md:h-16' }} />
</a>
<a href="/frameworks/react">
	<span class="sr-only">React</span>
	<ReactLogo props={{ class: 'h-14 md:h-16' }} />
</a>
<a href="/frameworks/svelte">
	<span class="sr-only">Svelte</span>
	<SvelteLogo props={{ class: 'h-16 md:h-20' }} />
</a>
<a href="/languages/css">
	<span class="sr-only">CSS</span>
	<CssLogo props={{ class: 'h-16 md:h-20' }} />
</a>

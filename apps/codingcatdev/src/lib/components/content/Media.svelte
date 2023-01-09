<script>
	import videojs from 'video.js';
	import 'videojs-youtube';
	import { onMount, onDestroy } from 'svelte';

	/**
	 * See https://videojs.com/guides/options/#sources
	 * @type {[{
	 * src: string
	 * type: string
	 * }]}*/
	export let sources;

	onMount(() => {
		videojs(
			'video-player',
			{
				controls: true,
				autoplay: false,
				preload: 'auto',
				fluid: true,
				// plugins: {
				// 	Youtube: {}
				// },
				techOrder: ['youtube'],
				sources
			},
			undefined
		);
	});
	onDestroy(() => {
		for (const player of videojs.getAllPlayers()) {
			player.dispose();
		}
	});
</script>

<svelte:head>
	<link
		type="text/css"
		rel="stylesheet"
		href="../../../../node_modules/video.js/dist/video-js.min.css"
	/>
	<script>
		//This is a fake script tag because YT API needs one to append after.
		//https:\/\/www.youtube.com\/s\/player\/e5f6cbd5\/www-widgetapi.vflset\/www-widgetapi.js
		//This line var b = document.getElementsByTagName("script")[0];b.parentNode.insertBefore(a, b)
	</script>
</svelte:head>

<!-- svelte-ignore a11y-media-has-caption -->
<!-- <video bind:this={vid} /> -->
<video id="video-player" class="video-js">
	<p class="vjs-no-js">
		To view this video please enable JavaScript, and consider upgrading to a web browser that
		<a href="https://videojs.com/html5-video-support/" target="_blank" rel="noreferrer"
			>supports HTML5 video</a
		>
	</p>
</video>

<script>
	import videojs from 'video.js';
	// import 'videojs-youtube';
	import { onMount, onDestroy } from 'svelte';
	onMount(() => {
		videojs(
			'video-player',
			{
				controls: true,
				autoplay: false,
				preload: 'auto',
				fluid: true,
				plugins: {},
				// techOrder: ['html5', 'youtube'],
				sources: [
					{
						src: 'https://vjs.zencdn.net/v/oceans.mp4',
						type: 'video/mp4'
					}
				]
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

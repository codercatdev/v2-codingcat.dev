<section class="relative flex items-center justify-between w-full p-4 vertical-clip">
	<slot />
</section>

<style>
	section:after {
		content: '';
		position: absolute;
		width: 1.5rem;
		bottom: 0;
		right: 4%;
		border: 1.5rem solid transparent;
		border-top-color: #4b0a75;
		border-bottom: 0;
		border-right: -1.5rem;
		margin-bottom: -1.5rem;
	}
</style>

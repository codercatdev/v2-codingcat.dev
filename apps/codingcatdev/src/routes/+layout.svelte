<script>
	import '../app.postcss';
	import Footer from '$lib/components/Footer.svelte'
	import { PUBLIC_NAME } from '$env/static/public'
</script>

<div class="drawer">
	<input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
	<div class="flex flex-col drawer-content">
		<header>
			<div class="navbar bg-base-300">
				<div class="flex-none lg:hidden">
					<label for="my-drawer-3" class="btn btn-square btn-ghost">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							class="inline-block w-6 h-6 stroke-current"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					</label>
				</div>
				<div class="flex-1 ">
					<a href="/" class="text-xl normal-case btn btn-ghost">{PUBLIC_NAME}</a>
				</div>
				<div class="flex-1 hidden lg:block">
					<ul class="p-0 menu menu-horizontal">
						<li class="hidden lg:block">
							<a href="/blog" class="text-xl normal-case">Blog</a>
						</li>
						<li class="hidden lg:block">
							<a href="/tutorials" class="text-xl normal-case">Tutorials</a>
						</li>
					</ul>
				</div>
				<div class="flex-none hidden lg:block">
					<!-- {#if $user}
						<div class="dropdown dropdown-end dropdown-hover">
							<label tabIndex={0} class="m-1 btn btn-primary">
								{$user.name}
							</label>
							<ul tabIndex={0} class="p-2 shadow dropdown-content menu bg-primary rounded-box w-52">
								<li>
									<a on:click|once={logout}>Logout</a>
								</li>
							</ul>
						</div>
					{:else} -->
						<!-- <a class="btn btn-primary" on:click|once={createSession}> Login </a> -->
					<!-- {/if} -->
				</div>
			</div>
		</header>
		<main class="flex-1">
			<slot />
		</main>
		<Footer />
	</div>
	<div class="drawer-side">
		<label htmlFor="my-drawer-3" class="drawer-overlay" />
		<ul class="p-4 overflow-y-auto menu w-80 bg-base-100">
			<li>
				<a>Sidebar Item 1</a>
			</li>
			<li>
				<a>Sidebar Item 2</a>
			</li>
		</ul>
	</div>
</div>

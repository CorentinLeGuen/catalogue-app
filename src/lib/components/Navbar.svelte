<script lang="ts">
	import { Navbar, NavBrand } from 'flowbite-svelte';
	import ThemeToggle from './ThemeToggler.svelte';
</script>

<Navbar class="border-b">
	<NavBrand href="/">
		<img src="/favicon.svg" class="me-3 h-6 sm:h-9" alt="Website Logo" />
		<span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Catalogue</span>
	</NavBrand>
	<div class="flex md:order-2">
		<ThemeToggle />
	</div>
</Navbar>
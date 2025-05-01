<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
</script>

<div class="min-h-screen flex flex-col bg-white text-black transition-colors dark:bg-gray-900 dark:text-white">
    <Navbar />
    <main class="p-6 flex-grow text-gray-700 dark:text-gray-400">
        <slot />
    </main>
</div>

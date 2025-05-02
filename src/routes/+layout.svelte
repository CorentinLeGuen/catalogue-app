<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import Chatbot from '$lib/components/Chatbot.svelte';
    import ChatbotButton from '$lib/components/ChatbotButton.svelte';

    let showChat = false;
</script>

<div class="min-h-screen flex flex-col bg-white text-black transition-colors dark:bg-gray-900 dark:text-white">
    <Navbar />
    <main class="p-6 flex-grow text-gray-700 dark:text-gray-400">
        <slot />
    </main>
    <ChatbotButton visible={!showChat} onClick={() => (showChat = true)} />
    <Chatbot visible={showChat} onClose={() => (showChat = false)} />
</div>


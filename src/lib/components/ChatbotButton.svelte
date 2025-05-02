<script>
    import { Button } from 'flowbite-svelte';
    
    export let visible = false;
	export let onClick;
</script>

{#if visible}
    <div class="fixed bottom-0 right-4 z-50">
        <button on:click={onClick} class="p-4 transition" aria-label="Ouvrir le chat">
            <img class="w-24 h-24" src="/assistant.svg" alt="chatbot assistant icon" />
        </button>
    </div>
{/if}
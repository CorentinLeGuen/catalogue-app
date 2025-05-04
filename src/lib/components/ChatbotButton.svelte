<script>
    import { Tooltip } from 'flowbite-svelte';
    
    export let visible = false;
	export let onClick;
</script>

{#if visible}
    <div class="fixed bottom-0 right-4 z-50">
        <button on:click={onClick} class="p-4 transition drop-shadow-xl/25" aria-label="Ouvrir le chat">
            <img class="w-16 h-16 md:w-24 md:h-24" src="/assistant.svg" alt="chatbot assistant icon" />
        </button>
        <Tooltip>Besoin d'assistance ?</Tooltip>
    </div>
{/if}
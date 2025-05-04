<script lang="ts">
    import { tick } from 'svelte';
    import { writable, get } from 'svelte/store';
    export let visible = false;
    export let onClose;

    import { Input, P, Spinner } from 'flowbite-svelte';
    import { CloseOutline } from 'flowbite-svelte-icons';

    let scrollContainer: HTMLDivElement;

    let userMessage = '';
    let isWaitingMessage = false;
    const messages = writable<{role: string; content: string }[]>([]);

    async function sendMessage() {
        if (!userMessage.trim()) return;
        isWaitingMessage = true;

        messages.update(msgs => [...msgs, { role: 'user', content: userMessage }]);
        const body = { messages: get(messages) };
        userMessage = '';

        await tick();
        scrollContainer.scrollTop = scrollContainer.scrollHeight;

        try {
            const res = await fetch('/chatbot/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await res.json();

            if (data.response) {
                messages.update(msgs => [...msgs, { role: 'assistant', content: data.response }]);
            } else {
                messages.update(msgs => [...msgs, { role: 'assistant', content: 'Notre agent n\'est pas disponible pour le moment...' }]);
            }
        } catch (err) {
            messages.update(msgs => [...msgs, { role: 'assistant', content: 'Notre agent est en maintenance, réessayez plus tard.' }]);
        }
        isWaitingMessage = false;
        await tick();
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
</script>

{#if visible}
    <form on:submit|preventDefault={sendMessage} class="">
        <div class="fixed bottom-10 right-4 z-50 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-lg w-11/12 max-w-md h-1/2 border border-gray-100 dark:border-gray-900">
            <div class="p-2 border-b border-gray-300 dark:border-gray-600">
                <h2 class="text-sm font-semibold text-center text-gray-600 dark:text-gray-200">Assistant Bibliothécaire ChatXUM</h2>
                <a href="#chatbot" on:click={onClose} class="absolute top-2 right-2">
                    <CloseOutline />
                </a>
            </div>

            <div bind:this={scrollContainer} class="max-h-5/6 overflow-y-auto my-2 mx-4">
                {#each $messages as msg (msg.content)}
                    {#if msg.role === 'user'}
                        <P italic class="text-gray-500 dark:text-gray-400 mb-4" align="left">{msg.content}</P>
                    {:else}
                        <P class="text-gray-800 dark:text-gray-200 mb-4" align="right">{msg.content}</P>
                    {/if}
                {/each}
                {#if isWaitingMessage}
                    <div class="text-right"><Spinner size={4} color="gray" /></div>
                {/if}
            </div>

            <Input bind:value={userMessage} placeholder="Posez une question" class="absolute rounded-none bottom-0 border-0 border-t focus:ring-0 focus:border-gray-300 dark:focus:border-gray-600" />
        </div>
    </form>
{/if}

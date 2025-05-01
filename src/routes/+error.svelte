<script>
	import { Alert } from 'flowbite-svelte';
	import { InfoCircleSolid } from 'flowbite-svelte-icons';
</script>

<div class="max-w-full sm:max-w-3/4 md:max-w-2/3 xl:max-w-1/2 2xl:max-w-1/3 mx-auto">
    <Alert color="red" rounded={false} class="border-t-4">
        <InfoCircleSolid slot="icon" class="h-5 w-5" />
        <span class="font-medium">Désolé, quelque chose s'est mal passé.</span>
    </Alert>
</div>
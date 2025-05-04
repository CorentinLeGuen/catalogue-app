<script lang="ts">
	import { onMount } from 'svelte';
	import { fetchBooks, type Book } from '$lib/index';
	import { Alert, Heading, Hr, P, Spinner, ButtonGroup, Button } from 'flowbite-svelte';
	import { InfoCircleSolid, MailBoxSolid, BookSolid } from 'flowbite-svelte-icons';
	import SearchBook from '$lib/components/SearchBook.svelte';

	let books: Book[] = [];
	let error: string | null = null;
	let loading = true;

	onMount(async () => {
		try {
			books = await fetchBooks();
		} catch (e) {
			error = (e as Error).message;
		} finally {
			loading = false;
		}
	});
</script>

<Heading tag="h1" class="mb-4" customSize="text-center text-4xl md:text-8xl font-extrabold"><span class="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400 dark:to-blue-700 dark:from-yellow-500 drop-shadow-xl/25">Catalogue de livres</span></Heading>

<div class="paragraph my-4">
	<P class="text-center text-2xl">
		Consulter votre collection de livres: recherchez, ajoutez, modifiez ou supprimer des livres !
	</P>
	<P class="text-center text-2xl">
		Laissez notre service vous aider à remplir les informations de votre référence. Laissez nos agents IA vous aider dans votre aventure !
	</P>
</div>

<div class="flex justify-center mt-8">
	<ButtonGroup class="x-auto *:ring-alternative-500!">
		<Button href="https://github.com/CorentinLeGuen/catalogue-app" target="_blank" color="yellow">
			Svelte app
		</Button>
		<Button href="https://github.com/CorentinLeGuen/catalogue-summarizer" target="_blank" color="green">
			AI agent summarizer
		</Button>
		<Button href="https://github.com/CorentinLeGuen/catalogue-chatbot" target="_blank" color="purple">
			AI agent chatbot
		</Button>
		<Button href="https://github.com/CorentinLeGuen/catalogue" target="_blank" color="blue">
			Backend API app
		</Button>
	</ButtonGroup>
</div>

<Hr classHr="w-48 h-1 mx-auto my-4 rounded-sm md:my-10" />

<div class="my-4">
	{#if loading}
		<div class="p-6 text-xl text-center">
			<Spinner class="me-4"/> Chargement des livres ...
		</div>
	{:else if error}
		<div class="x-auto">
			<Alert border color="red">
				<InfoCircleSolid slot="icon" class="w-5 h-5" />
				<span class="font-medium">Quelque chose s'est mal passé durant la récupération des livres.</span>
				<small>{error}</small>
			</Alert>
		</div>
	{:else if books.length === 0}
		<P class="paragraph flex justify-center my-12">
			Aucun livre trouvé <MailBoxSolid class="ml-8"/>
		</P>
	{:else}
		<h2 class="text-4xl text-center">Il y a actuellement <span class="text-primary-700">{books.length}</span> livres !</h2>
	{/if}
</div>

<SearchBook />

<div class="flex justify-center mt-8">
	<Button outline href="/add" class="x-auto px-24">
		<BookSolid class="me-4" /> Ajouter un livre
	</Button>
</div>

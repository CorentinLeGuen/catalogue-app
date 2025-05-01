<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { Alert, Button, Spinner } from 'flowbite-svelte';
	import { InfoCircleSolid, ReplySolid } from 'flowbite-svelte-icons';
	import { fetchBookByIsbn, deleteBook, type Book } from '$lib/index';
	import { goto } from '$app/navigation';

	let book: Book | null = null;
	let isbn = '';
	let loading = true;
	let err: string | null = null;

	$: isbn = $page.params.isbn;

	onMount(async () => {
		try {
			book = await fetchBookByIsbn(isbn);
		} catch (e) {
			err = (e as Error).message;
		} finally {
			loading = false;
		}
	});

	async function handleDelete() {
		if (confirm(`Supprimer le livre "${book?.title}" ?`)) {
			try {
				await deleteBook(isbn);
				goto('/');
			} catch (e) {
				alert((e as Error).message);
			}
		}
	}
</script>

<div class="mx-auto max-w-full sm:max-w-3/4 md:max-w-2/3 xl:max-w-1/2 2xl:max-w-1/3">
	{#if loading}
		<div class="p-6 text-center">
			<Spinner class="me-4"/> Chargement du livre avec l'ISBN <strong>{isbn}</strong> ...
		</div>
	{:else if err}
		<Alert color="red" rounded={false} class="border-t-4">
			<InfoCircleSolid slot="icon" class="h-5 w-5" />
			<p class="font-medium">Désolé, quelque chose s'est mal passé.</p>
			<span>{err}</span>
		</Alert>

		<div class="flex justify-left mt-8">
			<Button outline href="/" class="x-auto px-24" color="light">
				<ReplySolid class="me-4"/>Retour au catalogue
			</Button>
		</div>
	{:else if book}
		<h1 class="text-4xl font-extrabold text-center">{book.title}</h1>
		<p><strong>ISBN :</strong> {book.isbn}</p>
		{#if book.authors?.length}
			<h3 class="font-extrabold">Auteur·e·s</h3>
			{#each book.authors as author}
				<p>{author}</p>
			{/each}
		{/if}
		{#if book.publicationDate}
			<p><strong>Publié le :</strong> {new Date(book.publicationDate).toLocaleDateString()}</p>
		{/if}

		{#if book.pageCount}
			<p><strong>Nombre de pages :</strong> {book.pageCount}</p>
		{/if}

		{#if book.summary}
			<p><strong>Résumé :</strong> {book.summary}</p>
		{/if}

		<div class="flex mt-4 space-x-2">
			<Button href="{`/${isbn}/edit`}" class="grow" color="blue" outline>Modifier le livre</Button>
			<Button on:click={handleDelete} href="" outline class="cursor-pointer" color="red">Supprimer le livre</Button>
		</div>
			
		<div class="flex justify-left mt-8">
			<Button outline href="/" class="x-auto px-24" color="light">
				<ReplySolid class="me-4"/>Retour au catalogue
			</Button>
		</div>
	{:else}
		<Alert color="red" rounded={false} class="border-t-4">
			<InfoCircleSolid slot="icon" class="h-5 w-5" />
			<p class="font-medium">Désolé, le livre est introuvable</p>
		</Alert>

		<div class="flex justify-left mt-8">
			<Button outline href="/" class="x-auto px-24" color="light">
				<ReplySolid class="me-4"/>Retour au catalogue
			</Button>
		</div>
	{/if}
</div>
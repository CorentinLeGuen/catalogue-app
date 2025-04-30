<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
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

{#if loading}
	<p>Chargement…</p>
{:else if err}
	<p style="color: red;">Erreur : {err}</p>
{:else if book}
	<h1>{book.title}</h1>
	<p><strong>ISBN :</strong> {book.isbn}</p>

	{#if book.authors?.length}
		<p><strong>Auteur(s) :</strong> {book.authors.join(', ')}</p>
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

	<button on:click={handleDelete} style="color: red;">🗑 Supprimer ce livre</button>
	<br />
	<a href="/">⬅ Retour au catalogue</a>
{:else}
	<p>Livre introuvable.</p>
{/if}

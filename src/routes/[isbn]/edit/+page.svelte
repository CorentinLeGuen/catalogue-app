<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	let isbn = '';
	let book = {
		title: '',
		authors: [],
		publicationDate: '',
		summary: '',
		pageCount: 0
	};

	$: isbn = $page.params.isbn;

	onMount(async () => {
		const res = await fetch(`/catalogue/books/${isbn}`);
		if (res.ok) {
			book = await res.json();
		}
	});

	async function updateBook() {
		const res = await fetch(`/catalogue/books`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(book)
		});

		if (res.ok) {
			alert('Livre mis à jour avec succès !');
		} else {
			alert('Erreur lors de la mise à jour');
		}
	}
</script>

<h1>Modifier le livre : {isbn}</h1>

<form on:submit|preventDefault={updateBook}>
	<input bind:value={book.title} placeholder="Titre" required />
	<input bind:value={book.authors[0]} placeholder="Auteur" required />
	<input type="date" bind:value={book.publicationDate} required />
	<textarea bind:value={book.summary} placeholder="Résumé"></textarea>
	<input type="number" bind:value={book.pageCount} placeholder="Nombre de pages" required />
	<button type="submit">Mettre à jour</button>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 400px;
	}
	input,
	textarea {
		width: 100%;
		padding: 0.5rem;
	}
</style>

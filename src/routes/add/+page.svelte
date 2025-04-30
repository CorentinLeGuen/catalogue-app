<script lang="ts">
	import { goto } from '$app/navigation';
	let title = '';
	let isbn = '';
	let authors = '';
	let publicationDate = '';
	let summary = '';
	let isLoading = false;
	let pageCount: number | null = null;

	$: if (isbn.length === 10 || isbn.length === 13) {
		fetchBook(isbn);
	}

	async function fetchBook(isbn: string) {
		const res = await fetch(
			`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`
		);
		const data = await res.json();
		const bookData = data[`ISBN:${isbn}`];

		console.log(data);

		if (bookData) {
			title = bookData.title ?? '';
			authors = (bookData.authors ?? []).map((a: any) => a.name).join(', ');
			publicationDate = formatToISODate(bookData.publish_date ?? '');
			pageCount = bookData.number_of_pages?.toString() ?? '';
			summary =
				bookData.notes ??
				(typeof bookData.description === 'string'
					? bookData.description
					: (bookData.description?.value ?? ''));
		}
	}

	function formatToISODate(dateString: string) {
		const parsedDate = new Date(dateString);
		if (isNaN(parsedDate.getTime())) return '';

		const year = parsedDate.getFullYear();
		const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
		const day = String(parsedDate.getDate()).padStart(2, '0');

		return `${year}-${month}-${day}`;
	}

	async function handleSummarize() {
		if (!summary.trim()) return;

		isLoading = true;

		try {
			const response = await fetch('/ai/summarize', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ text: summary })
			});

			if (!response.ok) {
				throw new Error(`Erreur API: ${response.status}`);
			}

			const result = await response.json();
			summary = result.summary || '';
		} catch (error) {
			console.error('Erreur durant le résumé:', error);
			alert('Erreur lors du résumé.');
		} finally {
			isLoading = false;
		}
	}

	async function handleSubmit() {
		const res = await fetch('/catalogue/books', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				title,
				isbn,
				authors: authors.split(',').map((a) => a.trim()),
				publicationDate,
				summary,
				pageCount: pageCount ?? 0
			})
		});

		if (res.ok) {
			goto('/');
		} else {
			alert('Erreur lors de l’ajout du livre');
		}
	}
</script>

<h1>Ajouter un livre</h1>

<form on:submit|preventDefault={handleSubmit}>
	<label>ISBN :</label>
	<input bind:value={isbn} placeholder="ISBN (10 ou 13 chiffres)" required />

	<label>Titre :</label>
	<input bind:value={title} placeholder="Titre" required />

	<label>Auteurs :</label>
	<input bind:value={authors} placeholder="Auteur(s)" required />

	<label>Date de publication :</label>
	<input type="date" bind:value={publicationDate} placeholder="YYYY" required />

	<label>Nombre de pages :</label>
	<input type="number" bind:value={pageCount} placeholder="Nb pages" required />

	<label>Résumé :</label>
	<textarea bind:value={summary} placeholder="Résumé" rows="4"></textarea>

	<button type="button" on:click={handleSummarize} disabled={isLoading}>
		{isLoading ? 'Résumé en cours...' : 'Générer un bref résumé du contenu'}
	</button>

	<button type="submit">Ajouter</button>
</form>

<a href="/">⬅ Retour au catalogue</a>

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

<script lang="ts">
	import { goto } from '$app/navigation';
	import { Alert, Heading, Button, Textarea, FloatingLabelInput, Helper } from 'flowbite-svelte';
	import { ReplySolid, InfoCircleSolid } from 'flowbite-svelte-icons';

	let title = '';
	let isbn = '';
	let authors = '';
	let publicationDate = '';
	let summary = '';
	let isLoading = false;
	let pageCount: number | null = null;
	
	let hasFailed = false;
	let error = "";

	$: if (isbn.length === 10 || isbn.length === 13) {
		fetchBook(isbn);
	}

	async function resetError() {
		hasFailed = false;
		error = "";
	}

	async function fetchBook(isbn: string) {
		const res = await fetch(
			`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`
		);
		const data = await res.json();
		const bookData = data[`ISBN:${isbn}`];

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
				hasFailed = true;
				error = "impossible de joindre l’API.";
			}

			const result = await response.json();
			summary = result.summary || '';
		} catch (error) {
			hasFailed = true;
			error = "la génération du résumé s’est mal passée";
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
			goto(`/${isbn}`);
		} else {
			hasFailed = true;
			const data = await res.json();
			error = data.message.replace('{', '').replace('}', '').trim();
		}
	}
</script>

<div class="mx-auto max-w-full sm:max-w-3/4 md:max-w-2/3 xl:max-w-1/2 2xl:max-w-1/3">
	<Heading tag="h1" class="mb-4" customSize="text-center text-4xl font-extrabold">
		Ajoutez un livre à la collection
	</Heading>

	<form on:submit|preventDefault={handleSubmit} class="mx-auto py-8">
		{#if hasFailed}
			<Alert color="red" class="my-4" dismissable>
				<InfoCircleSolid slot="icon" class="w-5 h-5" />
				<a on:click={resetError} href="#close">
					Désolé, une erreur est survenue <em>{error}</em>
				</a>
			</Alert>
		{/if}

		<div class="mb-2">
			<FloatingLabelInput  bind:value={isbn} type="text" id="ISBN" placeholder="ISBN (10 ou 13 caractères)" required>
				ISBN du livre (10 ou 13 caractères)
			</FloatingLabelInput>
			<Helper class="text-primary-800 dark:text-primary-600">
				Renseignez l'ISBN du livre pour remplir ses informations
			</Helper>
		</div>

		<div class="mb-2">
			<FloatingLabelInput bind:value={title} placeholder="Titre" required>
				Titre du livre
			</FloatingLabelInput>
		</div>

		<div class="mb-2">
			<FloatingLabelInput bind:value={authors} placeholder="Auteur(s) séparés par une virgule" required>
				Auteur(s) séparés par une virgule
			</FloatingLabelInput>
		</div>

		<div class="mb-2">
			<FloatingLabelInput type="date" bind:value={publicationDate} placeholder="mm/dd/yyyy" >
				Date de publication
			</FloatingLabelInput>
		</div>

		<div class="mb-2">
			<FloatingLabelInput type="number" bind:value={pageCount} placeholder="Nombre de pages">
				Nombre de pages
			</FloatingLabelInput>
		</div>

		<div class="mb-2">
			<Textarea bind:value={summary} placeholder="Résumé du livre" rows="8"/> 
		</div>

		{#if summary !== ""}
			<Button type="button" on:click={handleSummarize} disabled={isLoading} outline color="blue" class="w-full mb-4">
				{isLoading ? 'Résumé en cours...' : 'Générer un bref résumé du contenu'}
			</Button>
		{/if}

		<Button type="submit" outline class="w-full">
			Ajouter
		</Button>
	</form>
	
	<div class="flex justify-left mt-8">
		<Button outline href="/" class="x-auto px-24" color="light">
			<ReplySolid class="me-4"/>Retour au catalogue
		</Button>
	</div>
</div>

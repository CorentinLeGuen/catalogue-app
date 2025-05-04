<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { Alert, Button, FloatingLabelInput, Heading, Spinner, Textarea } from 'flowbite-svelte';
	import { InfoCircleSolid, ReplySolid } from 'flowbite-svelte-icons';
	import { goto } from '$app/navigation';

	let isbn = '';
	let book = {
		title: '',
		authors: '',
		publicationDate: '',
		summary: '',
		pageCount: 0
	};
	let isSummaryGenerationLoading = false;
	let isLoading = true;

	let hasFailed = false;
	let error = '';

	$: isbn = $page.params.isbn;

	async function resetError() {
		hasFailed = false;
		error = '';
	}

	onMount(async () => {
		try {
			const res = await fetch(`/catalogue/books/${isbn}`);
			if (res.ok) {
				book = await res.json();
			} else {
				throw new Error(`Livre non trouvé (ISBN: ${isbn}).`);
			}
		} catch (e) {
			hasFailed = true;
			error = (e as Error).message;
		} finally {
			isLoading = false;
		}
	});

	function normalizeAuthors(authors: string | string[]): string[] {
		if (typeof authors === 'string') {
			return authors.split(',').map((a) => a.trim());
		}
		if (Array.isArray(authors)) {
			return authors.map((a) => a.trim());
		}
		return [];
	}

	async function updateBook() {
		book.authors = typeof book.authors === 'string'
			? book.authors.split(',').map(a => a.trim())
			: Array.isArray(book.authors)
				? book.authors.map(a => a.trim())
				: [];

		const res = await fetch(`/catalogue/books`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(book)
		});

		if (res.ok) {
			goto(`/${isbn}`);
		} else {
			alert('Erreur lors de la mise à jour');
		}
	}

	async function handleSummarize() {
		if (!book.summary.trim()) return;

		isSummaryGenerationLoading = true;

		try {
			const response = await fetch('/ai/summarize', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ text: book.summary })
			});

			if (!response.ok) {
				hasFailed = true;
				error = 'impossible de joindre l’API.';
			}

			const result = await response.json();
			book.summary = result.summary || '';
		} catch (error) {
			hasFailed = true;
			error = 'la génération du résumé s’est mal passée';
		} finally {
			isSummaryGenerationLoading = false;
		}
	}
</script>

<div class="mx-auto max-w-full sm:max-w-3/4 md:max-w-2/3 xl:max-w-1/2 2xl:max-w-1/3">
	{#if isLoading}
		<div class="p-6 text-center">
			<Spinner class="me-4" /> Chargement du livre avec l'ISBN <strong>{isbn}</strong> ...
		</div>
	{:else if error}
		<Alert color="red" rounded={false} class="border-t-4">
			<InfoCircleSolid slot="icon" class="h-5 w-5" />
			<p class="font-medium">Désolé, quelque chose s'est mal passé.</p>
			<span>{error}</span>
		</Alert>
	{:else if book}
		<Heading tag="h1" class="mb-4" customSize="text-center text-4xl font-extrabold">
			Modifier le livre <a href={`/${isbn}`} class="text-primary-700 dark:text-primary-500"
				>{isbn}</a
			>
		</Heading>

		<form on:submit|preventDefault={updateBook} class="mx-auto py-8 bder">
			{#if hasFailed}
				<Alert color="red" class="my-4" dismissable>
					<InfoCircleSolid slot="icon" class="w-5 h-5" />
					<a on:click={resetError} href="#close">
						Désolé, une erreur est survenue <em>{error}</em>
					</a>
				</Alert>
			{/if}

			<div class="mb-2">
				<FloatingLabelInput bind:value={book.title} placeholder="Titre" required>
					Titre du livre
				</FloatingLabelInput>
			</div>

			<div class="mb-2">
				<FloatingLabelInput
					bind:value={book.authors}
					placeholder="Auteur.ice(s) séparés par une virgule"
					required
				>
					Auteur.ice(s) séparés par une virgule
				</FloatingLabelInput>
			</div>

			<div class="mb-2">
				<FloatingLabelInput type="date" bind:value={book.publicationDate} placeholder="mm/dd/yyyy">
					Date de publication
				</FloatingLabelInput>
			</div>

			<div class="mb-2">
				<FloatingLabelInput type="number" bind:value={book.pageCount} placeholder="Nombre de pages" class="text-dark dark:text-white">
					Nombre de pages
				</FloatingLabelInput>
			</div>

			<div class="mb-2">
				<Textarea bind:value={book.summary} placeholder="Résumé du livre" rows="8" />
			</div>

			{#if book.summary !== ''}
				<Button
					type="button"
					on:click={handleSummarize}
					disabled={isSummaryGenerationLoading}
					outline
					color="blue"
					class="w-full mb-4"
				>
					{isSummaryGenerationLoading ? 'Résumé en cours...' : 'Générer un bref résumé du contenu'}
				</Button>
			{/if}

			<Button type="submit" outline class="w-full">Mettre à jour</Button>
		</form>
	{/if}

	<div class="flex justify-left mt-8">
		<Button outline href="/" class="x-auto px-24" color="light">
			<ReplySolid class="me-4" />Retour au catalogue
		</Button>
	</div>
</div>

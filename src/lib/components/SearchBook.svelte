<script lang="ts">
	import { Input, Button, Card } from 'flowbite-svelte';
	import { SearchOutline, ArrowRightOutline } from 'flowbite-svelte-icons';
	import { searchBookByTitleOrAuthor, type Book } from '$lib/index';
	import { onMount } from 'svelte';

	let books: Book[] = [];
	let search = '';

	async function handleSearch() {
		books = await searchBookByTitleOrAuthor(search);
	}
    onMount(async () => {
        handleSearch();
    });
</script>

<div class="mx-auto max-w-full sm:max-w-3/4 md:max-w-2/3 xl:max-w-1/2 2xl:max-w-1/3 my-4">
    <form class="flex gap-2 mb-2">
        <Input bind:value={search} class="grow" placeholder="Rechercher un livre ... " />
        <Button size="sm" on:click={handleSearch} class="">
            <SearchOutline class="w-6 h-6 me-2 -ms-1"/>
            Search
        </Button>
    </form>
</div>

<div class="flex flex-wrap justify-center gap-2">
    {#each books as book}
        <Card class="space-y-2 w-1/2 sm:w-1/2 md:w-1/3">
            <h5 class="mb-2 text-2xl font-bold tracking-tight">{book.title}</h5>
            <small>Date de publication: <em>{book.publicationDate}</em></small>
            <p>Pages: {book.pageCount}</p>
            <Button outline color="light" href="/{book.isbn}">
                Consulter les détails <ArrowRightOutline class="w-6 h-6 ms-2 text-dark dark:text-white" />
            </Button>
        </Card>
    {/each}
</div>
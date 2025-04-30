<script lang="ts">
    import { onMount } from 'svelte';
    import { fetchBooks, type Book } from '$lib/index';
  
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
  
  <h1>Catalogue de livres</h1>
  
  {#if loading}
    <p>Chargement…</p>
  {:else if error}
    <p style="color: red;">Erreur : {error}</p>
  {:else if books.length === 0}
    <p>Aucun livre trouvé 📭</p>
  {:else}
    <ul>
      {#each books as book}
        <li>
          <a href="/{book.isbn}">
            <strong>{book.title}</strong> — {book.isbn}
          </a>
        </li>
      {/each}
    </ul>
  {/if}
  
  <a href="/add">➕ Ajouter un livre</a>
  
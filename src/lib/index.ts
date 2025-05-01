// src/lib/index.ts
export type Book = {
    isbn: string;
    title: string;
    authors: string[];
    publicationDate: string; // ISO ex. "2024-04-28"
    summary?: string;
    pageCount: number;
};

export async function fetchBooks(): Promise<Book[]> {
    const res = await fetch('/catalogue/books');

    if (!res.ok) {
        throw new Error(`Erreur lors de la récupération des livres : ${res.statusText}`);
    }

    return await res.json();
}

export async function fetchBookByIsbn(isbn: string): Promise<Book> {
    const res = await fetch(`/catalogue/books/${isbn}`);

    if (!res.ok) {
        throw new Error(`Livre non trouvé (ISBN: ${isbn}).`);
    }

    return await res.json();
}

export async function deleteBook(isbn: string): Promise<void> {
    const res = await fetch(`/catalogue/books/${isbn}`, {
        method: 'DELETE',
    });

    if (!res.ok) {
        throw new Error(`Échec de la suppression du livre (ISBN: ${isbn})`);
    }
}

export async function searchBookByTitleOrAuthor(query: string): Promise<Book[]> {
	const [byTitle, byAuthor] = await Promise.all([
		fetch(`/catalogue/books/search?title=${encodeURIComponent(query)}`),
		fetch(`/catalogue/books/search?author=${encodeURIComponent(query)}`)
	]);

    const [titleResults, authorResults] = await Promise.all([
		byTitle.json(),
		byAuthor.json()
	]);

    const seen = new Set<string>();
	const combined: Book[] = [];

	for (const book of [...titleResults, ...authorResults]) {
		if (!seen.has(book.isbn)) {
			seen.add(book.isbn);
			combined.push(book);
		}
	}

	return combined;
}
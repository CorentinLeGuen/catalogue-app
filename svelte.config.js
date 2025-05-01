import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: { adapter: adapter({
		edge: false,
		split: false,
	}) },
	extensions: ['.svelte', '.svx']
};

export default config;

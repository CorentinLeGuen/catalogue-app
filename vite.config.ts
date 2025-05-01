import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		proxy: {
			'/ai': {
				target: process.env.VITE_API_CATALOGUE_AI,
				changeOrigin: true,
				rewrite: path => path.replace(/^\/ai/, '')
			},
			'/catalogue': {
				target: process.env.VITE_API_CATALOGUE,
				changeOrigin: true,
				rewrite: path => path.replace(/^\/catalogue/, '')
			}
		}
	}
});

import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(() => {
  const base = process.env.PREVIEW_BASE;

  return {
    base,
    plugins: [svelte(), tailwindcss()],
  };
});

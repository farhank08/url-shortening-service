import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],

	// Use root node modules as cache directory
	cacheDir: '../node_modules/.vite-client',
});

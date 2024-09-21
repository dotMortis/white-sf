import preact from '@preact/preset-vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    root: 'src/',
    plugins: [preact()],
    build: {
        outDir: '../dist'
    },
    test: {
        include: ['tests/**/*.spec.ts'],
        passWithNoTests: true,
        watch: false
    }
});

import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/scss/app.scss',
                'resources/js/timer.js',
                'resources/js/list.js',
                'resources/js/menu.js',
            ],
            refresh: true,
        }),
    ],
});

/**
 * vite.config.js — Configuración de Vite (bundler/dev server).
 *
 * EQUIVALENTE ANGULAR: angular.json — El archivo de configuración del CLI de Angular.
 *
 * Vite es el bundler que usa esta app React. Es MUY rápido porque usa:
 * - ESModules nativos del navegador en desarrollo (no bundlea todo)
 * - Rollup para producción
 *
 * ANGULAR usa Webpack (o esbuild en v17+) como bundler.
 *
 * Plugins:
 * - @vitejs/plugin-react: Habilita JSX, Fast Refresh (HMR) y otras features de React.
 *   ANGULAR equivalente: El CLI de Angular ya tiene todo esto built-in.
 *
 * https://vitejs.dev/config/
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Puedes agregar más config aquí:
  // server: { port: 3000 }  → como "ng serve --port 3000"
  // build: { outDir: 'dist' } → como "outputPath" en angular.json
})

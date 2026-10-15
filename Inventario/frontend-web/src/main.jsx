/**
 * main.jsx — Punto de entrada de la aplicación React.
 *
 * EQUIVALENTE EN ANGULAR: Este archivo es el equivalente a "main.ts" en Angular.
 * En Angular tienes:   platformBrowserDynamic().bootstrapModule(AppModule)
 * En React tienes:     ReactDOM.createRoot(...).render(<App />)
 *
 * - React NO tiene módulos (NgModule). Todo son componentes funcionales.
 * - React.StrictMode es como enableProdMode() pero al revés: activa validaciones
 *   extra en desarrollo (doble renderizado para detectar efectos secundarios).
 * - En Angular importas estilos globales en angular.json (styles:[]).
 *   En React los importas directamente aquí con "import './archivo.css'".
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Estilos globales — equivalente a los "styles" en angular.json
import './index.css'
import './bootstrap-custom.css'

/**
 * Monta la app en el elemento HTML con id="root" (ver index.html).
 * EQUIVALENTE ANGULAR: <app-root></app-root> dentro de index.html
 *
 * React.StrictMode:
 * - NO afecta producción, solo desarrollo.
 * - Detecta usos inseguros de lifecycle methods (ciclos de vida).
 * - En Angular no hay equivalente directo, pero es como tener
 *   el "enableIvy" con validaciones extra habilitadas.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

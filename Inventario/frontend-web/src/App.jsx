/**
 * App.jsx — Componente raíz de la aplicación.
 *
 * EQUIVALENTE EN ANGULAR: Este archivo es como "app.component.ts" + "app-routing.module.ts"
 * combinados en uno solo. En Angular separarías la lógica, el template y el routing.
 * En React, todo vive junto en un solo archivo .jsx (lógica + template).
 *
 * CONCEPTOS CLAVE DE REACT vs ANGULAR:
 *
 * 1. COMPONENTES: En Angular usas clases con @Component. En React son FUNCIONES
 *    que retornan JSX (HTML dentro de JavaScript).
 *
 * 2. useState(): Es el equivalente a declarar una propiedad en la clase del componente
 *    Angular. Ej: en Angular "nombre: string = ''" → en React "const [nombre, setNombre] = useState('')"
 *    - El primer valor es la variable (solo lectura).
 *    - El segundo es la función para cambiarla (como un setter).
 *    - NUNCA modifiques el estado directamente (nombre = 'algo' ❌), usa setNombre('algo') ✅.
 *
 * 3. useEffect(): Es el equivalente a ngOnInit() + ngOnChanges() + ngOnDestroy() de Angular.
 *    - useEffect(() => { ... }, []) → Se ejecuta una vez al montar (como ngOnInit)
 *    - useEffect(() => { ... }, [variable]) → Se ejecuta cuando 'variable' cambia (como ngOnChanges)
 *    - useEffect(() => { return () => cleanup() }, []) → El return es como ngOnDestroy
 *
 * 4. JSX: Es el template. En Angular tienes archivos .html separados. En React, el HTML
 *    se escribe directamente dentro de la función con JavaScript embebido usando {}.
 *    - Angular: *ngIf="condicion" → React: {condicion && <Componente />}
 *    - Angular: [ngClass]="..." → React: className={`clase ${condicion ? 'activa' : ''}`}
 *    - Angular: (click)="metodo()" → React: onClick={() => metodo()}
 *
 * 5. PROPS: Es como los @Input() de Angular. Pasas datos del padre al hijo.
 *    - Angular: <hijo [dato]="valor"></hijo> y en el hijo: @Input() dato: string
 *    - React: <Hijo dato={valor} /> y en el hijo: function Hijo({ dato }) { ... }
 *
 * 6. NO HAY SERVICIOS: React no tiene un sistema de inyección de dependencias como Angular.
 *    En su lugar usas: funciones auxiliares, hooks personalizados, o Context API.
 */

import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import './index.css'

/**
 * THEMES — Objeto de configuración de temas visuales.
 * EQUIVALENTE ANGULAR: Sería un archivo de constantes o un servicio de temas.
 * Aquí se define fuera del componente porque es estático (no cambia) y no necesita
 * ser parte del estado. En Angular sería un archivo "themes.constant.ts" inyectable.
 */
const THEMES = {
  violet: {
    id: 'violet',
    name: 'Violeta Cósmico',
    color: '#8b5cf6',
    bg: 'radial-gradient(circle at top right, #1a153b 0%, #0d0e1b 100%)',
    glassBg: 'rgba(18, 20, 38, 0.55)',
  },
  ocean: {
    id: 'ocean',
    name: 'Azul Océano',
    color: '#3b82f6',
    bg: 'radial-gradient(circle at top right, #0b1a30 0%, #050a12 100%)',
    glassBg: 'rgba(11, 26, 48, 0.55)',
  },
  emerald: {
    id: 'emerald',
    name: 'Verde Esmeralda',
    color: '#10b981',
    bg: 'radial-gradient(circle at top right, #08241b 0%, #030a07 100%)',
    glassBg: 'rgba(8, 36, 27, 0.55)',
  },
  amber: {
    id: 'amber',
    name: 'Atardecer Ámbar',
    color: '#f59e0b',
    bg: 'radial-gradient(circle at top right, #2d1b02 0%, #0e0a03 100%)',
    glassBg: 'rgba(45, 27, 2, 0.55)',
  },
  neon: {
    id: 'neon',
    name: 'Cyberpunk Neón',
    color: '#ff007f',
    bg: 'radial-gradient(circle at top right, #24051a 0%, #080209 100%)',
    glassBg: 'rgba(36, 5, 26, 0.55)',
  }
}

/**
 * COMPONENTE App — Componente raíz (equivalente a AppComponent en Angular).
 *
 * Este componente maneja:
 * 1. Autenticación (si hay usuario logueado o no)
 * 2. Selección de tema visual
 * 3. Routing simple: muestra Login o Dashboard según si hay sesión
 *
 * NOTA: En Angular usarías el Router module para navegar entre Login y Dashboard.
 * Aquí en React se hace con un renderizado condicional:
 *   - Si hay user → muestra <Dashboard />
 *   - Si no hay user → muestra <Login />
 * Esto es el equivalente más simple a un AuthGuard de Angular.
 */
function App() {
  /**
   * useState con función inicializadora (lazy initialization).
   * La función dentro de useState(() => ...) se ejecuta SOLO la primera vez
   * que el componente se monta (como el constructor en Angular).
   *
   * Aquí intenta recuperar el usuario desde localStorage.
   * EQUIVALENTE ANGULAR: Sería un servicio AuthService que en su constructor
   * lee de localStorage para mantener la sesión.
   */
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('inv_user')
      return stored ? JSON.parse(stored) : null
    } catch { return null }
  })

  /**
   * Estado del tema seleccionado. Lee de localStorage la preferencia del usuario.
   * Si no hay preferencia guardada, usa 'violet' como tema por defecto.
   */
  const [themeId, setThemeId] = useState(() => {
    try {
      const stored = localStorage.getItem('inv_user')
      if (stored) {
        const u = JSON.parse(stored)
        return localStorage.getItem(`theme_id_${u.id || u.correo}`) || 'violet'
      }
    } catch {}
    return 'violet'
  })

  /**
   * useEffect — Se ejecuta cada vez que 'themeId' o 'user' cambian.
   *
   * EQUIVALENTE ANGULAR: Sería un ngOnChanges() que detecta cambios en propiedades,
   * O un BehaviorSubject en un servicio de temas al que te suscribes.
   *
   * Lo que hace: Aplica las variables CSS del tema seleccionado al :root del documento.
   * Esto cambia dinámicamente los colores de toda la app sin recargar.
   *
   * En Angular harías esto con Renderer2.setStyle() o manipulando el DOM directamente.
   */
  useEffect(() => {
    const applyTheme = (tId) => {
      const t = THEMES[tId] || THEMES.violet
      const root = document.documentElement;
      
      // Establece las variables CSS globales con el color del tema
      root.style.setProperty('--bs-primary', t.color);
      root.style.setProperty('--purple-accent', t.color);
      
      // Convierte el color HEX a valores RGB para poder usarlo con opacidad
      let hex = t.color.replace('#', '');
      if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }
      const r = parseInt(hex.substring(0, 2), 16) || 139;
      const g = parseInt(hex.substring(2, 4), 16) || 92;
      const b = parseInt(hex.substring(4, 6), 16) || 246;
      
      root.style.setProperty('--bs-primary-rgb', `${r}, ${g}, ${b}`);
      root.style.setProperty('--purple-glow', `rgba(${r}, ${g}, ${b}, 0.15)`);
      root.style.setProperty('--body-bg', t.bg);
      root.style.setProperty('--glass-bg', t.glassBg);
    }

    applyTheme(themeId)
    
    // Guarda la preferencia del tema en localStorage (por usuario)
    if (user) {
      localStorage.setItem(`theme_id_${user.id || user.correo}`, themeId)
    }
  }, [themeId, user]) // ← Array de dependencias: se re-ejecuta cuando cambian estas variables

  /**
   * handleLogin — Callback que se pasa como @Output/EventEmitter al componente Login.
   *
   * EQUIVALENTE ANGULAR:
   *   En Login.component.ts: @Output() onLogin = new EventEmitter<{user, token}>();
   *   En app.component.html: <app-login (onLogin)="handleLogin($event)"></app-login>
   *
   * En React:
   *   Se pasa como prop: <Login onLogin={handleLogin} />
   *   El hijo lo ejecuta: props.onLogin(userData, token)
   */
  const handleLogin = (userData, token) => {
    localStorage.setItem('inv_token', token)
    localStorage.setItem('inv_user', JSON.stringify(userData))
    setUser(userData)
    
    // Recupera el tema previamente seleccionado por este usuario
    const userTheme = localStorage.getItem(`theme_id_${userData.id || userData.correo}`) || 'violet'
    setThemeId(userTheme)
  }

  /**
   * handleLogout — Limpia la sesión y vuelve al Login.
   * Elimina token y datos del usuario de localStorage.
   * Al hacer setUser(null), React re-renderiza y muestra el Login automáticamente.
   */
  const handleLogout = () => {
    localStorage.removeItem('inv_token')
    localStorage.removeItem('inv_user')
    setUser(null)
    setThemeId('violet') // Resetea el tema al predeterminado
  }

  /**
   * RENDERIZADO CONDICIONAL — El equivalente a *ngIf en Angular.
   *
   * En Angular:
   *   <app-dashboard *ngIf="user; else loginTemplate" [user]="user"></app-dashboard>
   *   <ng-template #loginTemplate><app-login></app-login></ng-template>
   *
   * En React:
   *   return user ? <Dashboard ... /> : <Login ... />
   *
   * Si 'user' tiene valor (está logueado) → muestra Dashboard.
   * Si 'user' es null → muestra Login.
   *
   * Las props que se pasan son equivalentes a los @Input() de Angular:
   *   - user={user} → como [user]="user"
   *   - onLogout={handleLogout} → como (onLogout)="handleLogout()" (@Output)
   *   - themeId={themeId} → como [themeId]="themeId"
   *   - onThemeChange={setThemeId} → como (onThemeChange)="setThemeId($event)"
   */
  return user
    ? <Dashboard user={user} onLogout={handleLogout} themeId={themeId} onThemeChange={setThemeId} />
    : <Login onLogin={handleLogin} />
}

/**
 * export default App — Exporta el componente para que main.jsx lo pueda importar.
 * EQUIVALENTE ANGULAR: Es como declarar el componente en el @NgModule exports:[].
 */
export default App

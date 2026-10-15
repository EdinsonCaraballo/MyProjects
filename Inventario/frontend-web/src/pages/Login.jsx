/**
 * Login.jsx — Página de inicio de sesión.
 *
 * EQUIVALENTE ANGULAR: login.component.ts + login.component.html + login.component.css
 * En React todo está en un solo archivo .jsx.
 *
 * PATRÓN DE FORMULARIO:
 * - Angular usa Reactive Forms (FormGroup, FormControl) o Template-driven (ngModel).
 * - React usa "componentes controlados": cada input tiene value={state} + onChange={setState}.
 *   No hay FormGroup ni validadores built-in. Las validaciones se hacen manualmente o con libs.
 *
 * COMUNICACIÓN PADRE ↔ HIJO:
 * - El prop "onLogin" es como un @Output() EventEmitter en Angular.
 * - Cuando el login es exitoso, se llama onLogin(user, token) que notifica al componente padre (App).
 */

import { useState } from 'react'

/**
 * URL base de la API. Lee de variables de entorno de Vite.
 * ANGULAR equivalente: environment.ts → environment.apiUrl
 * VITE equivalente: archivos .env con prefijo VITE_ (import.meta.env.VITE_*)
 */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8765'

/**
 * Componente Login — Recibe la prop "onLogin" del padre (App.jsx).
 *
 * La desestructuración { onLogin } es como tener @Input() onLogin en Angular,
 * pero en este caso funciona como @Output() porque es una función callback.
 *
 * En Angular:
 *   @Output() onLogin = new EventEmitter<{user: any, token: string}>();
 *   this.onLogin.emit({ user: data.user, token: data.access });
 *
 * En React:
 *   props.onLogin(data.user, data.access)  // Llama directamente la función del padre
 */
export default function Login({ onLogin }) {
  /**
   * Estados del formulario — Cada campo es un useState independiente.
   *
   * ANGULAR con Reactive Forms sería:
   *   this.loginForm = new FormGroup({
   *     correo: new FormControl(''),
   *     password: new FormControl(''),
   *   });
   *
   * ANGULAR con Template-driven sería:
   *   <input [(ngModel)]="correo">
   *
   * REACT — Componentes controlados (cada uno con su getter/setter):
   */
  const [correo, setCorreo]     = useState('')    // Email del usuario
  const [password, setPassword] = useState('')    // Contraseña
  const [showPwd, setShowPwd]   = useState(false) // Toggle para mostrar/ocultar contraseña
  const [loading, setLoading]   = useState(false) // Estado de carga del botón submit
  const [error, setError]       = useState('')    // Mensaje de error

  /**
   * handleSubmit — Maneja el envío del formulario.
   *
   * ANGULAR equivalente: onSubmit() en el componente con this.http.post(...)
   *
   * Diferencias clave:
   * - Angular usa HttpClient (this.http.post) que devuelve Observables (RxJS).
   * - React usa fetch() nativo que devuelve Promises (async/await).
   * - Angular: subscribe(data => ..., error => ...) → React: try/catch con await
   *
   * El "async" antes de la función permite usar "await" dentro.
   * e.preventDefault() evita que el formulario recargue la página (como en Angular).
   */
  const handleSubmit = async (e) => {
    e.preventDefault()   // Previene el submit nativo del navegador (recarga)
    setError('')         // Limpia errores previos
    setLoading(true)     // Activa el spinner del botón

    try {
      /**
       * Llamada HTTP al backend — equivalente a this.http.post() en Angular.
       *
       * ANGULAR:
       *   this.http.post<any>(`${environment.apiUrl}/api/auth/login/`, { correo, password })
       *     .subscribe(data => { ... }, error => { ... });
       *
       * REACT con fetch:
       *   const res = await fetch(url, { method, headers, body })
       *   const data = await res.json()
       */
      const res = await fetch(`${API_URL}/api/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, password }), // Convierte a JSON string
      })
      const data = await res.json() // Parsea la respuesta JSON

      // Si la respuesta no es OK (status 4xx o 5xx)
      if (!res.ok) {
        setError(data.detail || 'Error al iniciar sesión.')
        return
      }

      /**
       * Login exitoso — Notifica al padre (App.jsx) con los datos del usuario.
       * ANGULAR: this.onLogin.emit({ user: data.user, token: data.access })
       * REACT: onLogin(data.user, data.access) — llama directamente la función prop
       */
      onLogin(data.user, data.access)
    } catch {
      // Error de red (servidor caído, sin internet, etc.)
      setError('No se pudo conectar con el servidor. Verifique su conexión.')
    } finally {
      setLoading(false) // Siempre desactiva el spinner, haya o no error
    }
  }

  /**
   * JSX — Template del componente.
   * En Angular esto iría en login.component.html
   */
  return (
    /* Contenedor full-screen centrado con animación de entrada */
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center py-5 fade-in-up">
      <div className="row w-100 justify-content-center">
        <div className="col-12 col-md-10 col-lg-8 col-xl-7">
          {/* Card principal con efecto glassmorphism */}
          <div className="row g-0 glass-card overflow-hidden">

            {/* ── Columna Izquierda: Branding (oculta en móvil con d-none d-md-flex) ── */}
            {/* ANGULAR: Esto sería una sección del template con [ngClass] para responsive */}
            <div className="col-md-6 p-5 d-none d-md-flex flex-column justify-content-between bg-dark bg-gradient bg-opacity-25 border-end border-secondary border-opacity-10">
              <div>
                {/* Logo y título de la app */}
                <div className="d-flex align-items-center gap-2 mb-4">
                  <div className="bg-primary rounded-3 p-2 d-inline-flex">
                    <i className="bi bi-box-seam-fill text-white fs-3"></i>
                  </div>
                  <h2 className="mb-0 fw-extrabold text-light">Inventario<span className="text-primary">Pro</span></h2>
                </div>
                <p className="text-secondary small mb-5">Sistema de Gestión e Inventario Empresarial</p>

                {/*
                  Lista de features — Usa .map() para iterar (como *ngFor en Angular).
                  Cada feature tiene ícono y texto descriptivo.
                */}
                <div className="d-flex flex-column gap-3">
                  {[
                    { icon: 'bi-box-seam', label: 'Control de inventario en tiempo real' },
                    { icon: 'bi-cart', label: 'Gestión de pedidos y delivery' },
                    { icon: 'bi-graph-up-arrow', label: 'Reportes y analítica avanzada' },
                    { icon: 'bi-shield-lock', label: 'Seguridad y control de accesos' },
                  ].map((f, i) => (
                    <div key={i} className="d-flex align-items-center gap-3">
                      <span className="bg-secondary bg-opacity-10 text-primary rounded-circle p-2 d-inline-flex">
                        <i className={`bi ${f.icon} fs-6`}></i>
                      </span>
                      <span className="small text-secondary-emphasis">{f.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Indicador de servidor en línea */}
              <div className="d-flex align-items-center gap-2 text-success small pt-4">
                <span className="spinner-grow spinner-grow-sm text-success" role="status" aria-hidden="true"></span>
                <span>Servidor en línea</span>
              </div>
            </div>

            {/* ── Columna Derecha: Formulario de Login ── */}
            <div className="col-md-6 p-4 p-lg-5 d-flex flex-column justify-content-center">
              <div className="mb-4">
                <h3 className="fw-bold text-white mb-2">Bienvenido de vuelta</h3>
                <p className="text-secondary small mb-0">Ingresa tus credenciales para continuar</p>
              </div>

              {/*
                Formulario — onSubmit es como (ngSubmit) en Angular.
                noValidate desactiva la validación HTML5 nativa del navegador.
              */}
              <form onSubmit={handleSubmit} noValidate>
                {/*
                  Alerta de error — renderizado condicional.
                  ANGULAR: *ngIf="error"
                  REACT: {error && (...)}
                */}
                {error && (
                  <div className="alert alert-danger bg-danger bg-opacity-10 border-danger border-opacity-25 text-danger small d-flex align-items-center gap-2" role="alert">
                    <i className="bi bi-exclamation-triangle-fill"></i>
                    <span>{error}</span>
                  </div>
                )}

                {/* Campo: Correo electrónico */}
                <div className="mb-3">
                  <label className="form-label text-secondary small fw-semibold" htmlFor="correo">Correo electrónico</label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark border-secondary border-opacity-50 text-secondary">
                      <i className="bi bi-envelope"></i>
                    </span>
                    {/*
                      Input controlado:
                      ANGULAR: <input [(ngModel)]="correo"> (two-way binding)
                      REACT: <input value={correo} onChange={e => setCorreo(e.target.value)} />
                      En React NO hay two-way binding. Se usa value + onChange.
                    */}
                    <input
                      id="correo"
                      type="email"
                      className="form-control bg-dark text-light border-secondary border-opacity-50"
                      placeholder="usuario@empresa.com"
                      value={correo}
                      onChange={e => setCorreo(e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                {/* Campo: Contraseña con toggle de visibilidad */}
                <div className="mb-4">
                  <label className="form-label text-secondary small fw-semibold" htmlFor="password">Contraseña</label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark border-secondary border-opacity-50 text-secondary">
                      <i className="bi bi-lock"></i>
                    </span>
                    {/*
                      type dinámico: cambia entre 'text' y 'password' según showPwd.
                      ANGULAR: [type]="showPwd ? 'text' : 'password'"
                      REACT: type={showPwd ? 'text' : 'password'}
                    */}
                    <input
                      id="password"
                      type={showPwd ? 'text' : 'password'}
                      className="form-control bg-dark text-light border-secondary border-opacity-50"
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                    />
                    {/*
                      Botón para toggle de visibilidad de contraseña.
                      setShowPwd(v => !v) — La función recibe el valor anterior y devuelve el inverso.
                      ANGULAR: (click)="showPwd = !showPwd"
                    */}
                    <button
                      type="button"
                      className="btn btn-outline-secondary border-secondary border-opacity-50"
                      onClick={() => setShowPwd(v => !v)}
                      aria-label="Mostrar u ocultar contraseña"
                    >
                      <i className={`bi ${showPwd ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                </div>

                {/*
                  Botón de submit con estado de carga.
                  disabled={loading} desactiva el botón mientras se procesa.
                  
                  <> ... </> es un "Fragment" de React. Permite agrupar elementos sin
                  agregar un <div> extra al DOM. En Angular no hay equivalente directo,
                  lo más cercano sería <ng-container>.
                */}
                <button
                  type="submit"
                  id="btn-login"
                  className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      Iniciando sesión...
                    </>
                  ) : (
                    <>
                      Iniciar Sesión
                      <i className="bi bi-arrow-right"></i>
                    </>
                  )}
                </button>
              </form>

              {/* Footer con versión */}
              <div className="text-center mt-5 text-secondary small-monospace">
                InventarioPro v1.1 &nbsp;·&nbsp; © 2026
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Dashboard.jsx — Página principal después del login. Contiene el layout de la app.
 *
 * EQUIVALENTE ANGULAR: Como un "layout.component.ts" que incluye:
 * - Sidebar (menú lateral) → como un <app-sidebar> con @Input() menuItems
 * - Top bar (barra superior) → como un <app-header>
 * - Área de contenido → como un <router-outlet> donde se renderizan los módulos
 *
 * DIFERENCIA CON ANGULAR ROUTER:
 * En Angular usarías Routes + RouterModule para navegar entre módulos.
 * Aquí se usa un estado "activeModule" y renderizado condicional:
 *   {activeModule === 'inventario' && <InventarioModule />}
 * Es como tener un switch/case en vez de rutas definidas.
 *
 * PROPS recibidos del padre (App.jsx):
 * - user: datos del usuario logueado (@Input en Angular)
 * - onLogout: callback para cerrar sesión (@Output en Angular)
 * - themeId: tema visual seleccionado (@Input)
 * - onThemeChange: callback para cambiar tema (@Output)
 */

import { useState } from 'react'
import InventarioModule from './modules/InventarioModule'
import UsuariosModule from './modules/UsuariosModule'
import CompanyModule from './modules/CompanyModule'

/**
 * MENU_ITEMS — Definición de los módulos del sistema.
 * ANGULAR equivalente: Sería un array de rutas en app-routing.module.ts, o
 * una constante en un servicio de navegación.
 *
 * Cada item tiene: id (para routing), icon (Bootstrap Icon), label, desc, color, badge
 */
const MENU_ITEMS = [
  {
    id: 'inventario', icon: 'bi-box-seam', label: 'Inventario',
    desc: 'Lotes, productos y stock en tiempo real',
    color: 'text-primary', badge: null,
  },
  {
    id: 'pedidos', icon: 'bi-cart', label: 'Pedidos',
    desc: 'Gestión de órdenes y seguimiento',
    color: 'text-info', badge: '3', // Badge muestra notificaciones pendientes
  },
  {
    id: 'delivery', icon: 'bi-truck', label: 'Delivery',
    desc: 'Rutas, despachos y repartidores',
    color: 'text-success', badge: null,
  },
  {
    id: 'clientes', icon: 'bi-people', label: 'Clientes',
    desc: 'Base de clientes y favoritos',
    color: 'text-warning', badge: null,
  },
  {
    id: 'pagos', icon: 'bi-credit-card', label: 'Pagos',
    desc: 'Métodos de pago y conciliación',
    color: 'text-danger', badge: null,
  },
  {
    id: 'reportes', icon: 'bi-graph-up', label: 'Reportes',
    desc: 'Analítica, métricas y exportación',
    color: 'text-info', badge: null,
  },
  {
    id: 'sucursales', icon: 'bi-shop', label: 'Sucursales',
    desc: 'Sedes, horarios y configuración',
    color: 'text-primary', badge: null,
  },
  {
    id: 'usuarios', icon: 'bi-shield-lock', label: 'Usuarios y Perfiles',
    desc: 'Accesos, permisos y seguridad',
    color: 'text-warning', badge: null,
  },
  {
    id: 'config', icon: 'bi-gear', label: 'Configuración',
    desc: 'Monedas, tasas de cambio y ajustes',
    color: 'text-secondary', badge: null,
  },
]

/**
 * STATS — Datos estáticos del dashboard (tarjetas de resumen).
 * En producción estos vendrían de una API. Aquí están hardcoded como placeholder.
 */
const STATS = [
  { label: 'Productos activos',    value: '10',   icon: 'bi-box', color: 'text-primary' },
  { label: 'Pedidos pendientes',   value: '3',    icon: 'bi-cart-check', color: 'text-info' },
  { label: 'Sucursales',           value: '6',    icon: 'bi-building-down', color: 'text-success' },
  { label: 'Lotes por vencer',     value: '1',    icon: 'bi-exclamation-triangle-fill', color: 'text-warning' },
]

/**
 * Componente Dashboard — Layout principal con sidebar + contenido.
 *
 * Desestructuración de props:
 * { user, onLogout, themeId, onThemeChange }
 * ANGULAR equivalente:
 *   @Input() user: any;
 *   @Output() onLogout = new EventEmitter();
 *   @Input() themeId: string;
 *   @Output() onThemeChange = new EventEmitter<string>();
 */
export default function Dashboard({ user, onLogout, themeId, onThemeChange }) {
  /**
   * activeModule — Controla qué módulo se muestra en el área de contenido.
   * null = muestra la vista de Dashboard (home).
   * 'inventario' = muestra <InventarioModule />
   * ANGULAR equivalente: Sería la ruta activa del Router.
   */
  const [activeModule, setActiveModule] = useState(null)

  /**
   * sidebarOpen — Controla la visibilidad del sidebar en móvil.
   * En desktop siempre está visible. En móvil se muestra/oculta con un botón hamburguesa.
   */
  const [sidebarOpen, setSidebarOpen]   = useState(false)

  // Saludo dinámico según la hora del día
  const now = new Date()
  const hora = now.getHours()
  const greeting = hora < 12 ? 'Buenos días' : hora < 18 ? 'Buenas tardes' : 'Buenas noches'

  return (
    <div className="container-fluid p-0 d-flex align-items-stretch min-vh-100">
      
      {/* ══════════════════════════════════════════════════════════
          SIDEBAR — Menú lateral de navegación
          ANGULAR equivalente: <app-sidebar [menuItems]="menuItems" [activeRoute]="activeModule">
          
          Responsividad:
          - Desktop (lg+): siempre visible con d-lg-flex
          - Móvil: se muestra/oculta con sidebarOpen (d-block / d-none)
          ══════════════════════════════════════════════════════════ */}
      <aside 
        className={`bg-dark border-end border-secondary border-opacity-10 sidebar flex-shrink-0 d-flex flex-column justify-content-between p-3 ${sidebarOpen ? 'd-block' : 'd-none d-lg-flex'}`}
        style={{ width: '270px', minHeight: '100vh', transition: 'all 0.3s' }}
      >
        <div>
          {/* Logo de la app */}
          <div className="d-flex align-items-center gap-2 mb-4 px-2 py-2">
            <div className="bg-primary rounded-3 p-2 d-inline-flex">
              <i className="bi bi-box-seam-fill text-white fs-4"></i>
            </div>
            <h4 className="mb-0 fw-extrabold text-light">Inventario<span className="text-primary">Pro</span></h4>
          </div>

          {/*
            Navegación — Lista de módulos con .map() (como *ngFor en Angular).
            El [ngClass] de Angular aquí es className con template literals.
            El (click) de Angular aquí es onClick.
          */}
          <div className="sidebar-list list-group">
            <p className="text-secondary small font-monospace text-uppercase px-2 mb-2" style={{ letterSpacing: '0.8px' }}>Módulos</p>
            {MENU_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveModule(item.id); setSidebarOpen(false) }}
                className={`list-group-item list-group-item-action d-flex align-items-center gap-3 py-2 ${activeModule === item.id ? 'active' : ''}`}
              >
                <i className={`bi ${item.icon} ${item.color} fs-5`}></i>
                <span className="flex-grow-1 small">{item.label}</span>
                {/* Badge de notificación — solo se muestra si item.badge tiene valor */}
                {item.badge && (
                  <span className="badge bg-danger rounded-pill px-2 py-1" style={{ fontSize: '0.65rem' }}>{item.badge}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Perfil del usuario en el footer del sidebar */}
        <div className="border-top border-secondary border-opacity-25 pt-3 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2 overflow-hidden">
            {/* Avatar con la primera letra del nombre */}
            <div className="bg-primary bg-gradient rounded-3 text-white fw-bold d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px' }}>
              {user.nombre.charAt(0).toUpperCase()}
            </div>
            <div className="d-flex flex-column overflow-hidden" style={{ lineHeight: '1.2' }}>
              <span className="small fw-semibold text-light text-truncate" style={{ maxWidth: '140px' }}>{user.nombre}</span>
              <span className="text-muted" style={{ fontSize: '0.72rem' }}>{user.correo}</span>
            </div>
          </div>
          {/* Botón de logout en el sidebar */}
          <button className="btn btn-outline-danger border-0 p-2" onClick={onLogout} title="Cerrar sesión">
            <i className="bi bi-box-arrow-right fs-5"></i>
          </button>
        </div>
      </aside>

      {/* Overlay oscuro para cerrar sidebar en móvil (como un backdrop de modal) */}
      {sidebarOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-black bg-opacity-50 z-2 d-lg-none"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ══════════════════════════════════════════════════════════
          CONTENIDO PRINCIPAL — Equivalente a <router-outlet> en Angular
          ══════════════════════════════════════════════════════════ */}
      <main className="flex-grow-1 d-flex flex-column bg-transparent">
        
        {/* ── Top Bar / Header ── */}
        <header className="navbar navbar-expand navbar-dark bg-dark bg-gradient bg-opacity-75 border-bottom border-secondary border-opacity-10 px-4 py-3 position-sticky top-0 z-3" style={{ height: '70px' }}>
          <div className="container-fluid p-0 d-flex justify-content-between align-items-center">
            
            <div className="d-flex align-items-center gap-3">
              {/* Botón hamburguesa — solo visible en móvil (d-lg-none) */}
              <button 
                className="btn btn-outline-secondary d-lg-none border-0 p-1"
                onClick={() => setSidebarOpen(v => !v)}
              >
                <i className="bi bi-list fs-4"></i>
              </button>
              
              {/* Título dinámico — muestra el nombre del módulo activo o "Dashboard" */}
              {/*
                ANGULAR: {{ activeModule ? getModuleLabel(activeModule) : 'Dashboard' }}
                REACT: Usa el operador ?. (optional chaining) y find() para buscar el label
              */}
              <h5 className="mb-0 fw-bold text-light">
                {activeModule
                  ? MENU_ITEMS.find(m => m.id === activeModule)?.label
                  : 'Dashboard'}
              </h5>
            </div>

            <div className="d-flex align-items-center gap-4">
              {/* Fecha actual en formato largo español */}
              <span className="text-secondary small d-none d-md-inline-block">
                {now.toLocaleDateString('es-VE', { weekday: 'long', day: 'numeric', month: 'long' })}
              </span>

              <div className="d-flex align-items-center gap-3">
                <span className="text-light small fw-medium">{user.nombre}</span>

                {/*
                  Dropdown de temas — Usa Bootstrap 5 JS nativo (data-bs-toggle="dropdown").
                  ANGULAR equivalente: Un <mat-menu> o un componente dropdown custom.
                */}
                <div className="dropdown">
                  <button 
                    className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-2 dropdown-toggle px-3" 
                    style={{ height: '36px' }}
                    type="button" 
                    id="themeDropdown" 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"
                  >
                    <span>Tema</span>
                    <i className="bi bi-palette-fill text-primary"></i>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end glass-card p-3 shadow-lg border border-secondary border-opacity-25" aria-labelledby="themeDropdown" style={{ minWidth: '240px' }}>
                    <li className="dropdown-header text-secondary small-monospace text-uppercase p-0 mb-3" style={{ letterSpacing: '0.8px' }}>Temas Preestablecidos</li>
                    
                    {/* Lista de temas con .map() */}
                    <div className="d-flex flex-column gap-2">
                      {[
                        { id: 'violet', name: 'Violeta Cósmico', color: '#8b5cf6' },
                        { id: 'ocean', name: 'Azul Océano', color: '#3b82f6' },
                        { id: 'emerald', name: 'Verde Esmeralda', color: '#10b981' },
                        { id: 'amber', name: 'Atardecer Ámbar', color: '#f59e0b' },
                        { id: 'neon', name: 'Cyberpunk Neón', color: '#ff007f' },
                      ].map(t => (
                        <button
                          key={t.id}
                          type="button"
                          className={`btn btn-sm d-flex align-items-center justify-content-between p-2 rounded text-light ${themeId === t.id ? 'bg-primary bg-opacity-20 border border-primary' : 'bg-dark bg-opacity-50 border border-secondary border-opacity-25'}`}
                          style={{ textAlign: 'left' }}
                          onClick={() => onThemeChange(t.id)}
                        >
                          <span className="small">{t.name}</span>
                          <span className="rounded-circle" style={{ backgroundColor: t.color, width: '16px', height: '16px', display: 'inline-block' }} />
                        </button>
                      ))}
                    </div>
                  </ul>
                </div>

                <button className="btn btn-sm btn-outline-secondary" onClick={onLogout}>
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* ══════════════════════════════════════════════════════════
            ÁREA DE VISTA — Donde se renderizan los módulos
            ANGULAR equivalente: <router-outlet></router-outlet>
            
            Aquí se usa renderizado condicional en vez de rutas:
            - !activeModule → muestra el Home/Dashboard
            - activeModule === 'inventario' → muestra <InventarioModule />
            - etc.
            ══════════════════════════════════════════════════════════ */}
        <div className="container-fluid p-4" style={{ maxWidth: '1300px' }}>
          
          {/* ── Vista Home del Dashboard (cuando no hay módulo activo) ── */}
          {!activeModule && (
            <div className="fade-in-up">
              {/* Saludo personalizado */}
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                <div>
                  <h2 className="fw-extrabold text-light mb-1">{greeting}, {user.nombre} 👋</h2>
                  <p className="text-secondary small mb-0">Selecciona un módulo en el menú para comenzar a trabajar.</p>
                </div>
                <div className="badge bg-success bg-opacity-10 border border-success border-opacity-25 text-success p-2 px-3 rounded-pill d-flex align-items-center gap-2 small">
                  <span className="spinner-grow spinner-grow-sm text-success" role="status" aria-hidden="true"></span>
                  Todos los sistemas operativos
                </div>
              </div>

              {/* Tarjetas de estadísticas rápidas */}
              <div className="row g-3 mb-4">
                {STATS.map((s, idx) => (
                  <div key={idx} className="col-12 col-sm-6 col-md-3">
                    <div className="card glass-card p-3 d-flex flex-row align-items-center gap-3 border border-secondary border-opacity-10">
                      <div className={`rounded-3 p-3 bg-secondary bg-opacity-10 ${s.color} d-inline-flex`}>
                        <i className={`bi ${s.icon} fs-4`}></i>
                      </div>
                      <div>
                        <h4 className="fw-bold mb-0 text-white">{s.value}</h4>
                        <span className="text-secondary small">{s.label}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Grid de acceso rápido a módulos — tarjetas clickeables */}
              <div className="mb-3">
                <h6 className="text-secondary text-uppercase small font-monospace" style={{ letterSpacing: '0.8px' }}>Módulos del sistema</h6>
              </div>

              <div className="row g-3">
                {MENU_ITEMS.map(m => (
                  <div key={m.id} className="col-12 col-md-6 col-lg-4">
                    <div 
                      className="card glass-card p-3 h-100 cursor-pointer border border-secondary border-opacity-10 transition hover-scale"
                      onClick={() => setActiveModule(m.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <div className={`rounded-3 p-3 bg-secondary bg-opacity-10 ${m.color} d-inline-flex`}>
                          <i className={`bi ${m.icon} fs-4`}></i>
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="fw-bold text-white mb-1">{m.label}</h6>
                          <p className="text-secondary small mb-0">{m.desc}</p>
                        </div>
                        <i className="bi bi-chevron-right text-secondary fs-6 ms-2"></i>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/*
            ── Renderizado de Módulo Activo ──
            ANGULAR equivalente: <router-outlet> muestra el componente de la ruta activa.
            REACT: Renderizado condicional con && (short-circuit evaluation).
            
            Cada línea es como una ruta en Angular:
              { path: 'inventario', component: InventarioModule }
              { path: 'usuarios', component: UsuariosModule }
              { path: 'config', component: CompanyModule }
          */}
          {activeModule && (
            <div className="fade-in-up">
              {/* Botón "Volver al Dashboard" — como un breadcrumb o botón back */}
              <button className="btn btn-sm btn-outline-secondary mb-4 gap-2 d-inline-flex align-items-center" onClick={() => setActiveModule(null)}>
                <i className="bi bi-arrow-left"></i>
                Volver al Dashboard
              </button>

              {/* Renderiza el módulo correspondiente */}
              {activeModule === 'inventario' && <InventarioModule />}
              {activeModule === 'usuarios' && <UsuariosModule />}
              {activeModule === 'config' && <CompanyModule />}
              
              {/* Módulos que aún no están implementados — muestra placeholder */}
              {!['inventario', 'usuarios', 'config'].includes(activeModule) && (
                <div className="card glass-card text-center py-5">
                  <div className="card-body">
                    <div className="mb-4">
                      <i className={`bi ${MENU_ITEMS.find(m => m.id === activeModule)?.icon} fs-1 text-primary`}></i>
                    </div>
                    <h4 className="fw-bold text-white mb-2">{MENU_ITEMS.find(m => m.id === activeModule)?.label}</h4>
                    <p className="text-secondary mb-4">{MENU_ITEMS.find(m => m.id === activeModule)?.desc}</p>
                    <div className="badge bg-warning bg-opacity-10 border border-warning border-opacity-25 text-warning p-2 px-3 rounded mb-4">
                      <i className="bi bi-cone-striped me-2"></i>
                      Módulo en desarrollo — próximamente disponible
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

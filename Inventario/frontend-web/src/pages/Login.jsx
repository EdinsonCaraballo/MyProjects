import { useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8765'

export default function Login({ onLogin }) {
  const [correo, setCorreo]     = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd]   = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/api/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.detail || 'Error al iniciar sesión.')
        return
      }
      onLogin(data.user, data.access)
    } catch {
      setError('No se pudo conectar con el servidor. Verifique su conexión.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center py-5 fade-in-up">
      <div className="row w-100 justify-content-center">
        <div className="col-12 col-md-10 col-lg-8 col-xl-7">
          <div className="row g-0 glass-card overflow-hidden">
            {/* Left Column: Brand (Hidden on Mobile) */}
            <div className="col-md-6 p-5 d-none d-md-flex flex-column justify-content-between bg-dark bg-gradient bg-opacity-25 border-end border-secondary border-opacity-10">
              <div>
                <div className="d-flex align-items-center gap-2 mb-4">
                  <div className="bg-primary rounded-3 p-2 d-inline-flex">
                    <i className="bi bi-box-seam-fill text-white fs-3"></i>
                  </div>
                  <h2 className="mb-0 fw-extrabold text-light">Inventario<span className="text-primary">Pro</span></h2>
                </div>
                <p className="text-secondary small mb-5">Sistema de Gestión e Inventario Empresarial</p>

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

              <div className="d-flex align-items-center gap-2 text-success small pt-4">
                <span className="spinner-grow spinner-grow-sm text-success" role="status" aria-hidden="true"></span>
                <span>Servidor en línea</span>
              </div>
            </div>

            {/* Right Column: Form */}
            <div className="col-md-6 p-4 p-lg-5 d-flex flex-column justify-content-center">
              <div className="mb-4">
                <h3 className="fw-bold text-white mb-2">Bienvenido de vuelta</h3>
                <p className="text-secondary small mb-0">Ingresa tus credenciales para continuar</p>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                {error && (
                  <div className="alert alert-danger bg-danger bg-opacity-10 border-danger border-opacity-25 text-danger small d-flex align-items-center gap-2" role="alert">
                    <i className="bi bi-exclamation-triangle-fill"></i>
                    <span>{error}</span>
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label text-secondary small fw-semibold" htmlFor="correo">Correo electrónico</label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark border-secondary border-opacity-50 text-secondary">
                      <i className="bi bi-envelope"></i>
                    </span>
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

                <div className="mb-4">
                  <label className="form-label text-secondary small fw-semibold" htmlFor="password">Contraseña</label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark border-secondary border-opacity-50 text-secondary">
                      <i className="bi bi-lock"></i>
                    </span>
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

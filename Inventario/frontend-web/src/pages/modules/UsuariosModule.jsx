import { useState, useEffect } from 'react'
import DataTable from '../../components/DataTable'

export default function UsuariosModule() {
  const [users, setUsers] = useState([])
  const [profiles, setProfiles] = useState([])
  const [modules, setModules] = useState([])
  const [companies, setCompanies] = useState([])
  const [branches, setBranches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [activeTab, setActiveTab] = useState('users') // 'users', 'profiles', or 'modules'
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('user') // 'user', 'profile', or 'module'
  const [isEditing, setIsEditing] = useState(false)
  const [currentId, setCurrentId] = useState(null)

  // Forms states
  const [userForm, setUserForm] = useState({
    nombre: '',
    correo: '',
    numero_documento: '',
    tipo_documento: 'V',
    telefono: '',
    password: '',
    fk_estatus: '1',
  })

  const [profileForm, setProfileForm] = useState({
    nombre_perfil: '',
    fk_sucursal: '',
    fk_compania: '',
    fk_estatus: '1',
  })

  const [moduleForm, setModuleForm] = useState({
    nombre_modulo: '',
    fk_estatus: '1',
  })

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8765'

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('inv_token')}`
  })

  const fetchData = async () => {
    setLoading(true)
    setError('')
    try {
      const [resU, resP, resM, resComp, resBranch] = await Promise.all([
        fetch(`${API_URL}/api/usuarios/`, { headers: getHeaders() }),
        fetch(`${API_URL}/api/perfiles/`, { headers: getHeaders() }),
        fetch(`${API_URL}/api/modulos/`, { headers: getHeaders() }),
        fetch(`${API_URL}/api/companies/`, { headers: getHeaders() }),
        fetch(`${API_URL}/api/sucursales/`, { headers: getHeaders() }),
      ])

      if (!resU.ok || !resP.ok || !resM.ok) throw new Error('Error al cargar datos de control de acceso')

      const dataU = await resU.json()
      const dataP = await resP.json()
      const dataM = await resM.json()
      const dataComp = resComp.ok ? await resComp.json() : []
      const dataBranch = resBranch.ok ? await resBranch.json() : []

      setUsers(dataU)
      setProfiles(dataP)
      setModules(dataM)
      setCompanies(dataComp)
      setBranches(dataBranch)
    } catch (err) {
      setError(err.message || 'Error al conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleOpenUserModal = (user = null) => {
    setModalType('user')
    if (user) {
      setIsEditing(true)
      setCurrentId(user.id)
      setUserForm({
        nombre: user.nombre || '',
        correo: user.correo || '',
        numero_documento: user.numero_documento || '',
        tipo_documento: user.tipo_documento || 'V',
        telefono: user.telefono || '',
        password: '',
        fk_estatus: user.fk_estatus ? String(user.fk_estatus) : '1',
      })
    } else {
      setIsEditing(false)
      setCurrentId(null)
      setUserForm({
        nombre: '',
        correo: '',
        numero_documento: '',
        tipo_documento: 'V',
        telefono: '',
        password: '',
        fk_estatus: '1',
      })
    }
    setShowModal(true)
  }

  const handleOpenProfileModal = (profile = null) => {
    setModalType('profile')
    if (profile) {
      setIsEditing(true)
      setCurrentId(profile.id)
      setProfileForm({
        nombre_perfil: profile.nombre_perfil || '',
        fk_sucursal: profile.fk_sucursal || '',
        fk_compania: profile.fk_compania || '',
        fk_estatus: profile.fk_estatus ? String(profile.fk_estatus) : '1',
      })
    } else {
      setIsEditing(false)
      setCurrentId(null)
      setProfileForm({
        nombre_perfil: '',
        fk_sucursal: branches[0]?.id || '',
        fk_compania: companies[0]?.id || '',
        fk_estatus: '1',
      })
    }
    setShowModal(true)
  }

  const handleOpenModuleModal = (modulo = null) => {
    setModalType('module')
    if (modulo) {
      setIsEditing(true)
      setCurrentId(modulo.id)
      setModuleForm({
        nombre_modulo: modulo.nombre_modulo || '',
        fk_estatus: modulo.fk_estatus ? String(modulo.fk_estatus) : '1',
      })
    } else {
      setIsEditing(false)
      setCurrentId(null)
      setModuleForm({
        nombre_modulo: '',
        fk_estatus: '1',
      })
    }
    setShowModal(true)
  }

  const handleUserSubmit = async (e) => {
    e.preventDefault()
    const method = isEditing ? 'PUT' : 'POST'
    const url = isEditing ? `${API_URL}/api/usuarios/${currentId}/` : `${API_URL}/api/usuarios/`

    const bodyData = { ...userForm }
    if (!bodyData.password) {
      delete bodyData.password
    }

    try {
      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(bodyData),
      })
      if (!res.ok) throw new Error('Error al guardar el usuario')
      setShowModal(false)
      fetchData()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    const method = isEditing ? 'PUT' : 'POST'
    const url = isEditing ? `${API_URL}/api/perfiles/${currentId}/` : `${API_URL}/api/perfiles/`

    try {
      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(profileForm),
      })
      if (!res.ok) throw new Error('Error al guardar el perfil')
      setShowModal(false)
      fetchData()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleModuleSubmit = async (e) => {
    e.preventDefault()
    const method = isEditing ? 'PUT' : 'POST'
    const url = isEditing ? `${API_URL}/api/modulos/${currentId}/` : `${API_URL}/api/modulos/`

    try {
      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(moduleForm),
      })
      if (!res.ok) throw new Error('Error al guardar el módulo')
      setShowModal(false)
      fetchData()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDelete = async (type, id) => {
    if (!window.confirm('¿Está seguro de eliminar este registro?')) return
    const endpoint = type === 'user' ? 'usuarios' : type === 'profile' ? 'perfiles' : 'modulos'
    const url = `${API_URL}/api/${endpoint}/${id}/`
    try {
      const res = await fetch(url, {
        method: 'DELETE',
        headers: getHeaders()
      })
      if (!res.ok) throw new Error('Error al eliminar')
      fetchData()
    } catch (err) {
      alert(err.message)
    }
  }

  // DataTables columns config
  const userColumns = [
    { key: 'nombre', label: 'Nombre Completo', sortable: true, render: (u) => <strong>{u.nombre}</strong> },
    { key: 'correo', label: 'Correo Electrónico', sortable: true },
    {
      key: 'numero_documento',
      label: 'Documento',
      sortable: true,
      render: (u) => `${u.tipo_documento || 'V'}-${u.numero_documento || 'N/A'}`
    },
    { key: 'telefono', label: 'Teléfono', sortable: true, render: (u) => u.telefono || '-' },
    {
      key: 'fk_estatus',
      label: 'Estatus',
      sortable: true,
      render: (u) => (
        <span className={`badge ${u.fk_estatus === 1 ? 'bg-success bg-opacity-10 text-success border border-success border-opacity-25' : 'bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25'}`}>
          {u.status_name}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Acciones',
      sortable: false,
      render: (u) => (
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-outline-secondary p-1 px-2" onClick={() => handleOpenUserModal(u)}>
            <i className="bi bi-pencil-square"></i>
          </button>
          <button className="btn btn-sm btn-outline-danger p-1 px-2" onClick={() => handleDelete('user', u.id)}>
            <i className="bi bi-trash"></i>
          </button>
        </div>
      )
    }
  ]

  const profileColumns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'nombre_perfil', label: 'Perfil / Rol', sortable: true, render: (p) => <strong>{p.nombre_perfil}</strong> },
    { key: 'company_name', label: 'Compañía', sortable: true, render: (p) => p.company_name || '-' },
    { key: 'sucursal_name', label: 'Sucursal', sortable: true, render: (p) => p.sucursal_name || 'Todas' },
    {
      key: 'actions',
      label: 'Acciones',
      sortable: false,
      render: (p) => (
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-outline-secondary p-1 px-2" onClick={() => handleOpenProfileModal(p)}>
            <i className="bi bi-pencil-square"></i>
          </button>
          <button className="btn btn-sm btn-outline-danger p-1 px-2" onClick={() => handleDelete('profile', p.id)}>
            <i className="bi bi-trash"></i>
          </button>
        </div>
      )
    }
  ]

  const moduleColumns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'nombre_modulo', label: 'Nombre Módulo', sortable: true, render: (m) => <strong>{m.nombre_modulo}</strong> },
    {
      key: 'fk_estatus',
      label: 'Estatus',
      sortable: true,
      render: (m) => (
        <span className={`badge ${m.fk_estatus === 1 ? 'bg-success bg-opacity-10 text-success border border-success border-opacity-25' : 'bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25'}`}>
          {m.status_name || 'Activo'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Acciones',
      sortable: false,
      render: (m) => (
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-outline-secondary p-1 px-2" onClick={() => handleOpenModuleModal(m)}>
            <i className="bi bi-pencil-square"></i>
          </button>
          <button className="btn btn-sm btn-outline-danger p-1 px-2" onClick={() => handleDelete('module', m.id)}>
            <i className="bi bi-trash"></i>
          </button>
        </div>
      )
    }
  ]

  return (
    <div className="fade-in-up">
      {/* Tab Selector */}
      <div className="card glass-card mb-4 border border-secondary border-opacity-10">
        <div className="card-body p-2 d-flex gap-2">
          <button
            className={`btn btn-sm flex-fill py-2 d-flex align-items-center justify-content-center gap-2 ${activeTab === 'users' ? 'btn-primary' : 'btn-outline-secondary border-0'}`}
            onClick={() => setActiveTab('users')}
          >
            <i className="bi bi-people"></i>
            Usuarios
          </button>
          <button
            className={`btn btn-sm flex-fill py-2 d-flex align-items-center justify-content-center gap-2 ${activeTab === 'profiles' ? 'btn-primary' : 'btn-outline-secondary border-0'}`}
            onClick={() => setActiveTab('profiles')}
          >
            <i className="bi bi-shield-check"></i>
            Perfiles
          </button>
          <button
            className={`btn btn-sm flex-fill py-2 d-flex align-items-center justify-content-center gap-2 ${activeTab === 'modules' ? 'btn-primary' : 'btn-outline-secondary border-0'}`}
            onClick={() => setActiveTab('modules')}
          >
            <i className="bi bi-gear-wide-connected"></i>
            Módulos
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger bg-danger bg-opacity-10 border-danger border-opacity-25 text-danger small mb-4" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-5 text-secondary">
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Cargando datos de accesos...
        </div>
      ) : (
        <div>
          {/* Header row */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold text-white mb-0">
              {activeTab === 'users' && 'Usuarios del Sistema'}
              {activeTab === 'profiles' && 'Perfiles y Roles de Acceso'}
              {activeTab === 'modules' && 'Módulos del Sistema'}
            </h5>
            <button
              className="btn btn-primary btn-sm px-3 py-2 d-flex align-items-center gap-2"
              onClick={() => {
                if (activeTab === 'users') handleOpenUserModal()
                if (activeTab === 'profiles') handleOpenProfileModal()
                if (activeTab === 'modules') handleOpenModuleModal()
              }}
            >
              <i className="bi bi-plus-circle"></i>
              Agregar {activeTab === 'users' ? 'Usuario' : activeTab === 'profiles' ? 'Perfil' : 'Módulo'}
            </button>
          </div>

          {/* DataTable render */}
          {activeTab === 'users' && (
            <DataTable
              data={users}
              columns={userColumns}
              searchPlaceholder="Buscar usuario por nombre, correo..."
            />
          )}

          {activeTab === 'profiles' && (
            <DataTable
              data={profiles}
              columns={profileColumns}
              searchPlaceholder="Buscar perfil por nombre, compañía..."
            />
          )}

          {activeTab === 'modules' && (
            <DataTable
              data={modules}
              columns={moduleColumns}
              searchPlaceholder="Buscar módulo por nombre..."
            />
          )}
        </div>
      )}

      {/* Modal Dialog */}
      {showModal && (
        <div className="modal d-block show" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content border border-secondary border-opacity-25 shadow-lg">
              <div className="modal-header border-bottom border-secondary border-opacity-25 p-3">
                <h5 className="modal-title fw-bold text-white">
                  {isEditing ? 'Editar' : 'Agregar'}{' '}
                  {modalType === 'user' && 'Usuario'}
                  {modalType === 'profile' && 'Perfil'}
                  {modalType === 'module' && 'Módulo'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)} aria-label="Close"></button>
              </div>

              {modalType === 'user' && (
                <form onSubmit={handleUserSubmit}>
                  <div className="modal-body p-4 d-flex flex-column gap-3">
                    <div className="form-group">
                      <label className="form-label text-secondary small fw-semibold">Nombre Completo *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={userForm.nombre}
                        onChange={e => setUserForm({...userForm, nombre: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label text-secondary small fw-semibold">Correo Electrónico *</label>
                      <input
                        type="email"
                        className="form-control"
                        value={userForm.correo}
                        onChange={e => setUserForm({...userForm, correo: e.target.value})}
                        required
                      />
                    </div>

                    <div className="row g-2">
                      <div className="col-4">
                        <label className="form-label text-secondary small fw-semibold">Tipo Doc.</label>
                        <select
                          className="form-select"
                          value={userForm.tipo_documento}
                          onChange={e => setUserForm({...userForm, tipo_documento: e.target.value})}
                        >
                          <option value="V">V</option>
                          <option value="E">E</option>
                          <option value="J">J</option>
                          <option value="G">G</option>
                        </select>
                      </div>
                      <div className="col-8">
                        <label className="form-label text-secondary small fw-semibold">Número Documento</label>
                        <input
                          type="text"
                          className="form-control"
                          value={userForm.numero_documento}
                          onChange={e => setUserForm({...userForm, numero_documento: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label text-secondary small fw-semibold">Teléfono</label>
                      <input
                        type="text"
                        className="form-control"
                        value={userForm.telefono}
                        onChange={e => setUserForm({...userForm, telefono: e.target.value})}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label text-secondary small fw-semibold">
                        {isEditing ? 'Nueva Contraseña (dejar vacío para mantener)' : 'Contraseña *'}
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        value={userForm.password}
                        onChange={e => setUserForm({...userForm, password: e.target.value})}
                        required={!isEditing}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label text-secondary small fw-semibold">Estatus</label>
                      <select
                        className="form-select"
                        value={userForm.fk_estatus}
                        onChange={e => setUserForm({...userForm, fk_estatus: e.target.value})}
                      >
                        <option value="1">Activo</option>
                        <option value="2">Inactivo</option>
                      </select>
                    </div>
                  </div>
                  <div className="modal-footer border-top border-secondary border-opacity-25 p-3">
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                    <button type="submit" className="btn btn-sm btn-primary">Guardar</button>
                  </div>
                </form>
              )}

              {modalType === 'profile' && (
                <form onSubmit={handleProfileSubmit}>
                  <div className="modal-body p-4 d-flex flex-column gap-3">
                    <div className="form-group">
                      <label className="form-label text-secondary small fw-semibold">Nombre del Perfil *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={profileForm.nombre_perfil}
                        onChange={e => setProfileForm({...profileForm, nombre_perfil: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label text-secondary small fw-semibold">Compañía *</label>
                      <select
                        className="form-select"
                        value={profileForm.fk_compania}
                        onChange={e => setProfileForm({...profileForm, fk_compania: e.target.value})}
                        required
                      >
                        <option value="">Seleccione...</option>
                        {companies.map(c => (
                          <option key={c.id} value={c.id}>{c.name_razon_social}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label text-secondary small fw-semibold">Sucursal (opcional)</label>
                      <select
                        className="form-select"
                        value={profileForm.fk_sucursal}
                        onChange={e => setProfileForm({...profileForm, fk_sucursal: e.target.value})}
                      >
                        <option value="">Todas las Sucursales</option>
                        {branches.map(b => (
                          <option key={b.id} value={b.id}>{b.nombre_sucursal}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="modal-footer border-top border-secondary border-opacity-25 p-3">
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                    <button type="submit" className="btn btn-sm btn-primary">Guardar</button>
                  </div>
                </form>
              )}

              {modalType === 'module' && (
                <form onSubmit={handleModuleSubmit}>
                  <div className="modal-body p-4 d-flex flex-column gap-3">
                    <div className="form-group">
                      <label className="form-label text-secondary small fw-semibold">Nombre del Módulo *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={moduleForm.nombre_modulo}
                        onChange={e => setModuleForm({...moduleForm, nombre_modulo: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="modal-footer border-top border-secondary border-opacity-25 p-3">
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                    <button type="submit" className="btn btn-sm btn-primary">Guardar</button>
                  </div>
                </form>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  )
}

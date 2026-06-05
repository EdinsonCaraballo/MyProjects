import { useState, useEffect } from 'react'
import DataTable from '../../components/DataTable'

export default function CompanyModule() {
  const [companies, setCompanies] = useState([])
  const [branches, setBranches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Edit / Create Modals State
  const [activeTab, setActiveTab] = useState('company') // 'company' or 'branch'
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('company') // 'company' or 'branch'
  const [isEditing, setIsEditing] = useState(false)
  const [currentId, setCurrentId] = useState(null)

  // Form states
  const [companyForm, setCompanyForm] = useState({
    name_razon_social: '',
    nombre_comercial: '',
    rif_cedula: '',
    direccion_fiscal: '',
    sitio_web: '',
  })

  const [branchForm, setBranchForm] = useState({
    fk_company: '',
    nombre_sucursal: '',
    codigo_sucursal: '',
    ind_principal: false,
    ind_delivery: false,
    location: '',
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
      const [resC, resB] = await Promise.all([
        fetch(`${API_URL}/api/companies/`, { headers: getHeaders() }),
        fetch(`${API_URL}/api/sucursales/`, { headers: getHeaders() })
      ])
      if (!resC.ok || !resB.ok) throw new Error('Error al cargar datos')
      const dataC = await resC.json()
      const dataB = await resB.json()
      setCompanies(dataC)
      setBranches(dataB)
    } catch (err) {
      setError(err.message || 'No se pudo conectar con el servidor.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleOpenCompanyModal = (company = null) => {
    setModalType('company')
    if (company) {
      setIsEditing(true)
      setCurrentId(company.id)
      setCompanyForm({
        name_razon_social: company.name_razon_social || '',
        nombre_comercial: company.nombre_comercial || '',
        rif_cedula: company.rif_cedula || '',
        direccion_fiscal: company.direccion_fiscal || '',
        sitio_web: company.sitio_web || '',
      })
    } else {
      setIsEditing(false)
      setCurrentId(null)
      setCompanyForm({
        name_razon_social: '',
        nombre_comercial: '',
        rif_cedula: '',
        direccion_fiscal: '',
        sitio_web: '',
      })
    }
    setShowModal(true)
  }

  const handleOpenBranchModal = (branch = null) => {
    setModalType('branch')
    if (branch) {
      setIsEditing(true)
      setCurrentId(branch.id)
      setBranchForm({
        fk_company: branch.fk_company || '',
        nombre_sucursal: branch.nombre_sucursal || '',
        codigo_sucursal: branch.codigo_sucursal || '',
        ind_principal: branch.ind_principal || false,
        ind_delivery: branch.ind_delivery || false,
        location: branch.location || '',
      })
    } else {
      setIsEditing(false)
      setCurrentId(null)
      setBranchForm({
        fk_company: companies[0]?.id || '',
        nombre_sucursal: '',
        codigo_sucursal: '',
        ind_principal: false,
        ind_delivery: false,
        location: '',
      })
    }
    setShowModal(true)
  }

  const handleCompanySubmit = async (e) => {
    e.preventDefault()
    const method = isEditing ? 'PUT' : 'POST'
    const url = isEditing ? `${API_URL}/api/companies/${currentId}/` : `${API_URL}/api/companies/`

    try {
      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(companyForm),
      })
      if (!res.ok) throw new Error('Error al guardar la compañía')
      setShowModal(false)
      fetchData()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleBranchSubmit = async (e) => {
    e.preventDefault()
    const method = isEditing ? 'PUT' : 'POST'
    const url = isEditing ? `${API_URL}/api/sucursales/${currentId}/` : `${API_URL}/api/sucursales/`

    try {
      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(branchForm),
      })
      if (!res.ok) throw new Error('Error al guardar la sucursal')
      setShowModal(false)
      fetchData()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDelete = async (type, id) => {
    if (!window.confirm('¿Está seguro de eliminar este registro?')) return
    const url = `${API_URL}/api/${type === 'company' ? 'companies' : 'sucursales'}/${id}/`
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

  // DataTable columns configuration
  const companyColumns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name_razon_social', label: 'Razón Social', sortable: true },
    { key: 'nombre_comercial', label: 'Nombre Comercial', sortable: true },
    { key: 'rif_cedula', label: 'RIF / Cédula', sortable: true },
    { key: 'sitio_web', label: 'Sitio Web', sortable: true },
    {
      key: 'actions',
      label: 'Acciones',
      sortable: false,
      render: (c) => (
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-outline-secondary p-1 px-2" onClick={() => handleOpenCompanyModal(c)}>
            <i className="bi bi-pencil-square"></i>
          </button>
          <button className="btn btn-sm btn-outline-danger p-1 px-2" onClick={() => handleDelete('company', c.id)}>
            <i className="bi bi-trash"></i>
          </button>
        </div>
      )
    }
  ]

  const branchColumns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'nombre_sucursal', label: 'Nombre Sucursal', sortable: true },
    { key: 'codigo_sucursal', label: 'Código', sortable: true },
    {
      key: 'ind_principal',
      label: 'Principal',
      sortable: true,
      render: (b) => (
        <span className={`badge ${b.ind_principal ? 'bg-success bg-opacity-10 text-success border border-success border-opacity-25' : 'bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25'}`}>
          {b.ind_principal ? 'Principal' : 'No'}
        </span>
      )
    },
    {
      key: 'ind_delivery',
      label: 'Delivery',
      sortable: true,
      render: (b) => (
        <span className={`badge ${b.ind_delivery ? 'bg-info bg-opacity-10 text-info border border-info border-opacity-25' : 'bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25'}`}>
          {b.ind_delivery ? 'Sí' : 'No'}
        </span>
      )
    },
    { key: 'company_name', label: 'Compañía', sortable: true },
    {
      key: 'actions',
      label: 'Acciones',
      sortable: false,
      render: (b) => (
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-outline-secondary p-1 px-2" onClick={() => handleOpenBranchModal(b)}>
            <i className="bi bi-pencil-square"></i>
          </button>
          <button className="btn btn-sm btn-outline-danger p-1 px-2" onClick={() => handleDelete('branch', b.id)}>
            <i className="bi bi-trash"></i>
          </button>
        </div>
      )
    }
  ]

  return (
    <div className="fade-in-up">
      {/* Tabs */}
      <div className="card glass-card mb-4 border border-secondary border-opacity-10">
        <div className="card-body p-2 d-flex gap-2">
          <button
            className={`btn btn-sm flex-fill py-2 d-flex align-items-center justify-content-center gap-2 ${activeTab === 'company' ? 'btn-primary' : 'btn-outline-secondary border-0'}`}
            onClick={() => setActiveTab('company')}
          >
            <i className="bi bi-building"></i>
            Compañía
          </button>
          <button
            className={`btn btn-sm flex-fill py-2 d-flex align-items-center justify-content-center gap-2 ${activeTab === 'branch' ? 'btn-primary' : 'btn-outline-secondary border-0'}`}
            onClick={() => setActiveTab('branch')}
          >
            <i className="bi bi-shop"></i>
            Sucursales
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
          Cargando datos organizacionales...
        </div>
      ) : (
        <div>
          {/* Header Row */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold text-white mb-0">
              {activeTab === 'company' ? 'Compañías Registradas' : 'Sucursales Registradas'}
            </h5>
            <button
              className="btn btn-primary btn-sm px-3 py-2 d-flex align-items-center gap-2"
              onClick={() => activeTab === 'company' ? handleOpenCompanyModal() : handleOpenBranchModal()}
            >
              <i className="bi bi-plus-circle"></i>
              Agregar {activeTab === 'company' ? 'Compañía' : 'Sucursal'}
            </button>
          </div>

          {/* DataTable component */}
          {activeTab === 'company' ? (
            <DataTable
              data={companies}
              columns={companyColumns}
              searchPlaceholder="Buscar compañía por nombre, RIF..."
            />
          ) : (
            <DataTable
              data={branches}
              columns={branchColumns}
              searchPlaceholder="Buscar sucursal por código, nombre..."
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
                  {isEditing ? 'Editar' : 'Agregar'} {modalType === 'company' ? 'Compañía' : 'Sucursal'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)} aria-label="Close"></button>
              </div>

              {modalType === 'company' ? (
                <form onSubmit={handleCompanySubmit}>
                  <div className="modal-body p-4 d-flex flex-column gap-3">
                    <div className="form-group">
                      <label className="form-label text-secondary small fw-semibold">Razón Social *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={companyForm.name_razon_social}
                        onChange={e => setCompanyForm({...companyForm, name_razon_social: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label text-secondary small fw-semibold">Nombre Comercial</label>
                      <input
                        type="text"
                        className="form-control"
                        value={companyForm.nombre_comercial}
                        onChange={e => setCompanyForm({...companyForm, nombre_comercial: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label text-secondary small fw-semibold">RIF / Cédula</label>
                      <input
                        type="text"
                        className="form-control"
                        value={companyForm.rif_cedula}
                        onChange={e => setCompanyForm({...companyForm, rif_cedula: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label text-secondary small fw-semibold">Dirección Fiscal</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        value={companyForm.direccion_fiscal}
                        onChange={e => setCompanyForm({...companyForm, direccion_fiscal: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label text-secondary small fw-semibold">Sitio Web</label>
                      <input
                        type="url"
                        className="form-control"
                        value={companyForm.sitio_web}
                        onChange={e => setCompanyForm({...companyForm, sitio_web: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="modal-footer border-top border-secondary border-opacity-25 p-3">
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                    <button type="submit" className="btn btn-sm btn-primary">Guardar</button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleBranchSubmit}>
                  <div className="modal-body p-4 d-flex flex-column gap-3">
                    <div className="form-group">
                      <label className="form-label text-secondary small fw-semibold">Compañía *</label>
                      <select
                        className="form-select"
                        value={branchForm.fk_company}
                        onChange={e => setBranchForm({...branchForm, fk_company: e.target.value})}
                        required
                      >
                        {companies.map(c => (
                          <option key={c.id} value={c.id}>{c.name_razon_social}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label text-secondary small fw-semibold">Nombre de la Sucursal *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={branchForm.nombre_sucursal}
                        onChange={e => setBranchForm({...branchForm, nombre_sucursal: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label text-secondary small fw-semibold">Código de Sucursal</label>
                      <input
                        type="text"
                        className="form-control"
                        value={branchForm.codigo_sucursal}
                        onChange={e => setBranchForm({...branchForm, codigo_sucursal: e.target.value})}
                      />
                    </div>
                    
                    <div className="d-flex gap-4 my-2">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="indPrincipal"
                          checked={branchForm.ind_principal}
                          onChange={e => setBranchForm({...branchForm, ind_principal: e.target.checked})}
                        />
                        <label className="form-check-label text-secondary small fw-semibold" htmlFor="indPrincipal">Sede Principal</label>
                      </div>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="indDelivery"
                          checked={branchForm.ind_delivery}
                          onChange={e => setBranchForm({...branchForm, ind_delivery: e.target.checked})}
                        />
                        <label className="form-check-label text-secondary small fw-semibold" htmlFor="indDelivery">Posee Delivery</label>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label text-secondary small fw-semibold">Ubicación / Dirección</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        value={branchForm.location}
                        onChange={e => setBranchForm({...branchForm, location: e.target.value})}
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

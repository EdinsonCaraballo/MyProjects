/**
 * CompanyModule.jsx — Módulo de gestión de Compañías y Sucursales.
 *
 * EQUIVALENTE ANGULAR: company.module.ts + company.component.ts + company.component.html
 * Este componente maneja un CRUD completo (Crear, Leer, Actualizar, Eliminar)
 * con tabs para alternar entre Compañías y Sucursales.
 *
 * PATRÓN CRUD EN REACT vs ANGULAR:
 *
 * Angular:
 *   - Servicio (CompanyService) con HttpClient para llamadas API
 *   - Componente con inyección de dependencia: constructor(private companyService: CompanyService)
 *   - Observables/RxJS: this.companyService.getAll().subscribe(data => ...)
 *   - Modales con MatDialog o NgbModal
 *
 * React:
 *   - NO hay servicios ni inyección de dependencias
 *   - Las llamadas API se hacen directamente con fetch() dentro del componente
 *   - Se usa async/await en vez de Observables
 *   - Modales se hacen con renderizado condicional (showModal && <div class="modal">)
 *
 * ESTADO DEL COMPONENTE:
 * En Angular tendrías propiedades de clase para todo. En React, cada pieza de estado
 * es un useState independiente. Esto es MÁS verboso pero da control granular sobre
 * qué re-renderiza y qué no.
 */

import { useState, useEffect } from 'react'
import DataTable from '../../components/DataTable'

export default function CompanyModule() {
  // ══════════════════════════════════════════════════════════
  // ESTADOS — Equivalente a propiedades de clase en Angular
  // ══════════════════════════════════════════════════════════

  /** Datos cargados del backend */
  const [companies, setCompanies] = useState([])   // Lista de compañías
  const [branches, setBranches] = useState([])     // Lista de sucursales
  const [loading, setLoading] = useState(true)     // Indicador de carga
  const [error, setError] = useState('')           // Mensaje de error

  /** Control de UI — tabs y modales */
  const [activeTab, setActiveTab] = useState('company')   // Tab activo: 'company' | 'branch'
  const [showModal, setShowModal] = useState(false)       // Visibilidad del modal
  const [modalType, setModalType] = useState('company')   // Tipo de registro en el modal
  const [isEditing, setIsEditing] = useState(false)       // ¿Estamos editando o creando?
  const [currentId, setCurrentId] = useState(null)        // ID del registro que se edita

  /**
   * Estado del formulario de Compañía.
   * ANGULAR equivalente con Reactive Forms:
   *   this.companyForm = this.fb.group({
   *     name_razon_social: [''],
   *     nombre_comercial: [''],
   *     rif_cedula: [''],
   *     direccion_fiscal: [''],
   *     sitio_web: [''],
   *   });
   *
   * En React se maneja como un objeto en useState y se actualiza con spread operator:
   *   setCompanyForm({...companyForm, campo: nuevoValor})
   * Esto es equivalente a: this.companyForm.patchValue({ campo: nuevoValor })
   */
  const [companyForm, setCompanyForm] = useState({
    name_razon_social: '',
    nombre_comercial: '',
    rif_cedula: '',
    direccion_fiscal: '',
    sitio_web: '',
  })

  /** Estado del formulario de Sucursal */
  const [branchForm, setBranchForm] = useState({
    fk_company: '',
    nombre_sucursal: '',
    codigo_sucursal: '',
    ind_principal: false,
    ind_delivery: false,
    location: '',
  })

  // ══════════════════════════════════════════════════════════
  // CONFIGURACIÓN DE API
  // ══════════════════════════════════════════════════════════

  /** URL base de la API (como environment.apiUrl en Angular) */
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8765'

  /**
   * getHeaders — Genera los headers HTTP con el token JWT.
   * ANGULAR equivalente: Un HttpInterceptor que adjunta el token automáticamente.
   * En React no hay interceptors nativos, así que se pasa manualmente en cada llamada.
   */
  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('inv_token')}`
  })

  // ══════════════════════════════════════════════════════════
  // LLAMADAS API — Equivalente a métodos de un servicio Angular
  // ══════════════════════════════════════════════════════════

  /**
   * fetchData — Carga compañías y sucursales del backend en paralelo.
   *
   * ANGULAR equivalente:
   *   forkJoin([
   *     this.http.get<Company[]>('/api/companies/'),
   *     this.http.get<Branch[]>('/api/sucursales/')
   *   ]).subscribe(([companies, branches]) => { ... });
   *
   * REACT equivalente con Promise.all (misma idea que forkJoin de RxJS):
   */
  const fetchData = async () => {
    setLoading(true)
    setError('')
    try {
      // Promise.all ejecuta ambas peticiones en paralelo (como forkJoin en RxJS)
      const [resC, resB] = await Promise.all([
        fetch(`${API_URL}/api/companies/`, { headers: getHeaders() }),
        fetch(`${API_URL}/api/sucursales/`, { headers: getHeaders() })
      ])
      if (!resC.ok || !resB.ok) throw new Error('Error al cargar datos')
      const dataC = await resC.json()
      const dataB = await resB.json()
      setCompanies(dataC)  // Actualiza el estado con los datos recibidos
      setBranches(dataB)
    } catch (err) {
      setError(err.message || 'No se pudo conectar con el servidor.')
    } finally {
      setLoading(false)
    }
  }

  /**
   * useEffect con array vacío [] — Se ejecuta UNA sola vez al montar el componente.
   * ANGULAR equivalente: ngOnInit() { this.fetchData(); }
   */
  useEffect(() => {
    fetchData()
  }, []) // [] = solo al montar (ngOnInit). Sin [] = cada render. [var] = cuando var cambie.

  // ══════════════════════════════════════════════════════════
  // HANDLERS DE MODAL — Abrir modal para crear/editar
  // ══════════════════════════════════════════════════════════

  /**
   * handleOpenCompanyModal — Abre el modal para crear o editar una compañía.
   *
   * Si recibe un objeto company → modo edición (prellenar formulario).
   * Si no recibe nada (null) → modo creación (formulario vacío).
   *
   * ANGULAR equivalente:
   *   this.dialog.open(CompanyModalComponent, {
   *     data: { company: company, isEditing: !!company }
   *   });
   */
  const handleOpenCompanyModal = (company = null) => {
    setModalType('company')
    if (company) {
      // Modo edición — prellenar con datos existentes
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
      // Modo creación — formulario vacío
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
    setShowModal(true) // Muestra el modal
  }

  /** handleOpenBranchModal — Igual que el anterior pero para sucursales */
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
        fk_company: companies[0]?.id || '',  // Pre-selecciona la primera compañía
        nombre_sucursal: '',
        codigo_sucursal: '',
        ind_principal: false,
        ind_delivery: false,
        location: '',
      })
    }
    setShowModal(true)
  }

  // ══════════════════════════════════════════════════════════
  // HANDLERS DE SUBMIT — Guardar (crear/actualizar)
  // ══════════════════════════════════════════════════════════

  /**
   * handleCompanySubmit — Envía el formulario de compañía al backend.
   *
   * Determina dinámicamente si es POST (crear) o PUT (actualizar) según isEditing.
   *
   * ANGULAR equivalente:
   *   if (this.isEditing) {
   *     this.http.put(`/api/companies/${this.currentId}/`, this.companyForm.value).subscribe(...)
   *   } else {
   *     this.http.post('/api/companies/', this.companyForm.value).subscribe(...)
   *   }
   */
  const handleCompanySubmit = async (e) => {
    e.preventDefault()  // Previene el reload del navegador
    const method = isEditing ? 'PUT' : 'POST'
    const url = isEditing ? `${API_URL}/api/companies/${currentId}/` : `${API_URL}/api/companies/`

    try {
      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(companyForm), // Serializa el formulario a JSON
      })
      if (!res.ok) throw new Error('Error al guardar la compañía')
      setShowModal(false) // Cierra el modal
      fetchData()         // Recarga los datos (refresca la tabla)
    } catch (err) {
      alert(err.message)
    }
  }

  /** handleBranchSubmit — Igual que el anterior pero para sucursales */
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

  /**
   * handleDelete — Elimina un registro (compañía o sucursal).
   * window.confirm() muestra un diálogo de confirmación nativo del navegador.
   *
   * ANGULAR equivalente:
   *   const dialogRef = this.dialog.open(ConfirmDialogComponent);
   *   dialogRef.afterClosed().subscribe(result => {
   *     if (result) this.http.delete(`/api/companies/${id}/`).subscribe(...)
   *   });
   */
  const handleDelete = async (type, id) => {
    if (!window.confirm('¿Está seguro de eliminar este registro?')) return
    const url = `${API_URL}/api/${type === 'company' ? 'companies' : 'sucursales'}/${id}/`
    try {
      const res = await fetch(url, {
        method: 'DELETE',
        headers: getHeaders()
      })
      if (!res.ok) throw new Error('Error al eliminar')
      fetchData() // Recarga la tabla
    } catch (err) {
      alert(err.message)
    }
  }

  // ══════════════════════════════════════════════════════════
  // CONFIGURACIÓN DE COLUMNAS PARA DataTable
  // ══════════════════════════════════════════════════════════

  /**
   * companyColumns — Define las columnas de la tabla de compañías.
   * Se pasan como prop al componente DataTable.
   *
   * ANGULAR equivalente: Sería la configuración de matColumnDef en mat-table, o
   * la configuración de columnas en un DataTable de PrimeNG/AG Grid.
   *
   * - key: nombre del campo en el objeto de datos
   * - label: encabezado de la columna
   * - sortable: si permite ordenar por esta columna
   * - render: función para personalizar el contenido de la celda (como ng-template)
   */
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
      /** render — Función que personaliza la celda. Recibe el row completo.
       *  Renderiza botones de editar y eliminar con sus handlers.
       *  ANGULAR: Sería un <ng-template let-row> con botones que llaman métodos del componente. */
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

  /** branchColumns — Columnas para la tabla de sucursales */
  const branchColumns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'nombre_sucursal', label: 'Nombre Sucursal', sortable: true },
    { key: 'codigo_sucursal', label: 'Código', sortable: true },
    {
      key: 'ind_principal',
      label: 'Principal',
      sortable: true,
      /** render con badge condicional — como [ngClass] con condición en Angular */
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

  // ══════════════════════════════════════════════════════════
  // JSX — Template del componente (en Angular sería company.component.html)
  // ══════════════════════════════════════════════════════════
  return (
    <div className="fade-in-up">
      {/* ── Tabs: Compañía / Sucursales ── */}
      {/* ANGULAR: Esto sería un <mat-tab-group> o ngb-tabset */}
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

      {/* Alerta de error — *ngIf="error" en Angular */}
      {error && (
        <div className="alert alert-danger bg-danger bg-opacity-10 border-danger border-opacity-25 text-danger small mb-4" role="alert">
          {error}
        </div>
      )}

      {/* Estado de carga — *ngIf="loading; else content" en Angular */}
      {loading ? (
        <div className="text-center py-5 text-secondary">
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Cargando datos organizacionales...
        </div>
      ) : (
        <div>
          {/* Header con título y botón de agregar */}
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

          {/*
            DataTable — Componente reutilizable que recibe data y columns como props.
            ANGULAR equivalente: <app-data-table [data]="companies" [columns]="companyColumns">
          */}
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

      {/*
        ══════════════════════════════════════════════════════════
        MODAL — Formulario de crear/editar compañía o sucursal.
        
        ANGULAR equivalente: MatDialog.open(ModalComponent, config)
        
        En React los modales se hacen con renderizado condicional:
          {showModal && <div className="modal">...</div>}
        Cuando showModal es false, el modal NO existe en el DOM.
        Cuando es true, se renderiza y el backdrop se muestra.
        ══════════════════════════════════════════════════════════
      */}
      {showModal && (
        <div className="modal d-block show" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content border border-secondary border-opacity-25 shadow-lg">
              {/* Header del modal con título dinámico */}
              <div className="modal-header border-bottom border-secondary border-opacity-25 p-3">
                <h5 className="modal-title fw-bold text-white">
                  {isEditing ? 'Editar' : 'Agregar'} {modalType === 'company' ? 'Compañía' : 'Sucursal'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)} aria-label="Close"></button>
              </div>

              {/* Formulario de Compañía o Sucursal según modalType */}
              {modalType === 'company' ? (
                <form onSubmit={handleCompanySubmit}>
                  <div className="modal-body p-4 d-flex flex-column gap-3">
                    <div className="form-group">
                      <label className="form-label text-secondary small fw-semibold">Razón Social *</label>
                      {/*
                        Input controlado con spread operator para actualizar:
                        ANGULAR: <input formControlName="name_razon_social">
                        REACT: <input value={form.campo} onChange={e => setForm({...form, campo: valor})}>
                        
                        El spread {...companyForm} copia todas las propiedades existentes
                        y solo sobrescribe la que cambia. Como patchValue() en Angular.
                      */}
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
                      <input type="text" className="form-control"
                        value={companyForm.nombre_comercial}
                        onChange={e => setCompanyForm({...companyForm, nombre_comercial: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label text-secondary small fw-semibold">RIF / Cédula</label>
                      <input type="text" className="form-control"
                        value={companyForm.rif_cedula}
                        onChange={e => setCompanyForm({...companyForm, rif_cedula: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label text-secondary small fw-semibold">Dirección Fiscal</label>
                      <textarea className="form-control" rows="2"
                        value={companyForm.direccion_fiscal}
                        onChange={e => setCompanyForm({...companyForm, direccion_fiscal: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label text-secondary small fw-semibold">Sitio Web</label>
                      <input type="url" className="form-control"
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
                /* Formulario de Sucursal */
                <form onSubmit={handleBranchSubmit}>
                  <div className="modal-body p-4 d-flex flex-column gap-3">
                    <div className="form-group">
                      <label className="form-label text-secondary small fw-semibold">Compañía *</label>
                      <select className="form-select"
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
                      <input type="text" className="form-control"
                        value={branchForm.nombre_sucursal}
                        onChange={e => setBranchForm({...branchForm, nombre_sucursal: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label text-secondary small fw-semibold">Código de Sucursal</label>
                      <input type="text" className="form-control"
                        value={branchForm.codigo_sucursal}
                        onChange={e => setBranchForm({...branchForm, codigo_sucursal: e.target.value})}
                      />
                    </div>
                    
                    {/* Switches toggle — como mat-slide-toggle en Angular Material */}
                    <div className="d-flex gap-4 my-2">
                      <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox" role="switch" id="indPrincipal"
                          checked={branchForm.ind_principal}
                          onChange={e => setBranchForm({...branchForm, ind_principal: e.target.checked})}
                        />
                        <label className="form-check-label text-secondary small fw-semibold" htmlFor="indPrincipal">Sede Principal</label>
                      </div>
                      <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox" role="switch" id="indDelivery"
                          checked={branchForm.ind_delivery}
                          onChange={e => setBranchForm({...branchForm, ind_delivery: e.target.checked})}
                        />
                        <label className="form-check-label text-secondary small fw-semibold" htmlFor="indDelivery">Posee Delivery</label>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label text-secondary small fw-semibold">Ubicación / Dirección</label>
                      <textarea className="form-control" rows="2"
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

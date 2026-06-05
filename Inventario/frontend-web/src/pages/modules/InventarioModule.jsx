import { useState, useEffect } from 'react'
import DataTable from '../../components/DataTable'

export default function InventarioModule() {
  const [products, setProducts] = useState([])
  const [lots, setLots] = useState([])
  const [companies, setCompanies] = useState([])
  const [branches, setBranches] = useState([])
  const [catalogs, setCatalogs] = useState([])
  const [currencies, setCurrencies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [activeTab, setActiveTab] = useState('products') // 'products' or 'lots'
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('product') // 'product' or 'lot'
  const [isEditing, setIsEditing] = useState(false)
  const [currentId, setCurrentId] = useState(null)

  // Forms states
  const [productForm, setProductForm] = useState({
    codigo_barras: '',
    codigo_inventario: '',
    fk_catalogo_productos: '',
    vence: false,
    stock_minimo: 0,
    stock_maximo: '',
    fk_estatus: '1',
    fk_compania: '',
  })

  const [lotForm, setLotForm] = useState({
    fk_sucursal: '',
    fk_productos: '',
    numero_lote: '',
    cantidad_inicial: 0,
    cantidad_actual: 0,
    fk_moneda: '',
    precio_compra: 0,
    fecha_produccion: '',
    fecha_vencimiento: '',
    fk_estatus: '1',
    fk_compania: '',
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
      const [resP, resL, resComp, resBranch, resCat, resCur] = await Promise.all([
        fetch(`${API_URL}/api/productos/`, { headers: getHeaders() }),
        fetch(`${API_URL}/api/lotes/`, { headers: getHeaders() }),
        fetch(`${API_URL}/api/companies/`, { headers: getHeaders() }),
        fetch(`${API_URL}/api/sucursales/`, { headers: getHeaders() }),
        fetch(`${API_URL}/api/catalogo-productos/`, { headers: getHeaders() }),
        fetch(`${API_URL}/api/monedas/`, { headers: getHeaders() }),
      ])

      if (!resP.ok || !resL.ok) throw new Error('Error al cargar datos del inventario')

      const dataP = await resP.json()
      const dataL = await resL.json()
      const dataComp = resComp.ok ? await resComp.json() : []
      const dataBranch = resBranch.ok ? await resBranch.json() : []
      const dataCat = resCat.ok ? await resCat.json() : []
      const dataCur = resCur.ok ? await resCur.json() : []

      setProducts(dataP)
      setLots(dataL)
      setCompanies(dataComp)
      setBranches(dataBranch)
      setCatalogs(dataCat)
      setCurrencies(dataCur)
    } catch (err) {
      setError(err.message || 'Error al conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleOpenProductModal = (product = null) => {
    setModalType('product')
    if (product) {
      setIsEditing(true)
      setCurrentId(product.id)
      setProductForm({
        codigo_barras: product.codigo_barras || '',
        codigo_inventario: product.codigo_inventario || '',
        fk_catalogo_productos: product.fk_catalogo_productos || catalogs[0]?.id || '',
        vence: product.vence || false,
        stock_minimo: product.stock_minimo || 0,
        stock_maximo: product.stock_maximo || '',
        fk_estatus: product.fk_estatus || '1',
        fk_compania: product.fk_compania || companies[0]?.id || '',
      })
    } else {
      setIsEditing(false)
      setCurrentId(null)
      setProductForm({
        codigo_barras: '',
        codigo_inventario: '',
        fk_catalogo_productos: catalogs[0]?.id || '',
        vence: false,
        stock_minimo: 0,
        stock_maximo: '',
        fk_estatus: '1',
        fk_compania: companies[0]?.id || '',
      })
    }
    setShowModal(true)
  }

  const handleOpenLotModal = (lot = null) => {
    setModalType('lot')
    if (lot) {
      setIsEditing(true)
      setCurrentId(lot.id)
      setLotForm({
        fk_sucursal: lot.fk_sucursal || '',
        fk_productos: lot.fk_productos || '',
        numero_lote: lot.numero_lote || '',
        cantidad_inicial: lot.cantidad_inicial || 0,
        cantidad_actual: lot.cantidad_actual || 0,
        fk_moneda: lot.fk_moneda || '',
        precio_compra: lot.precio_compra || 0,
        fecha_produccion: lot.fecha_produccion || '',
        fecha_vencimiento: lot.fecha_vencimiento || '',
        fk_estatus: lot.fk_estatus || '1',
        fk_compania: lot.fk_compania || '',
      })
    } else {
      setIsEditing(false)
      setCurrentId(null)
      setLotForm({
        fk_sucursal: branches[0]?.id || '',
        fk_productos: products[0]?.id || '',
        numero_lote: '',
        cantidad_inicial: 0,
        cantidad_actual: 0,
        fk_moneda: currencies[0]?.id || '',
        precio_compra: 0,
        fecha_produccion: '',
        fecha_vencimiento: '',
        fk_estatus: '1',
        fk_compania: companies[0]?.id || '',
      })
    }
    setShowModal(true)
  }

  const handleProductSubmit = async (e) => {
    e.preventDefault()
    const method = isEditing ? 'PUT' : 'POST'
    const url = isEditing ? `${API_URL}/api/productos/${currentId}/` : `${API_URL}/api/productos/`

    try {
      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(productForm),
      })
      if (!res.ok) throw new Error('Error al guardar el producto')
      setShowModal(false)
      fetchData()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleLotSubmit = async (e) => {
    e.preventDefault()
    const method = isEditing ? 'PUT' : 'POST'
    const url = isEditing ? `${API_URL}/api/lotes/${currentId}/` : `${API_URL}/api/lotes/`

    try {
      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(lotForm),
      })
      if (!res.ok) throw new Error('Error al guardar el lote')
      setShowModal(false)
      fetchData()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDelete = async (type, id) => {
    if (!window.confirm('¿Está seguro de eliminar este registro?')) return
    const url = `${API_URL}/api/${type === 'product' ? 'productos' : 'lotes'}/${id}/`
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

  // DataTables Columns Config
  const productColumns = [
    { key: 'codigo_inventario', label: 'SKU / Código', sortable: true, render: (p) => <strong>{p.codigo_inventario}</strong> },
    { key: 'codigo_barras', label: 'Código de Barras', sortable: true },
    { key: 'catalogo_nombre', label: 'Nombre Producto', sortable: true },
    { key: 'compania_nombre', label: 'Compañía', sortable: true },
    {
      key: 'stock_minimo',
      label: 'Stock Mín / Máx',
      sortable: true,
      render: (p) => `${p.stock_minimo} / ${p.stock_maximo || '∞'}`
    },
    {
      key: 'vence',
      label: 'Control Venc.',
      sortable: true,
      render: (p) => (
        <span className={`badge ${p.vence ? 'bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25' : 'bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25'}`}>
          {p.vence ? 'Sí' : 'No'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Acciones',
      sortable: false,
      render: (p) => (
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-outline-secondary p-1 px-2" onClick={() => handleOpenProductModal(p)}>
            <i className="bi bi-pencil-square"></i>
          </button>
          <button className="btn btn-sm btn-outline-danger p-1 px-2" onClick={() => handleDelete('product', p.id)}>
            <i className="bi bi-trash"></i>
          </button>
        </div>
      )
    }
  ]

  const lotColumns = [
    { key: 'numero_lote', label: 'Lote', sortable: true, render: (l) => <strong>{l.numero_lote}</strong> },
    { key: 'sucursal_nombre', label: 'Sucursal', sortable: true },
    { key: 'producto_nombre', label: 'Producto', sortable: true },
    {
      key: 'cantidad_actual',
      label: 'Cant. Inicial / Actual',
      sortable: true,
      render: (l) => `${l.cantidad_inicial} / ${l.cantidad_actual}`
    },
    {
      key: 'precio_compra',
      label: 'Precio Compra',
      sortable: true,
      render: (l) => `${l.moneda_simbolo || '$'} ${l.precio_compra}`
    },
    {
      key: 'fecha_vencimiento',
      label: 'Vence',
      sortable: true,
      render: (l) => {
        if (!l.fecha_vencimiento) return '-'
        const expired = new Date(l.fecha_vencimiento) < new Date()
        return (
          <span className={expired ? 'text-danger fw-bold' : ''}>
            {l.fecha_vencimiento} {expired && ' ⚠️'}
          </span>
        )
      }
    },
    {
      key: 'actions',
      label: 'Acciones',
      sortable: false,
      render: (l) => (
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-outline-secondary p-1 px-2" onClick={() => handleOpenLotModal(l)}>
            <i className="bi bi-pencil-square"></i>
          </button>
          <button className="btn btn-sm btn-outline-danger p-1 px-2" onClick={() => handleDelete('lot', l.id)}>
            <i className="bi bi-trash"></i>
          </button>
        </div>
      )
    }
  ]

  return (
    <div className="fade-in-up">
      {/* Tabs Selector */}
      <div className="card glass-card mb-4 border border-secondary border-opacity-10">
        <div className="card-body p-2 d-flex gap-2">
          <button
            className={`btn btn-sm flex-fill py-2 d-flex align-items-center justify-content-center gap-2 ${activeTab === 'products' ? 'btn-primary' : 'btn-outline-secondary border-0'}`}
            onClick={() => setActiveTab('products')}
          >
            <i className="bi bi-box-seam"></i>
            Productos
          </button>
          <button
            className={`btn btn-sm flex-fill py-2 d-flex align-items-center justify-content-center gap-2 ${activeTab === 'lots' ? 'btn-primary' : 'btn-outline-secondary border-0'}`}
            onClick={() => setActiveTab('lots')}
          >
            <i className="bi bi-calendar-range"></i>
            Lotes de Stock
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
          Cargando datos de inventario...
        </div>
      ) : (
        <div>
          {/* Header Row */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold text-white mb-0">
              {activeTab === 'products' ? 'Inventario de Productos' : 'Control de Lotes y Vencimientos'}
            </h5>
            <button
              className="btn btn-primary btn-sm px-3 py-2 d-flex align-items-center gap-2"
              onClick={() => activeTab === 'products' ? handleOpenProductModal() : handleOpenLotModal()}
            >
              <i className="bi bi-plus-circle"></i>
              Agregar {activeTab === 'products' ? 'Producto' : 'Lote'}
            </button>
          </div>

          {/* DataTable component */}
          {activeTab === 'products' ? (
            <DataTable
              data={products}
              columns={productColumns}
              searchPlaceholder="Buscar producto por SKU, nombre, código..."
            />
          ) : (
            <DataTable
              data={lots}
              columns={lotColumns}
              searchPlaceholder="Buscar lote por número, sucursal, producto..."
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
                  {isEditing ? 'Editar' : 'Agregar'} {modalType === 'product' ? 'Producto' : 'Lote'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)} aria-label="Close"></button>
              </div>

              {modalType === 'product' ? (
                <form onSubmit={handleProductSubmit}>
                  <div className="modal-body p-4 d-flex flex-column gap-3">
                    <div className="form-group">
                      <label className="form-label text-secondary small fw-semibold">Definición del Producto (Catálogo) *</label>
                      <select
                        className="form-select"
                        value={productForm.fk_catalogo_productos}
                        onChange={e => setProductForm({...productForm, fk_catalogo_productos: e.target.value})}
                        required
                      >
                        {catalogs.map(c => (
                          <option key={c.id} value={c.id}>{c.nombre}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label text-secondary small fw-semibold">Compañía *</label>
                      <select
                        className="form-select"
                        value={productForm.fk_compania}
                        onChange={e => setProductForm({...productForm, fk_compania: e.target.value})}
                        required
                      >
                        {companies.map(c => (
                          <option key={c.id} value={c.id}>{c.name_razon_social}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label text-secondary small fw-semibold">Código SKU (Inventario) *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={productForm.codigo_inventario}
                        onChange={e => setProductForm({...productForm, codigo_inventario: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label text-secondary small fw-semibold">Código de Barras</label>
                      <input
                        type="text"
                        className="form-control"
                        value={productForm.codigo_barras}
                        onChange={e => setProductForm({...productForm, codigo_barras: e.target.value})}
                      />
                    </div>

                    <div className="form-check form-switch my-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="venceCheck"
                        checked={productForm.vence}
                        onChange={e => setProductForm({...productForm, vence: e.target.checked})}
                      />
                      <label className="form-check-label text-secondary small fw-semibold" htmlFor="venceCheck">¿Tiene fecha de vencimiento?</label>
                    </div>

                    <div className="row g-2">
                      <div className="col-6">
                        <label className="form-label text-secondary small fw-semibold">Stock Mínimo</label>
                        <input
                          type="number"
                          step="0.0001"
                          className="form-control"
                          value={productForm.stock_minimo}
                          onChange={e => setProductForm({...productForm, stock_minimo: parseFloat(e.target.value) || 0})}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label text-secondary small fw-semibold">Stock Máximo</label>
                        <input
                          type="number"
                          step="0.0001"
                          className="form-control"
                          value={productForm.stock_maximo}
                          onChange={e => setProductForm({...productForm, stock_maximo: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer border-top border-secondary border-opacity-25 p-3">
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                    <button type="submit" className="btn btn-sm btn-primary">Guardar</button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleLotSubmit}>
                  <div className="modal-body p-4 d-flex flex-column gap-3">
                    <div className="form-group">
                      <label className="form-label text-secondary small fw-semibold">Producto *</label>
                      <select
                        className="form-select"
                        value={lotForm.fk_productos}
                        onChange={e => setLotForm({...lotForm, fk_productos: e.target.value})}
                        required
                      >
                        {products.map(p => (
                          <option key={p.id} value={p.id}>{p.catalogo_nombre || p.codigo_inventario}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label text-secondary small fw-semibold">Sucursal *</label>
                      <select
                        className="form-select"
                        value={lotForm.fk_sucursal}
                        onChange={e => setLotForm({...lotForm, fk_sucursal: e.target.value})}
                        required
                      >
                        {branches.map(b => (
                          <option key={b.id} value={b.id}>{b.nombre_sucursal}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label text-secondary small fw-semibold">Compañía *</label>
                      <select
                        className="form-select"
                        value={lotForm.fk_compania}
                        onChange={e => setLotForm({...lotForm, fk_compania: e.target.value})}
                        required
                      >
                        {companies.map(c => (
                          <option key={c.id} value={c.id}>{c.name_razon_social}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label text-secondary small fw-semibold">Número de Lote *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={lotForm.numero_lote}
                        onChange={e => setLotForm({...lotForm, numero_lote: e.target.value})}
                        required
                      />
                    </div>

                    <div className="row g-2">
                      <div className="col-6">
                        <label className="form-label text-secondary small fw-semibold">Cantidad Inicial *</label>
                        <input
                          type="number"
                          step="0.0001"
                          className="form-control"
                          value={lotForm.cantidad_inicial}
                          onChange={e => setLotForm({...lotForm, cantidad_inicial: parseFloat(e.target.value) || 0})}
                          required
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label text-secondary small fw-semibold">Cantidad Actual *</label>
                        <input
                          type="number"
                          step="0.0001"
                          className="form-control"
                          value={lotForm.cantidad_actual}
                          onChange={e => setLotForm({...lotForm, cantidad_actual: parseFloat(e.target.value) || 0})}
                          required
                        />
                      </div>
                    </div>

                    <div className="row g-2">
                      <div className="col-5">
                        <label className="form-label text-secondary small fw-semibold">Moneda *</label>
                        <select
                          className="form-select"
                          value={lotForm.fk_moneda}
                          onChange={e => setLotForm({...lotForm, fk_moneda: e.target.value})}
                          required
                        >
                          {currencies.map(curr => (
                            <option key={curr.id} value={curr.id}>{curr.simbolo}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-7">
                        <label className="form-label text-secondary small fw-semibold">Precio Compra</label>
                        <input
                          type="number"
                          step="0.0001"
                          className="form-control"
                          value={lotForm.precio_compra}
                          onChange={e => setLotForm({...lotForm, precio_compra: parseFloat(e.target.value) || 0})}
                        />
                      </div>
                    </div>

                    <div className="row g-2">
                      <div className="col-6">
                        <label className="form-label text-secondary small fw-semibold">Fecha Producción</label>
                        <input
                          type="date"
                          className="form-control"
                          value={lotForm.fecha_produccion}
                          onChange={e => setLotForm({...lotForm, fecha_produccion: e.target.value})}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label text-secondary small fw-semibold">Fecha Vencimiento</label>
                        <input
                          type="date"
                          className="form-control"
                          value={lotForm.fecha_vencimiento}
                          onChange={e => setLotForm({...lotForm, fecha_vencimiento: e.target.value})}
                        />
                      </div>
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

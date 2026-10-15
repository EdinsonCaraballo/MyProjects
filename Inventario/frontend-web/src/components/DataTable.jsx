/**
 * DataTable.jsx — Componente reutilizable de tabla con búsqueda, ordenamiento y paginación.
 *
 * EQUIVALENTE ANGULAR: Como un shared/data-table.component.ts con @Input() para data y columns.
 * Similar a usar Angular Material <mat-table> con matSort y matPaginator, pero custom.
 *
 * CONCEPTOS CLAVE:
 * - useMemo(): Memoriza valores calculados, solo recalcula cuando cambian las dependencias.
 *              Como un pipe puro (@Pipe pure:true) en Angular.
 * - RENDER PROPS (col.render): Como un <ng-template let-row> para personalizar celdas.
 * - FLUJO: data → filteredData → sortedData → paginatedData (cadena de transformaciones)
 */

import { useState, useMemo } from 'react'

/**
 * @param {Array} data - Datos a mostrar (como dataSource en mat-table)
 * @param {Array} columns - Config de columnas [{key, label, sortable, render}]
 * @param {string} searchPlaceholder - Placeholder del buscador
 */
export default function DataTable({ data = [], columns = [], searchPlaceholder = 'Buscar...' }) {
  // ── Estados locales (equivalente a propiedades de clase en Angular) ──
  const [searchTerm, setSearchTerm] = useState('')       // Texto del buscador
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' }) // Orden activo
  const [currentPage, setCurrentPage] = useState(1)      // Página actual
  const [pageSize, setPageSize] = useState(10)            // Registros por página

  // ── 1. Lógica de ordenamiento (como matSortChange en Angular) ──
  const handleSort = (key, sortable) => {
    if (!sortable) return
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
    setCurrentPage(1)
  };

  // ── 2. Filtrado en tiempo real (como un pipe puro de Angular) ──
  // useMemo solo recalcula cuando cambian data, searchTerm o columns
  const filteredData = useMemo(() => {
    if (!searchTerm) return data
    const lowerSearch = searchTerm.toLowerCase()
    return data.filter(item => {
      return columns.some(col => {
        const val = item[col.key]
        if (val === null || val === undefined) return false
        return String(val).toLowerCase().includes(lowerSearch)
      })
    })
  }, [data, searchTerm, columns])

  // ── 3. Ordenamiento aplicado sobre datos filtrados ──
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData
    const sorted = [...filteredData] // Spread: copia inmutable del array
    sorted.sort((a, b) => {
      let aVal = a[sortConfig.key]
      let bVal = b[sortConfig.key]
      if (aVal === null || aVal === undefined) aVal = ''
      if (bVal === null || bVal === undefined) bVal = ''
      if (typeof aVal === 'string') {
        return sortConfig.direction === 'asc'
          ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      } else {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal
      }
    })
    return sorted
  }, [filteredData, sortConfig])

  // ── 4. Paginación (como mat-paginator de Angular Material) ──
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return sortedData.slice(startIndex, startIndex + pageSize)
  }, [sortedData, currentPage, pageSize])

  const totalPages = Math.ceil(sortedData.length / pageSize) || 1

  /*
   * JSX — El template (en Angular sería data-table.component.html)
   * - className en vez de class (palabra reservada en JS)
   * - htmlFor en vez de for
   * - {items.map(...)} en vez de *ngFor
   * - {cond && <El />} en vez de *ngIf
   * - value={var} en vez de [value]="var"
   * - onChange={fn} en vez de (change)="fn()"
   */
  return (
    <div className="card shadow-sm border border-secondary border-opacity-25 bg-dark bg-gradient bg-opacity-75">
      {/* ── Header: selector de registros + buscador ── */}
      <div className="card-header border-bottom border-secondary border-opacity-25 bg-transparent p-3 d-flex flex-wrap justify-content-between align-items-center gap-3">
        <div className="d-flex align-items-center gap-2">
          <span className="text-secondary small">Mostrar:</span>
          {/* Select controlado: value + onChange (no hay [(ngModel)] en React) */}
          <select
            className="form-select form-select-sm bg-dark text-light border-secondary border-opacity-50"
            style={{ width: '80px', borderRadius: '6px' }}
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value))
              setCurrentPage(1)
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span className="text-secondary small">registros</span>
        </div>

        {/* Input de búsqueda global */}
        <div className="position-relative" style={{ minWidth: '260px' }}>
          <span className="position-absolute top-50 start-0 translate-middle-y ps-3 text-secondary">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control form-control-sm bg-dark text-light border-secondary border-opacity-50 ps-5"
            style={{ borderRadius: '8px' }}
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
          />
        </div>
      </div>

      {/* ── Tabla ── */}
      <div className="table-responsive">
        <table className="table table-hover table-striped align-middle mb-0 text-light bg-transparent">
          {/* Encabezados — {columns.map()} es como *ngFor en Angular */}
          <thead>
            <tr className="border-bottom border-secondary border-opacity-25">
              {columns.map(col => (
                <th
                  key={col.key} /* key = trackBy en *ngFor */
                  onClick={() => handleSort(col.key, col.sortable)}
                  className={`p-3 text-secondary font-monospace small ${col.sortable ? 'cursor-pointer select-none' : ''}`}
                  style={{ textTransform: 'uppercase', letterSpacing: '0.8px', cursor: col.sortable ? 'pointer' : 'default' }}
                >
                  <div className="d-flex align-items-center gap-2">
                    {col.label}
                    {col.sortable && (
                      <span className="small text-muted">
                        {sortConfig.key === col.key ? (
                          sortConfig.direction === 'asc' ? <i className="bi bi-caret-up-fill text-primary"></i> : <i className="bi bi-caret-down-fill text-primary"></i>
                        ) : (
                          <i className="bi bi-chevron-expand"></i>
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Filas de datos — doble map: filas externo, columnas interno */}
          <tbody className="border-bottom-0">
            {paginatedData.map((row, rIdx) => (
              <tr key={row.id || rIdx} className="border-bottom border-secondary border-opacity-10">
                {columns.map(col => (
                  <td key={col.key} className="p-3 text-light-emphasis">
                    {/* col.render() personaliza la celda (como ng-template), sino muestra el valor raw */}
                    {col.render ? col.render(row) : (row[col.key] !== null && row[col.key] !== undefined ? String(row[col.key]) : '-')}
                  </td>
                ))}
              </tr>
            ))}
            {/* Mensaje vacío — como *ngIf="data.length === 0" */}
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="text-center py-5 text-secondary">
                  <i className="bi bi-inbox fs-2 d-block mb-2"></i>
                  No se encontraron registros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Footer: info de paginación + botones ── */}
      <div className="card-footer border-top border-secondary border-opacity-25 bg-transparent p-3 d-flex flex-wrap justify-content-between align-items-center gap-3">
        <div className="small text-secondary">
          Mostrando {sortedData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} a {Math.min(currentPage * pageSize, sortedData.length)} de {sortedData.length} registros
        </div>

        <nav aria-label="Navegación de tabla">
          <ul className="pagination pagination-sm mb-0 gap-1">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link bg-dark text-light border-secondary border-opacity-25 rounded"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
                Anterior
              </button>
            </li>
            {/* Genera botones numéricos de página — Array.from como *ngFor con index */}
            {Array.from({ length: totalPages }, (_, idx) => {
              const pNum = idx + 1
              return (
                <li key={pNum} className={`page-item ${currentPage === pNum ? 'active' : ''}`}>
                  <button
                    className={`page-link border-secondary border-opacity-25 rounded ${currentPage === pNum ? 'bg-primary text-white border-primary' : 'bg-dark text-light'}`}
                    onClick={() => setCurrentPage(pNum)}>
                    {pNum}
                  </button>
                </li>
              )
            })}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link bg-dark text-light border-secondary border-opacity-25 rounded"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>
                Siguiente
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}

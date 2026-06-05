-- ==============================================================================
-- INVENTARIO - SEED DATA PARTE 2: Productos, Inventario y Transacciones
-- Ejecutar después de 02_seed_base.sql
-- ==============================================================================
BEGIN;

-- CATEGORIAS (jerarquía)
INSERT INTO categorias (id, nombre, fk_categoria, fk_estatus, usuario_registro) VALUES
(1, 'Alimentos',            NULL, 1, 'system'),
(2, 'Medicamentos',         NULL, 1, 'system'),
(3, 'Higiene Personal',     NULL, 1, 'system'),
(4, 'Bebidas',              NULL, 1, 'system'),
(5, 'Electrónica',          NULL, 1, 'system'),
-- Subcategorías
(6, 'Lácteos',              1,    1, 'system'),
(7, 'Snacks',               1,    1, 'system'),
(8, 'Antibióticos',         2,    1, 'system'),
(9, 'Bebidas Gaseosas',     4,    1, 'system'),
(10,'Bebidas Energéticas',  4,    1, 'system');

-- CATALOGO_PRODUCTOS
INSERT INTO catalogo_productos (id, nombre, descripcion, fk_categoria, fk_estatus, usuario_registro) VALUES
(1,  'Leche Entera 1L',         'Leche pasteurizada entera',           6,  1, 'system'),
(2,  'Queso Blanco 500g',       'Queso blanco llanero',                6,  1, 'system'),
(3,  'Chips de Maíz 200g',      'Snack de maíz sabor natural',         7,  1, 'system'),
(4,  'Amoxicilina 500mg x20',   'Antibiótico de amplio espectro',      8,  1, 'system'),
(5,  'Ibuprofeno 400mg x10',    'Antiinflamatorio y analgésico',       2,  1, 'system'),
(6,  'Shampoo Anticaspa 400ml', 'Shampoo con zinc para caspa',         3,  1, 'system'),
(7,  'Coca-Cola 2L',            'Refresco de cola 2 litros',           9,  1, 'system'),
(8,  'Monster Energy 473ml',    'Bebida energética lata',              10, 1, 'system'),
(9,  'Jabón Antibacterial 90g', 'Jabón de uso personal',              3,  1, 'system'),
(10, 'Agua Mineral 1.5L',       'Agua mineral sin gas',               4,  1, 'system');

-- PRODUCTOS (con SKU y código de barras)
INSERT INTO productos (id, codigo_barras, codigo_inventario, fk_catalogo_productos, vence, stock_minimo, stock_maximo, fk_estatus, fk_compania, usuario_registro) VALUES
(1,  '7501055300058', 'SKU-DM-0001', 1,  TRUE,  50,   500,  1, 1, 'system'),
(2,  '7501030450018', 'SKU-DM-0002', 2,  TRUE,  20,   200,  1, 1, 'system'),
(3,  '7502223040031', 'SKU-DM-0003', 3,  TRUE,  30,   300,  1, 1, 'system'),
(4,  '7506278000042', 'SKU-FP-0001', 4,  TRUE,  10,   100,  1, 2, 'system'),
(5,  '7506278000059', 'SKU-FP-0002', 5,  TRUE,  15,   150,  1, 2, 'system'),
(6,  '7501234560061', 'SKU-DM-0004', 6,  FALSE, 10,   100,  1, 1, 'system'),
(7,  '7501234560078', 'SKU-DM-0005', 7,  TRUE,  50,   600,  1, 1, 'system'),
(8,  '7501234560085', 'SKU-DM-0006', 8,  TRUE,  20,   200,  1, 1, 'system'),
(9,  '7506278000091', 'SKU-FP-0003', 9,  FALSE, 15,   150,  1, 2, 'system'),
(10, '7501234560108', 'SKU-DM-0007', 10, TRUE,  100, 1000,  1, 1, 'system');

-- LOTES_INVENTARIO
-- Algunos vencidos (fecha_vencimiento en pasado), otros vigentes
INSERT INTO lotes_inventario (id, fk_sucursal, fk_productos, numero_lote, cantidad_inicial, cantidad_actual, fk_moneda, precio_compra, fecha_produccion, fecha_vencimiento, fk_estatus, fk_compania, usuario_registro) VALUES
(1,  1, 1,  'LOTE-2025-001', 200, 120, 1, 1.20,  '2025-01-10', '2026-08-10', 1, 1, 'system'),
(2,  1, 2,  'LOTE-2025-002', 100,  45, 1, 3.50,  '2025-02-01', '2026-06-01', 1, 1, 'system'),
(3,  1, 3,  'LOTE-2025-003', 150,  80, 1, 0.90,  '2025-03-05', '2026-09-05', 1, 1, 'system'),
(4,  2, 1,  'LOTE-2025-004', 180,  90, 1, 1.20,  '2025-01-15', '2026-07-15', 1, 1, 'system'),
(5,  2, 7,  'LOTE-2025-005', 300, 200, 1, 0.85,  '2025-04-01', '2026-10-01', 1, 1, 'system'),
(6,  3, 10, 'LOTE-2025-006', 500, 350, 1, 0.50,  '2025-05-01', '2027-05-01', 1, 1, 'system'),
(7,  4, 4,  'LOTE-2025-007',  50,  30, 1, 5.00,  '2024-10-01', '2026-10-01', 1, 2, 'system'),
(8,  4, 5,  'LOTE-2025-008',  80,  40, 1, 2.80,  '2024-11-01', '2026-11-01', 1, 2, 'system'),
(9,  5, 9,  'LOTE-2025-009', 100,  60, 1, 0.70,  '2025-01-01', '2028-01-01', 1, 2, 'system'),
-- Lote VENCIDO
(10, 1, 2,  'LOTE-2024-OLD',  50,  50, 1, 3.00,  '2024-01-01', '2025-12-31', 4, 1, 'system');

-- PRECIOS_VENTA
INSERT INTO precios_venta (fk_producto, fk_sucursal, fk_moneda, precio_venta_neto, porcentaje_iva, precio_venta_publico, fk_estatus, fk_compania, usuario_registro) VALUES
-- Sucursal 1 - DistribMax (precios en USD)
(1,  1, 1, 1.80,  16, 2.09,  1, 1, 'system'),
(2,  1, 1, 5.00,  16, 5.80,  1, 1, 'system'),
(3,  1, 1, 1.50,  16, 1.74,  1, 1, 'system'),
(6,  1, 1, 4.50,  16, 5.22,  1, 1, 'system'),
(7,  1, 1, 1.20,  16, 1.39,  1, 1, 'system'),
(8,  1, 1, 1.80,  16, 2.09,  1, 1, 'system'),
(10, 1, 1, 0.80,  16, 0.93,  1, 1, 'system'),
-- Sucursal 1 - precios en VES
(1,  1, 2, 65.70, 16, 76.21, 1, 1, 'system'),
(7,  1, 2, 43.80, 16, 50.81, 1, 1, 'system'),
-- Sucursal 4 - FarmaPlus (precios en USD)
(4,  4, 1, 8.00,  16, 9.28,  1, 2, 'system'),
(5,  4, 1, 5.50,  16, 6.38,  1, 2, 'system'),
(9,  4, 1, 1.20,  16, 1.39,  1, 2, 'system');

-- TIPOS_MOVIMIENTO
INSERT INTO tipos_movimiento (id, nombre, factor, fk_estatus, fk_compania, usuario_registro) VALUES
(1, 'COMPRA',              1,  1, 1, 'system'),
(2, 'VENTA',              -1,  1, 1, 'system'),
(3, 'DEVOLUCION_VENTA',    1,  1, 1, 'system'),
(4, 'AJUSTE_VENCIMIENTO', -1,  1, 1, 'system'),
(5, 'COMPRA',              1,  1, 2, 'system'),
(6, 'VENTA',              -1,  1, 2, 'system'),
(7, 'DEVOLUCION_VENTA',    1,  1, 2, 'system'),
(8, 'AJUSTE_VENCIMIENTO', -1,  1, 2, 'system');

-- HISTORIAL_INVENTARIO
INSERT INTO historial_inventario (fk_tipo_movimiento, fk_lote_inventario, cantidad, tasa_cambio_momento, referencia_id, motivo_detalle, fk_estatus, fk_compania, usuario_registro) VALUES
-- Entradas por compra
(1, 1, 200, 36.50, NULL, 'Compra inicial lote LOTE-2025-001', 1, 1, 'system'),
(1, 2, 100, 36.50, NULL, 'Compra inicial lote LOTE-2025-002', 1, 1, 'system'),
(1, 3, 150, 36.50, NULL, 'Compra inicial lote LOTE-2025-003', 1, 1, 'system'),
(1, 7,  50, 36.50, NULL, 'Compra inicial FarmaPlus',          1, 2, 'system'),
-- Salidas por venta
(2, 1,  30, 36.50, 1, 'Venta pedido #1', 1, 1, 'system'),
(2, 2,  10, 36.50, 1, 'Venta pedido #1', 1, 1, 'system'),
(2, 7,   5, 36.50, 2, 'Venta pedido #2', 1, 2, 'system'),
-- Devolución
(3, 1,   5, 36.50, 1, 'Devolución parcial pedido #1', 1, 1, 'system'),
-- Ajuste por vencimiento
(4, 10, 50, 36.50, NULL, 'Producto vencido retirado del inventario', 1, 1, 'system');

-- METODO_PAGO
INSERT INTO metodo_pago (id, nombre, fk_estatus, fk_compania, usuario_registro) VALUES
(1, 'Efectivo USD',    1, 1, 'system'),
(2, 'Pago Móvil',     1, 1, 'system'),
(3, 'Transferencia',  1, 1, 'system'),
(4, 'Tarjeta Débito', 1, 1, 'system'),
(5, 'Efectivo USD',   1, 2, 'system'),
(6, 'Pago Móvil',     1, 2, 'system');

-- PEDIDOS
INSERT INTO pedidos (id, fk_cliente, fk_usuario_cliente, fk_sucursal, fecha_pedido, monto_total_base, monto_total_moneda_extranjera, tasa_cambio_pedido, fk_estatus, requiere_delivery, fk_compania, usuario_registro) VALUES
(1, 1,    NULL, 1, NOW() - INTERVAL '5 days',  7.63,  7.63,  36.50, 1, FALSE, 1, 'system'),  -- Entregado
(2, NULL, 1,    1, NOW() - INTERVAL '3 days',  4.18,  4.18,  36.50, 3, TRUE,  1, 'system'),  -- Pendiente
(3, 2,    NULL, 2, NOW() - INTERVAL '1 day',   5.80,  5.80,  36.50, 1, FALSE, 1, 'system'),  -- Entregado
(4, NULL, 2,    4, NOW() - INTERVAL '2 days',  15.66, 15.66, 36.50, 2, FALSE, 2, 'system'),  -- Confirmado
(5, NULL, 3,    1, NOW(),                       2.09,  2.09,  36.50, 2, TRUE,  1, 'system');  -- Cancelado

-- PEDIDO_DETALLES
INSERT INTO pedido_detalles (fk_pedido, fk_producto, fk_lote_inventario, cantidad, precio_unitario_momento, fk_compania) VALUES
(1, 1, 1, 2, 2.09, 1),
(1, 2, 2, 1, 5.80, 1),
(2, 7, 5, 3, 1.39, 1),
(3, 1, 4, 2, 2.09, 1),
(4, 4, 7, 1, 9.28, 2),
(4, 5, 8, 1, 6.38, 2),
(5, 1, 1, 1, 2.09, 1);

-- PAGOS_PEDIDO
INSERT INTO pagos_pedido (fk_pedido, fk_metodo_pago, fk_moneda, monto_pagado, referencia_bancaria, fk_estatus_pago, fk_estatus, fk_compania, usuario_registro) VALUES
(1, 1, 1, 7.63,  NULL,           'Aprobado',  1, 1, 'system'),
(2, 2, 2, 152.57,'REF202600001', 'Pendiente', 3, 1, 'system'),
(3, 4, 1, 5.80,  NULL,           'Aprobado',  1, 1, 'system'),
(4, 5, 1, 15.66, NULL,           'Aprobado',  1, 2, 'system');

-- DELIVERY_CONFIG_SUCURSAL
INSERT INTO delivery_config_sucursal (fk_sucursal, posee_delivery, costo_fijo_delivery, radio_cobertura_km, fk_compania) VALUES
(1, TRUE,  2.00, 10.0, 1),
(3, TRUE,  1.50,  8.0, 1),
(5, TRUE,  2.50,  5.0, 2);

-- DESPACHOS_DELIVERY
INSERT INTO despachos_delivery (fk_pedido, direccion_entrega_texto, fk_estado, fk_ciudad, fk_municipio, fk_parroquia, location, nombre_repartidor, telefono_repartidor, fecha_entrega, fk_compania) VALUES
(2, 'Av. Las Mercedes, Res. Las Palmas, Piso 3, Apto 3B', 1, 1, 1, 1, '10.4806,-66.8792', 'Pedro Rojas', '+584141112233', NULL, 1),
(5, 'Urb. El Paraíso, Calle 5, Casa 12', 1, 1, 1, 1, '10.4830,-66.8820', 'Juan Vásquez', '+584141223344', NULL, 1);

-- RUTAS_DELIVERY
INSERT INTO rutas_delivery (fk_pedido, nombre_motorizado, telefono_motorizado, costo_delivery, direccion_destino, coordenadas_destino, fecha_hora_salida, fecha_hora_entrega, fk_compania) VALUES
(2, 'Pedro Rojas',   '+584141112233', 2.00, 'Res. Las Palmas, Piso 3 Apto 3B, Las Mercedes', '10.4806,-66.8792', NOW() - INTERVAL '2 hours', NULL, 1),
(5, 'Juan Vásquez',  '+584141223344', 2.00, 'Urb. El Paraíso, Calle 5, Casa 12',             '10.4830,-66.8820', NOW() - INTERVAL '1 hour',  NULL, 1);

-- CLIENTE_FAVORITOS
INSERT INTO cliente_favoritos (fk_usuario_cliente, fk_producto, fk_usuario, fk_estatus, fk_compania, usuario_registro) VALUES
(1, 1,  1, 1, 1, 'system'),
(1, 7,  1, 1, 1, 'system'),
(2, 10, 1, 1, 1, 'system');

-- Actualizar sequences para evitar conflictos
SELECT setval('estatus_id_seq',              (SELECT MAX(id) FROM estatus));
SELECT setval('type_document_id_seq',        (SELECT MAX(id) FROM type_document));
SELECT setval('tipo_comercio_id_seq',        (SELECT MAX(id) FROM tipo_comercio));
SELECT setval('cod_area__telefono_id_seq',   (SELECT MAX(id) FROM cod_area__telefono));
SELECT setval('pais_id_seq',                 (SELECT MAX(id) FROM pais));
SELECT setval('regiones_id_seq',             (SELECT MAX(id) FROM regiones));
SELECT setval('estados_id_seq',              (SELECT MAX(id) FROM estados));
SELECT setval('ciudades_id_seq',             (SELECT MAX(id) FROM ciudades));
SELECT setval('municipios_id_seq',           (SELECT MAX(id) FROM municipios));
SELECT setval('parroquias_id_seq',           (SELECT MAX(id) FROM parroquias));
SELECT setval('sectores_id_seq',             (SELECT MAX(id) FROM sectores));
SELECT setval('company_id_seq',              (SELECT MAX(id) FROM company));
SELECT setval('sucursal_id_seq',             (SELECT MAX(id) FROM sucursal));
SELECT setval('monedas_id_seq',              (SELECT MAX(id) FROM monedas));
SELECT setval('categorias_id_seq',           (SELECT MAX(id) FROM categorias));
SELECT setval('catalogo_productos_id_seq',   (SELECT MAX(id) FROM catalogo_productos));
SELECT setval('productos_id_seq',            (SELECT MAX(id) FROM productos));
SELECT setval('lotes_inventario_id_seq',     (SELECT MAX(id) FROM lotes_inventario));
SELECT setval('modulos_id_seq',              (SELECT MAX(id) FROM modulos));
SELECT setval('acciones_sistema_id_seq',     (SELECT MAX(id) FROM acciones_sistema));
SELECT setval('modulos_acciones_id_seq',     (SELECT MAX(id) FROM modulos_acciones));
SELECT setval('perfil_id_seq',               (SELECT MAX(id) FROM perfil));
SELECT setval('usuario_id_seq',              (SELECT MAX(id) FROM usuario));
SELECT setval('usuarios_clientes_id_seq',    (SELECT MAX(id) FROM usuarios_clientes));
SELECT setval('clientes_id_seq',             (SELECT MAX(id) FROM clientes));
SELECT setval('tipos_movimiento_id_seq',     (SELECT MAX(id) FROM tipos_movimiento));
SELECT setval('pedidos_id_seq',              (SELECT MAX(id) FROM pedidos));
SELECT setval('metodo_pago_id_seq',          (SELECT MAX(id) FROM metodo_pago));

COMMIT;
-- ==============================================================================
-- FIN: 03_seed_transaccional.sql
-- ==============================================================================

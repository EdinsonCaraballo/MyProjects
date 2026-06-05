-- ==============================================================================
-- INVENTARIO - SEED DATA PARTE 1: Datos Base y Catálogos
-- Ejecutar después de 01_schema.sql
-- ==============================================================================
BEGIN;

-- ESTATUS
INSERT INTO estatus (id, fk_estatus, usuario_registro) VALUES
(1, 'ACTIVO',   'system'),
(2, 'INACTIVO', 'system'),
(3, 'PENDIENTE','system'),
(4, 'VENCIDO',  'system');

-- TYPE_DOCUMENT
INSERT INTO type_document (id, type_document, fk_estatus, usuario_registro) VALUES
(1, 'RIF',    1, 'system'),
(2, 'Cédula', 1, 'system'),
(3, 'Pasaporte', 1, 'system');

-- TIPO_COMERCIO
INSERT INTO tipo_comercio (id, nombre, descripcion, fk_estatus, usuario_registro) VALUES
(1, 'Retail',      'Venta al detal',          1, 'system'),
(2, 'Mayorista',   'Venta al mayor',           1, 'system'),
(3, 'Restaurante', 'Servicios de alimentos',   1, 'system'),
(4, 'Farmacia',    'Productos farmacéuticos',  1, 'system');

-- COD_AREA__TELEFONO
INSERT INTO cod_area__telefono (id, cod_area, fk_estatus, usuario_registro) VALUES
(1, '+58', 1, 'system'),
(2, '+1',  1, 'system'),
(3, '+34', 1, 'system');

-- PAIS
INSERT INTO pais (id, codigo_iso, nombre, fk_estatus, usuario_registro) VALUES
(1, 'VEN', 'Venezuela',       1, 'system'),
(2, 'USA', 'Estados Unidos',  1, 'system'),
(3, 'ESP', 'España',          1, 'system');

-- REGIONES
INSERT INTO regiones (id, fk_pais, nombre, fk_estatus, usuario_registro) VALUES
(1, 1, 'Región Capital',      1, 'system'),
(2, 1, 'Región Zuliana',      1, 'system'),
(3, 1, 'Región Central',      1, 'system');

-- ESTADOS
INSERT INTO estados (id, fk_regiones, nombre, fk_estatus, usuario_registro) VALUES
(1, 1, 'Distrito Capital', 1, 'system'),
(2, 2, 'Zulia',            1, 'system'),
(3, 3, 'Carabobo',         1, 'system');

-- CIUDADES
INSERT INTO ciudades (id, fk_estados, nombre, fk_estatus, usuario_registro) VALUES
(1, 1, 'Caracas',       1, 'system'),
(2, 2, 'Maracaibo',     1, 'system'),
(3, 3, 'Valencia',      1, 'system');

-- MUNICIPIOS
INSERT INTO municipios (id, fk_estados, nombre, fk_estatus, usuario_registro) VALUES
(1, 1, 'Libertador',    1, 'system'),
(2, 2, 'Maracaibo',     1, 'system'),
(3, 3, 'Valencia',      1, 'system');

-- PARROQUIAS
INSERT INTO parroquias (id, fk_municipios, nombre, fk_estatus, usuario_registro) VALUES
(1, 1, 'El Recreo',     1, 'system'),
(2, 2, 'Olegario Villalobos', 1, 'system'),
(3, 3, 'San José',      1, 'system');

-- SECTORES
INSERT INTO sectores (id, fk_parroquia, nombre, fk_estatus, usuario_registro) VALUES
(1, 1, 'Las Mercedes',  1, 'system'),
(2, 2, 'Belloso',       1, 'system'),
(3, 3, 'El Viñedo',     1, 'system');

-- MONEDAS
INSERT INTO monedas (id, codigo_iso, nombre, simbolo, es_base, fk_estatus, usuario_registro) VALUES
(1, 'USD', 'Dólar Americano',  '$',  TRUE,  1, 'system'),
(2, 'VES', 'Bolívar Soberano', 'Bs', FALSE, 1, 'system'),
(3, 'EUR', 'Euro',             '€',  FALSE, 1, 'system');

-- TASAS_CAMBIO
INSERT INTO tasas_cambio (fk_moneda_origen, fk_moneda_destino, tasa_cambio, fk_estatus, usuario_registro) VALUES
(1, 2, 36.50000000,    1, 'system'),
(1, 3,  0.92000000,    1, 'system'),
(2, 1,  0.02739726,    1, 'system');

-- COMPANY
INSERT INTO company (id, fk_type_document, rif_cedula, nombre_comercial, name_razon_social, tipo_comercio, sitio_web, direccion_fiscal, fk_estatus, usuario_registro) VALUES
(1, 1, 'J-12345678-9', 'DistribMax',   'Distribuidora Máxima C.A.',  1, 'https://distribmax.com',  'Av. Principal, Caracas',  1, 'system'),
(2, 1, 'J-98765432-1', 'FarmaPlus',    'Farmacias Plus C.A.',         4, 'https://farmaplus.com',   'Calle 72, Maracaibo',     1, 'system');

-- SUCURSAL
INSERT INTO sucursal (id, fk_company, nombre_sucursal, codigo_sucursal, ind_principal, ind_delivery, horario_apertura, horario_cierre, fk_estatus, usuario_registro) VALUES
(1, 1, 'DistribMax Las Mercedes',  'DM-001', TRUE,  TRUE,  '08:00', '20:00', 1, 'system'),
(2, 1, 'DistribMax Valencia',      'DM-002', FALSE, FALSE, '08:00', '18:00', 1, 'system'),
(3, 1, 'DistribMax Maracaibo',     'DM-003', FALSE, TRUE,  '08:00', '19:00', 1, 'system'),
(4, 2, 'FarmaPlus Centro',         'FP-001', TRUE,  FALSE, '07:00', '21:00', 1, 'system'),
(5, 2, 'FarmaPlus Norte',          'FP-002', FALSE, TRUE,  '07:00', '20:00', 1, 'system'),
(6, 2, 'FarmaPlus Sur',            'FP-003', FALSE, FALSE, '08:00', '20:00', 1, 'system');

-- TELEFONO__SUCURSAL
INSERT INTO telefono__sucursal (fk_sucursal, fk_cod_area__telefono, numero_telefono, fk_estatus, usuario_registro) VALUES
(1, 1, '2128001234', 1, 'system'),
(2, 1, '2414501234', 1, 'system'),
(3, 1, '2616001234', 1, 'system'),
(4, 1, '2617001234', 1, 'system'),
(5, 1, '2617005678', 1, 'system');

-- CORREO_SUCURSAL
INSERT INTO correo_sucursal (fk_sucursal, correo, fk_estatus, usuario_registro) VALUES
(1, 'lasmercedes@distribmax.com',  1, 'system'),
(2, 'valencia@distribmax.com',     1, 'system'),
(3, 'maracaibo@distribmax.com',    1, 'system'),
(4, 'centro@farmaplus.com',        1, 'system'),
(5, 'norte@farmaplus.com',         1, 'system');

-- DIRECCION_SUCURSAL
INSERT INTO direccion_sucursal (fk_pais, fk_region, fk_estado, fk_ciudad, fk_municipio, fk_parroquia, fk_sector, indicador_principal, nombre_direccion, tipo_direccion, fk_estatus, usuario_registro) VALUES
(1, 1, 1, 1, 1, 1, 1, TRUE,  'Sede Principal Las Mercedes', 'Operativa', 1, 'system'),
(1, 3, 3, 3, 3, 3, 3, FALSE, 'Sede Valencia',               'Operativa', 1, 'system'),
(1, 2, 2, 2, 2, 2, 2, FALSE, 'Sede Maracaibo',              'Operativa', 1, 'system'),
(1, 2, 2, 2, 2, 2, 2, TRUE,  'FarmaPlus Centro',            'Fiscal',    1, 'system');

-- MODULOS
INSERT INTO modulos (id, nombre_modulo, fk_estatus, usuario_registro) VALUES
(1, 'Inventario', 1, 'system'),
(2, 'Pedidos',    1, 'system'),
(3, 'Reportes',   1, 'system'),
(4, 'Usuarios',   1, 'system'),
(5, 'Delivery',   1, 'system');

-- ACCIONES_SISTEMA
INSERT INTO acciones_sistema (id, nombre, descripcion, fk_estatus, usuario_registro) VALUES
(1, 'Crear',      'Crear nuevos registros',     1, 'system'),
(2, 'Leer',       'Consultar registros',        1, 'system'),
(3, 'Actualizar', 'Modificar registros',        1, 'system'),
(4, 'Eliminar',   'Eliminar registros',         1, 'system');

-- MODULOS_ACCIONES (todas las combinaciones para módulos clave)
INSERT INTO modulos_acciones (id, fk_modulos, fk_acciones_sistema, fk_estatus, usuario_registro) VALUES
(1,  1, 1, 1, 'system'),(2,  1, 2, 1, 'system'),(3,  1, 3, 1, 'system'),(4,  1, 4, 1, 'system'),
(5,  2, 1, 1, 'system'),(6,  2, 2, 1, 'system'),(7,  2, 3, 1, 'system'),(8,  2, 4, 1, 'system'),
(9,  3, 2, 1, 'system'),
(10, 4, 1, 1, 'system'),(11, 4, 2, 1, 'system'),(12, 4, 3, 1, 'system'),(13, 4, 4, 1, 'system'),
(14, 5, 1, 1, 'system'),(15, 5, 2, 1, 'system'),(16, 5, 3, 1, 'system');

-- PERFIL
INSERT INTO perfil (id, nombre_perfil, fk_sucursal, fk_estatus, fk_compania, usuario_registro) VALUES
(1, 'Administrador', NULL, 1, 1, 'system'),
(2, 'Gerente',       1,    1, 1, 'system'),
(3, 'Cajero',        1,    1, 1, 'system'),
(4, 'Administrador', NULL, 1, 2, 'system'),
(5, 'Cajero',        4,    1, 2, 'system');

-- PERFIL__MODULOS_ACCIONES  (Admin empresa 1 tiene todos los permisos)
INSERT INTO perfil__modulos_acciones (fk_perfil, fk_modulos_acciones, fk_estatus, usuario_registro) VALUES
(1,1,1,'system'),(1,2,1,'system'),(1,3,1,'system'),(1,4,1,'system'),
(1,5,1,'system'),(1,6,1,'system'),(1,7,1,'system'),(1,8,1,'system'),
(1,9,1,'system'),(1,10,1,'system'),(1,11,1,'system'),(1,12,1,'system'),
(1,13,1,'system'),(1,14,1,'system'),(1,15,1,'system'),(1,16,1,'system'),
-- Gerente: Inventario + Pedidos (sin eliminar) + Reportes
(2,1,1,'system'),(2,2,1,'system'),(2,3,1,'system'),
(2,5,1,'system'),(2,6,1,'system'),(2,7,1,'system'),
(2,9,1,'system'),
-- Cajero: solo leer inventario + crear/leer pedidos
(3,2,1,'system'),(3,5,1,'system'),(3,6,1,'system');

-- USUARIO (sistema)
-- Contraseñas hasheadas con bcrypt costo 10:
--   Admin123*  => $2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
--   Cajero2024* => $2b$10$FX5Lz/p8fzUUQ3fIBInr9ek0pK3oGX1jmfbEGQf.J2jXPSZWCrIS
INSERT INTO usuario (id, numero_documento, tipo_documento, nombre, correo, telefono, password_hash, fk_estatus, usuario_registro) VALUES
(1, 'V-10000001', 'Cédula', 'Administrador Sistema', 'admin@distribmax.com',   '+582128001234', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, 'system'),
(2, 'V-20000002', 'Cédula', 'Ana Pérez',             'gerente@distribmax.com', '+582124001234', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, 'system'),
(3, 'V-30000003', 'Cédula', 'Luis García',           'cajero@distribmax.com',  '+582126001234', '$2b$10$FX5Lz/p8fzUUQ3fIBInr9ek0pK3oGX1jmfbEGQf.J2jXPSZWCrIS', 1, 'system'),
(4, 'V-40000004', 'Cédula', 'María Rodríguez',       'admin@farmaplus.com',    '+582617001234', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, 'system');

-- USUARIO_CLIENTE (app móvil)
-- Cliente2024* => $2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW
INSERT INTO usuarios_clientes (id, nombre, apellido, password_hash, cedula_rif, telefono, correo, fk_estatus, fk_compania, usuario_registro) VALUES
(1, 'Carlos',    'Martínez', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'V-15000001', '+584141234567', 'cliente@prueba.com',     1, 1, 'system'),
(2, 'Sofía',     'Jiménez',  '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'V-16000002', '+584261234568', 'sofia.jimenez@mail.com', 1, 1, 'system'),
(3, 'Alejandro', 'Torres',   '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'V-17000003', '+584121234569', 'alex.torres@mail.com',   1, 2, 'system');

-- CLIENTES (registrados por operador)
INSERT INTO clientes (id, nombre, apellido, cedula_rif, telefono, correo, fk_usuario, fk_estatus, fk_compania, usuario_registro) VALUES
(1, 'Empresa',   'Gráfica XYZ', 'J-55544433-2', '+582125551234', 'compras@graficaxyz.com', 1, 1, 1, 'system'),
(2, 'Ferretería','El Clavo',    'J-66677788-1', '+582614441234', 'pedidos@elclavo.com',    2, 1, 1, 'system');

COMMIT;
-- ==============================================================================
-- FIN: 02_seed_base.sql
-- ==============================================================================

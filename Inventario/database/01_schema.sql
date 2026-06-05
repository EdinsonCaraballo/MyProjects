-- ==============================================================================
-- INVENTARIO SYSTEM - SCHEMA DDL (PostgreSQL)
-- Archivo: 01_schema.sql
-- Descripción: Creación de todas las tablas e índices
-- Ejecutar PRIMERO, luego 02_seed_data.sql
-- ==============================================================================

BEGIN;

-- -------------------------------------------------------
-- TABLA: estatus
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS estatus (
    id               SERIAL PRIMARY KEY,
    fk_estatus       VARCHAR(50),
    fecha_registro   TIMESTAMP NOT NULL DEFAULT NOW(),
    usuario_registro VARCHAR(100),
    usuario_modificacion VARCHAR(100),
    fecha_actualizacion  TIMESTAMP
);

-- -------------------------------------------------------
-- TABLA: type_document
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS type_document (
    id                   SERIAL PRIMARY KEY,
    type_document        VARCHAR(100) NOT NULL,
    fk_estatus           INT REFERENCES estatus(id),
    fecha_registro       TIMESTAMP NOT NULL DEFAULT NOW(),
    usuario_registro     VARCHAR(100),
    usuario_modificacion VARCHAR(100),
    fecha_actualizacion  TIMESTAMP
);

-- -------------------------------------------------------
-- TABLA: tipo_comercio
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS tipo_comercio (
    id                   SERIAL PRIMARY KEY,
    nombre               VARCHAR(150) NOT NULL,
    descripcion          TEXT,
    fk_estatus           INT REFERENCES estatus(id),
    fecha_registro       TIMESTAMP NOT NULL DEFAULT NOW(),
    usuario_registro     VARCHAR(100),
    usuario_modificacion VARCHAR(100),
    fecha_actualizacion  TIMESTAMP
);

-- -------------------------------------------------------
-- TABLA: company
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS company (
    id                   SERIAL PRIMARY KEY,
    fk_type_document     INT REFERENCES type_document(id),
    logo                 TEXT,
    rif_cedula           VARCHAR(50),
    logo_url             TEXT,
    direccion_fiscal     TEXT,
    nombre_comercial     VARCHAR(200),
    name_razon_social    VARCHAR(200) NOT NULL,
    tipo_comercio        INT REFERENCES tipo_comercio(id),
    sitio_web            VARCHAR(255),
    location             VARCHAR(500),
    fk_estatus           INT REFERENCES estatus(id),
    fecha_registro       TIMESTAMP NOT NULL DEFAULT NOW(),
    usuario_registro     VARCHAR(100),
    usuario_modificacion VARCHAR(100),
    fecha_actualizacion  TIMESTAMP
);

-- -------------------------------------------------------
-- TABLA: cod_area__telefono
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS cod_area__telefono (
    id                   SERIAL PRIMARY KEY,
    cod_area             VARCHAR(10) NOT NULL,
    fk_estatus           INT REFERENCES estatus(id),
    fecha_registro       TIMESTAMP NOT NULL DEFAULT NOW(),
    usuario_registro     VARCHAR(100),
    usuario_modificacion VARCHAR(100),
    fecha_actualizacion  TIMESTAMP
);

-- -------------------------------------------------------
-- TABLA: pais
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS pais (
    id                   SERIAL PRIMARY KEY,
    codigo_iso           VARCHAR(10) NOT NULL,
    nombre               VARCHAR(150) NOT NULL,
    fk_estatus           INT REFERENCES estatus(id),
    fecha_registro       TIMESTAMP NOT NULL DEFAULT NOW(),
    usuario_registro     VARCHAR(100),
    usuario_modificacion VARCHAR(100),
    fecha_actualizacion  TIMESTAMP
);

-- -------------------------------------------------------
-- TABLA: regiones
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS regiones (
    id                   SERIAL PRIMARY KEY,
    fk_pais              INT REFERENCES pais(id),
    nombre               VARCHAR(150) NOT NULL,
    fk_estatus           INT REFERENCES estatus(id),
    fecha_registro       TIMESTAMP NOT NULL DEFAULT NOW(),
    usuario_registro     VARCHAR(100),
    usuario_modificacion VARCHAR(100),
    fecha_actualizacion  TIMESTAMP
);

-- -------------------------------------------------------
-- TABLA: estados
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS estados (
    id                   SERIAL PRIMARY KEY,
    fk_regiones          INT REFERENCES regiones(id),
    nombre               VARCHAR(150) NOT NULL,
    fk_estatus           INT REFERENCES estatus(id),
    fecha_registro       TIMESTAMP NOT NULL DEFAULT NOW(),
    usuario_registro     VARCHAR(100),
    usuario_modificacion VARCHAR(100),
    fecha_actualizacion  TIMESTAMP
);

-- -------------------------------------------------------
-- TABLA: ciudades
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS ciudades (
    id                   SERIAL PRIMARY KEY,
    fk_estados           INT REFERENCES estados(id),
    nombre               VARCHAR(150) NOT NULL,
    fk_estatus           INT REFERENCES estatus(id),
    fecha_registro       TIMESTAMP NOT NULL DEFAULT NOW(),
    usuario_registro     VARCHAR(100),
    usuario_modificacion VARCHAR(100),
    fecha_actualizacion  TIMESTAMP
);

-- -------------------------------------------------------
-- TABLA: municipios
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS municipios (
    id                   SERIAL PRIMARY KEY,
    fk_estados           INT REFERENCES estados(id),
    nombre               VARCHAR(150) NOT NULL,
    fk_estatus           INT REFERENCES estatus(id),
    fecha_registro       TIMESTAMP NOT NULL DEFAULT NOW(),
    usuario_registro     VARCHAR(100),
    usuario_modificacion VARCHAR(100),
    fecha_actualizacion  TIMESTAMP
);

-- -------------------------------------------------------
-- TABLA: parroquias
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS parroquias (
    id                   SERIAL PRIMARY KEY,
    fk_municipios        INT REFERENCES municipios(id),
    nombre               VARCHAR(150) NOT NULL,
    fk_estatus           INT REFERENCES estatus(id),
    fecha_registro       TIMESTAMP NOT NULL DEFAULT NOW(),
    usuario_registro     VARCHAR(100),
    usuario_modificacion VARCHAR(100),
    fecha_actualizacion  TIMESTAMP
);

-- -------------------------------------------------------
-- TABLA: sectores
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS sectores (
    id                   SERIAL PRIMARY KEY,
    fk_parroquia         INT REFERENCES parroquias(id),
    nombre               VARCHAR(150) NOT NULL,
    fk_estatus           INT REFERENCES estatus(id),
    fecha_registro       TIMESTAMP NOT NULL DEFAULT NOW(),
    usuario_registro     VARCHAR(100),
    usuario_modificacion VARCHAR(100),
    fecha_actualizacion  TIMESTAMP
);

-- -------------------------------------------------------
-- TABLA: sucursal
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS sucursal (
    id                   SERIAL PRIMARY KEY,
    fk_company           INT REFERENCES company(id),
    nombre_sucursal      VARCHAR(200) NOT NULL,
    codigo_sucursal      VARCHAR(50) UNIQUE,
    ind_principal        BOOLEAN DEFAULT FALSE,
    ind_delivery         BOOLEAN DEFAULT FALSE,
    location             TEXT,
    horario_apertura     TIME,
    horario_cierre       TIME,
    fk_estatus           INT REFERENCES estatus(id),
    fecha_registro       TIMESTAMP NOT NULL DEFAULT NOW(),
    usuario_registro     VARCHAR(100),
    usuario_modificacion VARCHAR(100),
    fecha_actualizacion  TIMESTAMP
);

-- -------------------------------------------------------
-- TABLA: telefono__sucursal
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS telefono__sucursal (
    id                      SERIAL PRIMARY KEY,
    fk_sucursal             INT REFERENCES sucursal(id),
    fk_cod_area__telefono   INT REFERENCES cod_area__telefono(id),
    numero_telefono         VARCHAR(20) NOT NULL,
    fk_estatus              INT REFERENCES estatus(id),
    fecha_registro          TIMESTAMP NOT NULL DEFAULT NOW(),
    usuario_registro        VARCHAR(100),
    usuario_modificacion    VARCHAR(100),
    fecha_actualizacion     TIMESTAMP
);

-- -------------------------------------------------------
-- TABLA: correo_sucursal
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS correo_sucursal (
    id                   SERIAL PRIMARY KEY,
    fk_sucursal          INT REFERENCES sucursal(id),
    correo               VARCHAR(255) NOT NULL,
    fk_estatus           INT REFERENCES estatus(id),
    fecha_registro       TIMESTAMP NOT NULL DEFAULT NOW(),
    usuario_registro     VARCHAR(100),
    usuario_modificacion VARCHAR(100),
    fecha_actualizacion  TIMESTAMP
);

-- -------------------------------------------------------
-- TABLA: direccion_sucursal
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS direccion_sucursal (
    id                   SERIAL PRIMARY KEY,
    fk_pais              INT REFERENCES pais(id),
    fk_region            INT REFERENCES regiones(id),
    fk_estado            INT REFERENCES estados(id),
    fk_ciudad            INT REFERENCES ciudades(id),
    fk_municipio         INT REFERENCES municipios(id),
    fk_parroquia         INT REFERENCES parroquias(id),
    fk_sector            INT REFERENCES sectores(id),
    indicador_principal  BOOLEAN DEFAULT FALSE,
    nombre_direccion     VARCHAR(255),
    tipo_direccion       VARCHAR(50),
    codigo_postal        VARCHAR(20),
    fk_estatus           INT REFERENCES estatus(id),
    fecha_registro       TIMESTAMP NOT NULL DEFAULT NOW(),
    usuario_registro     VARCHAR(100),
    usuario_modificacion VARCHAR(100),
    fecha_actualizacion  TIMESTAMP
);

-- -------------------------------------------------------
-- TABLA: monedas
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS monedas (
    id                   SERIAL PRIMARY KEY,
    codigo_iso           VARCHAR(10) NOT NULL UNIQUE,
    nombre               VARCHAR(100) NOT NULL,
    simbolo              VARCHAR(10),
    es_base              BOOLEAN DEFAULT FALSE,
    fk_estatus           INT REFERENCES estatus(id),
    fecha_registro       TIMESTAMP NOT NULL DEFAULT NOW(),
    usuario_registro     VARCHAR(100),
    usuario_modificacion VARCHAR(100),
    fecha_actualizacion  TIMESTAMP
);

-- -------------------------------------------------------
-- TABLA: tasas_cambio
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS tasas_cambio (
    id                   SERIAL PRIMARY KEY,
    fk_moneda_origen     INT REFERENCES monedas(id),
    fk_moneda_destino    INT REFERENCES monedas(id),
    tasa_cambio          DECIMAL(20,8) NOT NULL,
    fk_estatus           INT REFERENCES estatus(id),
    fecha_registro       TIMESTAMP NOT NULL DEFAULT NOW(),
    usuario_registro     VARCHAR(100),
    usuario_modificacion VARCHAR(100),
    fecha_actualizacion  TIMESTAMP
);

-- -------------------------------------------------------
-- TABLA: categorias
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS categorias (
    id                   SERIAL PRIMARY KEY,
    nombre               VARCHAR(150) NOT NULL,
    fk_categoria         INT REFERENCES categorias(id),  -- autorelación
    fk_estatus           INT REFERENCES estatus(id),
    fecha_registro       TIMESTAMP NOT NULL DEFAULT NOW(),
    usuario_registro     VARCHAR(100),
    usuario_modificacion VARCHAR(100),
    fecha_actualizacion  TIMESTAMP
);

-- -------------------------------------------------------
-- TABLA: catalogo_productos
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS catalogo_productos (
    id                   SERIAL PRIMARY KEY,
    nombre               VARCHAR(200) NOT NULL,
    descripcion          TEXT,
    fk_categoria         INT REFERENCES categorias(id),
    fk_estatus           INT REFERENCES estatus(id),
    fecha_registro       TIMESTAMP NOT NULL DEFAULT NOW(),
    usuario_registro     VARCHAR(100),
    usuario_modificacion VARCHAR(100),
    fecha_actualizacion  TIMESTAMP
);

-- -------------------------------------------------------
-- TABLA: productos
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS productos (
    id                   SERIAL PRIMARY KEY,
    codigo_barras        VARCHAR(100) UNIQUE,
    codigo_inventario    VARCHAR(100) UNIQUE,  -- SKU
    fk_catalogo_productos INT REFERENCES catalogo_productos(id),
    vence                BOOLEAN DEFAULT FALSE,
    stock_minimo         DECIMAL(15,4) DEFAULT 0,
    stock_maximo         DECIMAL(15,4),
    fk_estatus           INT REFERENCES estatus(id),
    fk_compania          INT REFERENCES company(id),
    fecha_registro       TIMESTAMP NOT NULL DEFAULT NOW(),
    usuario_registro     VARCHAR(100),
    usuario_modificacion VARCHAR(100),
    fecha_actualizacion  TIMESTAMP
);

-- -------------------------------------------------------
-- TABLA: lotes_inventario
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS lotes_inventario (
    id                   SERIAL PRIMARY KEY,
    fk_sucursal          INT REFERENCES sucursal(id),
    fk_productos         INT REFERENCES productos(id),
    numero_lote          VARCHAR(100),
    cantidad_inicial     DECIMAL(15,4) NOT NULL DEFAULT 0,
    cantidad_actual      DECIMAL(15,4) NOT NULL DEFAULT 0,
    fk_moneda            INT REFERENCES monedas(id),
    precio_compra        DECIMAL(15,4),
    fecha_produccion     DATE,
    fecha_vencimiento    DATE,
    fk_estatus           INT REFERENCES estatus(id),
    fk_compania          INT REFERENCES company(id),
    fecha_registro       TIMESTAMP NOT NULL DEFAULT NOW(),
    usuario_registro     VARCHAR(100),
    usuario_modificacion VARCHAR(100),
    fecha_actualizacion  TIMESTAMP
);

-- -------------------------------------------------------
-- TABLA: precios_venta
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS precios_venta (
    id                     SERIAL PRIMARY KEY,
    fk_producto            INT REFERENCES productos(id),
    fk_sucursal            INT REFERENCES sucursal(id),
    fk_moneda              INT REFERENCES monedas(id),
    precio_venta_neto      DECIMAL(15,4) NOT NULL,
    porcentaje_iva         DECIMAL(5,2) DEFAULT 16.00,
    precio_venta_publico   DECIMAL(15,4),
    fk_estatus             INT REFERENCES estatus(id),
    fk_compania            INT REFERENCES company(id),
    fecha_registro         TIMESTAMP NOT NULL DEFAULT NOW(),
    usuario_registro       VARCHAR(100),
    usuario_modificacion   VARCHAR(100),
    fecha_actualizacion    TIMESTAMP
);

-- -------------------------------------------------------
-- TABLA: tipos_movimiento
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS tipos_movimiento (
    id                   SERIAL PRIMARY KEY,
    nombre               VARCHAR(100) NOT NULL,
    factor               SMALLINT NOT NULL CHECK (factor IN (1, -1)),
    fk_estatus           INT REFERENCES estatus(id),
    fk_compania          INT REFERENCES company(id),
    fecha_registro       TIMESTAMP NOT NULL DEFAULT NOW(),
    usuario_registro     VARCHAR(100),
    usuario_modificacion VARCHAR(100),
    fecha_actualizacion  TIMESTAMP
);

-- -------------------------------------------------------
-- TABLA: historial_inventario
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS historial_inventario (
    id                     SERIAL PRIMARY KEY,
    fk_tipo_movimiento     INT REFERENCES tipos_movimiento(id),
    fk_lote_inventario     INT REFERENCES lotes_inventario(id),
    cantidad               DECIMAL(15,4) NOT NULL,
    tasa_cambio_momento    DECIMAL(20,8),
    referencia_id          INT,
    motivo_detalle         TEXT,
    fk_estatus             INT REFERENCES estatus(id),
    fk_compania            INT REFERENCES company(id),
    fecha_registro         TIMESTAMP NOT NULL DEFAULT NOW(),
    usuario_registro       VARCHAR(100),
    usuario_modificacion   VARCHAR(100),
    fecha_actualizacion    TIMESTAMP
);

-- -------------------------------------------------------
-- TABLA: usuario
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuario (
    id                   SERIAL PRIMARY KEY,
    numero_documento     VARCHAR(50),
    tipo_documento       VARCHAR(50),
    nombre               VARCHAR(150) NOT NULL,
    correo               VARCHAR(255) UNIQUE NOT NULL,
    telefono             VARCHAR(30),
    password_hash        VARCHAR(255) NOT NULL,
    fk_estatus           INT REFERENCES estatus(id),
    fecha_registro       TIMESTAMP NOT NULL DEFAULT NOW(),
    usuario_registro     VARCHAR(100),
    usuario_modificacion VARCHAR(100),
    fecha_actualizacion  TIMESTAMP
);

-- -------------------------------------------------------
-- TABLA: perfil
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS perfil (
    id                   SERIAL PRIMARY KEY,
    nombre_perfil        VARCHAR(100) NOT NULL,
    fk_sucursal          INT REFERENCES sucursal(id),
    fk_estatus           INT REFERENCES estatus(id),
    fk_compania          INT REFERENCES company(id),
    fecha_registro       TIMESTAMP NOT NULL DEFAULT NOW(),
    usuario_registro     VARCHAR(100),
    usuario_modificacion VARCHAR(100),
    fecha_actualizacion  TIMESTAMP
);

-- -------------------------------------------------------
-- TABLA: modulos
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS modulos (
    id                   SERIAL PRIMARY KEY,
    nombre_modulo        VARCHAR(100) NOT NULL,
    fk_estatus           INT REFERENCES estatus(id),
    fecha_registro       TIMESTAMP NOT NULL DEFAULT NOW(),
    usuario_registro     VARCHAR(100),
    usuario_modificacion VARCHAR(100),
    fecha_actualizacion  TIMESTAMP
);

-- -------------------------------------------------------
-- TABLA: acciones_sistema
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS acciones_sistema (
    id                   SERIAL PRIMARY KEY,
    nombre               VARCHAR(100) NOT NULL,
    descripcion          TEXT,
    fk_estatus           INT REFERENCES estatus(id),
    fecha_registro       TIMESTAMP NOT NULL DEFAULT NOW(),
    usuario_registro     VARCHAR(100),
    usuario_modificacion VARCHAR(100),
    fecha_actualizacion  TIMESTAMP
);

-- -------------------------------------------------------
-- TABLA: modulos_acciones
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS modulos_acciones (
    id                   SERIAL PRIMARY KEY,
    fk_modulos           INT REFERENCES modulos(id),
    fk_acciones_sistema  INT REFERENCES acciones_sistema(id),
    fk_estatus           INT REFERENCES estatus(id),
    fecha_registro       TIMESTAMP NOT NULL DEFAULT NOW(),
    usuario_registro     VARCHAR(100),
    usuario_modificacion VARCHAR(100),
    fecha_actualizacion  TIMESTAMP
);

-- -------------------------------------------------------
-- TABLA: perfil__modulos_acciones
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS perfil__modulos_acciones (
    id                   SERIAL PRIMARY KEY,
    fk_perfil            INT REFERENCES perfil(id),
    fk_modulos_acciones  INT REFERENCES modulos_acciones(id),
    fk_estatus           INT REFERENCES estatus(id),
    fecha_registro       TIMESTAMP NOT NULL DEFAULT NOW(),
    usuario_registro     VARCHAR(100),
    usuario_modificacion VARCHAR(100),
    fecha_actualizacion  TIMESTAMP
);

-- -------------------------------------------------------
-- TABLA: clientes
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS clientes (
    id                   SERIAL PRIMARY KEY,
    nombre               VARCHAR(150) NOT NULL,
    apellido             VARCHAR(150),
    cedula_rif           VARCHAR(50),
    telefono             VARCHAR(30),
    correo               VARCHAR(255),
    fk_usuario           INT REFERENCES usuario(id),
    fk_estatus           INT REFERENCES estatus(id),
    fk_compania          INT REFERENCES company(id),
    fecha_registro       TIMESTAMP NOT NULL DEFAULT NOW(),
    usuario_registro     VARCHAR(100),
    usuario_modificacion VARCHAR(100),
    fecha_actualizacion  TIMESTAMP
);

-- -------------------------------------------------------
-- TABLA: usuarios_clientes
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios_clientes (
    id                   SERIAL PRIMARY KEY,
    nombre               VARCHAR(150) NOT NULL,
    apellido             VARCHAR(150),
    password_hash        VARCHAR(255) NOT NULL,
    cedula_rif           VARCHAR(50),
    telefono             VARCHAR(30),
    correo               VARCHAR(255) UNIQUE NOT NULL,
    location             VARCHAR(500),
    fk_usuario           INT REFERENCES usuario(id),
    fk_estatus           INT REFERENCES estatus(id),
    fk_compania          INT REFERENCES company(id),
    fecha_registro       TIMESTAMP NOT NULL DEFAULT NOW(),
    usuario_registro     VARCHAR(100),
    usuario_modificacion VARCHAR(100),
    fecha_actualizacion  TIMESTAMP
);

-- -------------------------------------------------------
-- TABLA: cliente_favoritos
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS cliente_favoritos (
    id                   SERIAL PRIMARY KEY,
    fk_usuario_cliente   INT REFERENCES usuarios_clientes(id),
    fk_producto          INT REFERENCES productos(id),
    fecha_agregado       TIMESTAMP DEFAULT NOW(),
    fk_usuario           INT REFERENCES usuario(id),
    fk_estatus           INT REFERENCES estatus(id),
    fk_compania          INT REFERENCES company(id),
    fecha_registro       TIMESTAMP NOT NULL DEFAULT NOW(),
    usuario_registro     VARCHAR(100),
    usuario_modificacion VARCHAR(100),
    fecha_actualizacion  TIMESTAMP
);

-- -------------------------------------------------------
-- TABLA: pedidos
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS pedidos (
    id                              SERIAL PRIMARY KEY,
    fk_cliente                      INT REFERENCES clientes(id),
    fk_usuario_cliente              INT REFERENCES usuarios_clientes(id),
    fk_sucursal                     INT REFERENCES sucursal(id),
    fecha_pedido                    TIMESTAMP NOT NULL DEFAULT NOW(),
    monto_total_base                DECIMAL(15,4),
    monto_total_moneda_extranjera   DECIMAL(15,4),
    tasa_cambio_pedido              DECIMAL(20,8),
    fk_estatus                      INT REFERENCES estatus(id),
    requiere_delivery               BOOLEAN DEFAULT FALSE,
    fk_compania                     INT REFERENCES company(id),
    fecha_registro                  TIMESTAMP NOT NULL DEFAULT NOW(),
    usuario_registro                VARCHAR(100),
    usuario_modificacion            VARCHAR(100),
    fecha_actualizacion             TIMESTAMP
);

-- -------------------------------------------------------
-- TABLA: pedido_detalles
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS pedido_detalles (
    id                       SERIAL PRIMARY KEY,
    fk_pedido                INT REFERENCES pedidos(id),
    fk_producto              INT REFERENCES productos(id),
    fk_lote_inventario       INT REFERENCES lotes_inventario(id),
    cantidad                 DECIMAL(15,4) NOT NULL,
    precio_unitario_momento  DECIMAL(15,4) NOT NULL,
    fk_compania              INT REFERENCES company(id)
);

-- -------------------------------------------------------
-- TABLA: metodo_pago
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS metodo_pago (
    id                   SERIAL PRIMARY KEY,
    nombre               VARCHAR(100) NOT NULL,
    fk_estatus           INT REFERENCES estatus(id),
    fk_compania          INT REFERENCES company(id),
    fecha_registro       TIMESTAMP NOT NULL DEFAULT NOW(),
    usuario_registro     VARCHAR(100),
    usuario_modificacion VARCHAR(100),
    fecha_actualizacion  TIMESTAMP
);

-- -------------------------------------------------------
-- TABLA: pagos_pedido
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS pagos_pedido (
    id                   SERIAL PRIMARY KEY,
    fk_pedido            INT REFERENCES pedidos(id),
    fk_metodo_pago       INT REFERENCES metodo_pago(id),
    fk_moneda            INT REFERENCES monedas(id),
    monto_pagado         DECIMAL(15,4) NOT NULL,
    referencia_bancaria  VARCHAR(100),
    captura_pago_url     TEXT,
    fk_estatus_pago      VARCHAR(20) DEFAULT 'Pendiente'
                             CHECK (fk_estatus_pago IN ('Pendiente','Aprobado','Rechazado')),
    fk_estatus           INT REFERENCES estatus(id),
    fk_compania          INT REFERENCES company(id),
    fecha_registro       TIMESTAMP NOT NULL DEFAULT NOW(),
    usuario_registro     VARCHAR(100),
    usuario_modificacion VARCHAR(100),
    fecha_actualizacion  TIMESTAMP
);

-- -------------------------------------------------------
-- TABLA: delivery_config_sucursal
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS delivery_config_sucursal (
    id                   SERIAL PRIMARY KEY,
    fk_sucursal          INT REFERENCES sucursal(id),
    posee_delivery       BOOLEAN DEFAULT FALSE,
    costo_fijo_delivery  DECIMAL(15,4) DEFAULT 0,
    radio_cobertura_km   DECIMAL(8,2),
    fk_compania          INT REFERENCES company(id)
);

-- -------------------------------------------------------
-- TABLA: despachos_delivery
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS despachos_delivery (
    id                       SERIAL PRIMARY KEY,
    fk_pedido                INT REFERENCES pedidos(id),
    direccion_entrega_texto  TEXT,
    fk_estado                INT REFERENCES estados(id),
    fk_ciudad                INT REFERENCES ciudades(id),
    fk_municipio             INT REFERENCES municipios(id),
    fk_parroquia             INT REFERENCES parroquias(id),
    location                 TEXT,
    nombre_repartidor        VARCHAR(150),
    telefono_repartidor      VARCHAR(30),
    fecha_entrega            TIMESTAMP,
    fk_compania              INT REFERENCES company(id)
);

-- -------------------------------------------------------
-- TABLA: rutas_delivery
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS rutas_delivery (
    id                     SERIAL PRIMARY KEY,
    fk_pedido              INT REFERENCES pedidos(id),
    nombre_motorizado      VARCHAR(150),
    telefono_motorizado    VARCHAR(30),
    costo_delivery         DECIMAL(15,4),
    direccion_destino      TEXT,
    coordenadas_destino    VARCHAR(100),
    fecha_hora_salida      TIMESTAMP,
    fecha_hora_entrega     TIMESTAMP,
    fk_compania            INT REFERENCES company(id)
);

-- ==============================================================================
-- ÍNDICES
-- ==============================================================================

-- company
CREATE INDEX IF NOT EXISTS idx_company_fk_estatus       ON company(fk_estatus);
CREATE INDEX IF NOT EXISTS idx_company_rif_cedula        ON company(rif_cedula);

-- sucursal
CREATE INDEX IF NOT EXISTS idx_sucursal_fk_company      ON sucursal(fk_company);
CREATE INDEX IF NOT EXISTS idx_sucursal_fk_estatus      ON sucursal(fk_estatus);
CREATE INDEX IF NOT EXISTS idx_sucursal_codigo          ON sucursal(codigo_sucursal);

-- productos
CREATE INDEX IF NOT EXISTS idx_productos_codigo_barras  ON productos(codigo_barras);
CREATE INDEX IF NOT EXISTS idx_productos_sku            ON productos(codigo_inventario);
CREATE INDEX IF NOT EXISTS idx_productos_fk_compania    ON productos(fk_compania);
CREATE INDEX IF NOT EXISTS idx_productos_fk_estatus     ON productos(fk_estatus);

-- lotes_inventario
CREATE INDEX IF NOT EXISTS idx_lotes_fk_sucursal        ON lotes_inventario(fk_sucursal);
CREATE INDEX IF NOT EXISTS idx_lotes_fk_productos       ON lotes_inventario(fk_productos);
CREATE INDEX IF NOT EXISTS idx_lotes_fecha_vencimiento  ON lotes_inventario(fecha_vencimiento);
CREATE INDEX IF NOT EXISTS idx_lotes_fk_compania        ON lotes_inventario(fk_compania);

-- historial_inventario
CREATE INDEX IF NOT EXISTS idx_hist_fk_lote             ON historial_inventario(fk_lote_inventario);
CREATE INDEX IF NOT EXISTS idx_hist_fk_tipo             ON historial_inventario(fk_tipo_movimiento);
CREATE INDEX IF NOT EXISTS idx_hist_fecha               ON historial_inventario(fecha_registro);

-- pedidos
CREATE INDEX IF NOT EXISTS idx_pedidos_fk_sucursal      ON pedidos(fk_sucursal);
CREATE INDEX IF NOT EXISTS idx_pedidos_fecha            ON pedidos(fecha_pedido);
CREATE INDEX IF NOT EXISTS idx_pedidos_fk_compania      ON pedidos(fk_compania);
CREATE INDEX IF NOT EXISTS idx_pedidos_fk_estatus       ON pedidos(fk_estatus);

-- pedido_detalles
CREATE INDEX IF NOT EXISTS idx_det_fk_pedido            ON pedido_detalles(fk_pedido);
CREATE INDEX IF NOT EXISTS idx_det_fk_producto          ON pedido_detalles(fk_producto);

-- pagos_pedido
CREATE INDEX IF NOT EXISTS idx_pagos_fk_pedido          ON pagos_pedido(fk_pedido);
CREATE INDEX IF NOT EXISTS idx_pagos_fk_estatus         ON pagos_pedido(fk_estatus);

-- precios_venta
CREATE INDEX IF NOT EXISTS idx_precios_fk_producto      ON precios_venta(fk_producto);
CREATE INDEX IF NOT EXISTS idx_precios_fk_sucursal      ON precios_venta(fk_sucursal);

-- tasas_cambio
CREATE INDEX IF NOT EXISTS idx_tasas_origen             ON tasas_cambio(fk_moneda_origen);
CREATE INDEX IF NOT EXISTS idx_tasas_destino            ON tasas_cambio(fk_moneda_destino);
CREATE INDEX IF NOT EXISTS idx_tasas_fecha              ON tasas_cambio(fecha_registro);

-- usuario
CREATE INDEX IF NOT EXISTS idx_usuario_correo           ON usuario(correo);
CREATE INDEX IF NOT EXISTS idx_usuario_fk_estatus       ON usuario(fk_estatus);

-- clientes
CREATE INDEX IF NOT EXISTS idx_clientes_fk_compania     ON clientes(fk_compania);
CREATE INDEX IF NOT EXISTS idx_clientes_cedula          ON clientes(cedula_rif);

-- usuarios_clientes
CREATE INDEX IF NOT EXISTS idx_uc_correo                ON usuarios_clientes(correo);
CREATE INDEX IF NOT EXISTS idx_uc_fk_compania           ON usuarios_clientes(fk_compania);

COMMIT;
-- ==============================================================================
-- FIN: 01_schema.sql
-- ==============================================================================

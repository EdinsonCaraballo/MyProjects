# MyProjects - Sistema de Gestión de Inventario Monorepo

Plataforma integral de gestión de inventario, compras, ventas y trazabilidad empresarial.

---

## 🏗 Arquitectura del Proyecto

- **Base de Datos**: PostgreSQL 15 Alpine (con scripts automáticos de inicialización y datos de prueba).
- **Backend**: Python 3.10 / Django REST Framework con autenticación JWT y roles.
- **Frontend Web**: React 18 + Vite con Bootstrap 5 custom, modo oscuro y DataTables interactivos.
- **Frontend Mobile**: React Native / Expo.
- **Orquestación**: Docker Compose.

---

## 🚀 Inicio Rápido con Docker

Al clonar este repositorio por primera vez, la base de datos se inicializa y se llena de registros automáticamente gracias al montaje de `./database` en `/docker-entrypoint-initdb.d` en PostgreSQL.

### 1. Clonar el repositorio
```bash
git clone git@github-personal:EdinsonCaraballo/MyProjects.git
cd MyProjects/Inventario
```

### 2. Configurar variables de entorno (Opcional)
El archivo `docker-compose.yml` ya cuenta con los valores por defecto configurados para desarrollo inmediato. Si deseas personalizar:
```bash
cp .env.example .env
```

### 3. Levantar los servicios con Docker Compose
```bash
docker compose up -d --build
```

Esto levantará automáticamente:
1. **`inventario_db`** (PostgreSQL):
   - Se ejecuta en el puerto host `54321`.
   - Inicializa el esquema completo (`01_schema.sql`).
   - Carga catálogos base, módulos, perfiles y usuarios (`02_seed_base.sql`).
   - Carga categorías, productos, lotes y transacciones iniciales (`03_seed_transaccional.sql`).
2. **`inventario_backend`** (Django API):
   - Disponible en `http://localhost:8765`.
3. **`inventario_frontend_web`** (React + Vite):
   - Disponible en `http://localhost:3721`.

---

## 🔐 Credenciales por Defecto (Seed Data)

### Usuarios del Sistema:
| Rol | Correo | Contraseña |
| :--- | :--- | :--- |
| **Administrador** | `admin@distribmax.com` | `Admin123*` |
| **Gerente** | `gerente@distribmax.com` | `Admin123*` |
| **Cajero** | `cajero@distribmax.com` | `Cajero2024*` |

### Base de Datos PostgreSQL:
- **Base de Datos**: `inv_secure_db_prod`
- **Usuario**: `inv_db_user_admin`
- **Contraseña**: `Inv2026SecureDbPass`
- **Puerto Host**: `54321`

---

## 📦 Estructura de Archivos de Base de Datos
- `Inventario/database/01_schema.sql`: Estructura DDL de tablas, tipos, índices y restricciones.
- `Inventario/database/02_seed_base.sql`: Catálogos maestros, roles, permisos y usuarios iniciales.
- `Inventario/database/03_seed_transaccional.sql`: Productos, inventarios y movimientos transaccionales.

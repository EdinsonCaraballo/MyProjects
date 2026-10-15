# Módulo de Inventario (Monorepo)

Sistema de gestión empresarial con backend Django, base de datos PostgreSQL, y frontends Web (React) y Mobile (React Native).

## 🚀 Despliegue con Docker Compose

La base de datos cuenta con inicialización automática. Cuando levantas el entorno por primera vez, PostgreSQL ejecuta todos los scripts de la carpeta `./database` (`01_schema.sql`, `02_seed_base.sql`, `03_seed_transaccional.sql`), creando las tablas y cargando usuarios y datos de prueba.

### Iniciar todos los contenedores:
```bash
docker compose up -d --build
```

### URLs de acceso:
- **Frontend Web**: http://localhost:3721
- **Backend API**: http://localhost:8765
- **Base de Datos PostgreSQL**: localhost:54321

### Usuarios de prueba:
- **Admin**: `admin@distribmax.com` / `Admin123*`
- **Gerente**: `gerente@distribmax.com` / `Admin123*`
- **Cajero**: `cajero@distribmax.com` / `Cajero2024*`

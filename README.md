# 💳 Credit Card Management Application

Aplicación para la gestión de tarjetas de crédito, pagos y transacciones, desarrollada como parte de un reto técnico Full Stack para la empresa Tuya.

El sistema permite a los usuarios registrarse, autenticarse, gestionar sus tarjetas, realizar pagos y visualizar el historial de transacciones, todo de forma segura mediante autenticación mediante el uso de tokens (JWT).

---

## 🚀 Funcionalidades Principales

🔐 Autenticación
- Registro de usuarios
- Inicio de sesión
- Autenticación basada en JWT
- Protección de endpoints mediante token

💳 Gestión de Tarjetas
- Crear tarjetas de crédito
- Listar tarjetas del usuario
- Actualizar información de la tarjeta
- Eliminar tarjetas (implementado mediante borrado lógico)

💸 Pagos
- Registrar pagos con tarjetas de crédito

📊 Transacciones
- Listar historial de transacciones
- Ver transacciones por tarjeta
- Historial de cambios de estado

📈 Dashboard
- Resumen general del usuario
- Totales de pagos
- Información agregada por usuario (total tarjetas activas, credito total disponible, cantidad total de pagos realizados)

---

🧱 Arquitectura del Sistema

Backend
- ASP.NET Core (.NET 8)
- Arquitectura Hexagonal (Ports & Adapters)
- Separación clara de:
    - Dominio
    - Casos de uso
    - Infraestructura
    - API
    - Autenticación con JWT
    - Persistencia en MySQL
    - Acceso a datos con Dapper
    - Stored Procedures
    - Middleware global de manejo de errores
    - Swagger con autenticación Bearer

Frontend
- React + TypeScript
- Vite
- TailwindCSS
- Arquitectura basada en:
    - Smart Components (lógica)
    - Dumb Components (UI)
    - Mappers (DTO → Modelos)
    - Manejo de estado de autenticación
    - Interceptores HTTP para JWT
    - Alias de paths para imports limpios

---

📂 Organización del Proyecto

```
.
├── backend
│   ├── CreditCardApp.API
│   ├── CreditCardApp.Application
│   ├── CreditCardApp.Domain
│   ├── CreditCardApp.Infrastructure
│   └── CreditCardApp.sln
│
├── frontend
│   ├── src
│   │   ├── api
│   │   ├── auth
│   │   ├── components
│   │   ├── features
│   │   ├── layouts
│   │   ├── mappers
│   │   ├── models
│   │   ├── pages
│   │   └── router
│   ├── public
│   ├── tailwind.config.ts
│   ├── vite.config.ts
│   └── Dockerfile
│
├── db
│   └── mysql
│       └── init
│           └── init.sql
│
├── docker-compose.yml
└── .env
```

---

⚙️ Requisitos Previos

Para ejecución local
- Node.js >= 18
- .NET SDK 8
- MySQL 8

Para Docker
- Docker
- Docker Compose

---

## Base de Datos

▶️ Ejecución en Local (sin Docker)

```sql
CREATE DATABASE credit_card_app
CHARACTER SET utf8mb4
COLLATE utf8mb4_0900_ai_ci;
```

2️⃣ Ejecutar TODOS los scripts de una carpeta

Desde la raíz del proyecto:

```sql
mysql -u root -p credit_card_app < db/mysql/init/00_init_mysql.sql
mysql -u root -p credit_card_app < db/mysql/init/01_schema_mysql.sql
mysql -u root -p credit_card_app < db/mysql/init/02_procs_mysql.sql
```

Base de datos disponible en:
```bash
MYSQL_HOST=localhost
MYSQL_PORT=3306
```

## Backend

```bash
cd backend
dotnet restore
dotnet run –project CreditCardApp.API
```

Backend disponible en:
- API: http://localhost:5253
- Swagger: http://localhost:5253/swagger

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend disponible en:
- http://localhost:5173

---

🐳 Ejecución con Docker

Levantar toda la aplicación

```bash
docker compose up -d –build
```

Servicios levantados:
- MySQL → localhost:3306
- Backend API → http://localhost:5253
- Frontend → http://localhost:5173

Ver estado de contenedores

```bash
docker compose ps
```

Ver logs

```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mysql
```

---

📘 Swagger (API Documentation)

Swagger está disponible en:

👉 http://localhost:5253/swagger

Incluye:
- Documentación completa de endpoints
- Autenticación con JWT

---

🔐 Autenticación en Swagger
1.	Ejecutar login
2.	Copiar el token JWT
3.	Presionar Authorize
4.	Pegar:

```
Bearer {token}
```

---

🎨 Interfaz de Usuario

El frontend provee:
- Formularios de login y registro
- Gestión visual de tarjetas
- Registro de pagos
- Historial de transacciones
- Dashboard con resumen general

---

🧪 Consideraciones Técnicas
- El UserId se obtiene siempre desde el JWT
- No se envía el UserId desde el frontend
- Validaciones críticas se realizan en backend
- Manejo centralizado de errores
- Arquitectura preparada para escalar

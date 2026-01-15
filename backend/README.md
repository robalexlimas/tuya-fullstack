# 📦 CreditCardApp – Backend API

Backend del sistema CreditCardApp, desarrollado en .NET 8, siguiendo Arquitectura Hexagonal (Ports & Adapters), con autenticación JWT, MySQL como base de datos y ejecución soportada tanto en local como en Docker.

---

🧱 Arquitectura

El backend está organizado bajo Arquitectura Hexagonal, separando responsabilidades claramente:

```
backend/
├── CreditCardApp.API            # Capa de entrada (Controllers, Middlewares)
├── CreditCardApp.Application    # Casos de uso (UseCases, DTOs)
├── CreditCardApp.Domain         # Dominio (Entidades, Puertos)
├── CreditCardApp.Infrastructure # Infraestructura (DB, Security, Repositorios)
```

🔁 Flujo general

```
Controller → UseCase → Domain Port → Infrastructure Adapter → Database
```

---

🔐 Autenticación
- Autenticación basada en JWT
- Tokens firmados con HMAC SHA256
- Claims principales:
    - sub → UserId
    - uid → UserId
    - email
    - unique_name

Endpoints de Auth

<table>
  <thead>
    <tr>
      <th>Método</th>
      <th>Endpoint</th>
      <th>Descripción</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>POST</td>
      <td>/api/auth/register</td>
      <td>Registro de usuario</td>
    </tr>
    <tr>
      <td>POST</td>
      <td>/api/auth/login</td>
      <td>Login y generación de JWT</td>
    </tr>
    <tr>
      <td>GET</td>
      <td>/api/auth/me</td>
      <td>Información del usuario autenticado</td>
    </tr>
  </tbody>
</table>

---

💳 Funcionalidades Implementadas

👤 Usuarios
- Registro
- Login
- Obtener perfil autenticado

💳 Tarjetas de crédito
- Crear tarjeta
- Listar tarjetas por usuario
- Actualizar tarjeta
- Eliminar tarjeta (borrado lógico)

💸 Compras
- Registrar compras

📜 Transacciones
- Listar transacciones
- Filtrar por tarjeta y estado
- Historial de cambios de transacción
- Resumen general del usuario

---

🛢️ Base de Datos
- MySQL 8
- Acceso mediante Stored Procedures
- Conexión usando MySqlConnector + Dapper
- UUIDs manejados como CHAR(36)

Inicialización

Los Stored Procedures se cargan automáticamente desde:

```bash
db/mysql/init/
```

al levantar Docker.

---

⚙️ Variables de Entorno

Variables requeridas

```bash
MYSQL_HOST
MYSQL_PORT
MYSQL_DATABASE
MYSQL_USER
MYSQL_PASSWORD

JWT_SIGNING_KEY
JWT_ISSUER
JWT_AUDIENCE
JWT_EXP_MINUTES
```

Ejemplo .env

```bash
MYSQL_HOST=mysql
MYSQL_PORT=3306
MYSQL_DATABASE=credit_card_app
MYSQL_USER=appuser
MYSQL_PASSWORD=apppass

JWT_SIGNING_KEY=super_secret_key
JWT_ISSUER=CreditCardApp
JWT_AUDIENCE=CreditCardApp
JWT_EXP_MINUTES=60
```

---

▶️ Ejecutar en Local (sin Docker)

1️⃣ Levantar MySQL local
- MySQL debe estar corriendo en localhost:3306
- Ejecutar scripts SQL manualmente

```bash
mysql -u appuser -p < db/mysql/init/schema.sql
```

2️⃣ Ejecutar backend

```bash
cd backend
dotnet restore
dotnet run –project CreditCardApp.API
```

API disponible en:

```
http://localhost:5253
```

---

🐳 Ejecutar con Docker (Recomendado)

1️⃣ Build y run

```bash
docker compose up –build
```

2️⃣ Servicios levantados

<table>
  <thead>
    <tr>
      <th>Servicio</th>
      <th>URL</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Backend</td>
      <td>http://localhost:5253</td>
    </tr>
    <tr>
      <td>Swagger</td>
      <td>http://localhost:5253/swagger</td>
    </tr>
    <tr>
      <td>MySQL</td>
      <td>localhost:3306</td>
    </tr>
  </tbody>
</table>

---

📘 Swagger
- Swagger habilitado por defecto
- Incluye autenticación JWT

```
Authorization: Bearer {token}
```

URL:

```
http://localhost:5253/swagger
```

---

🧩 Middlewares
- GlobalExceptionHandlerMiddleware
- Manejo centralizado de errores
- Respuestas normalizadas
- Soporte para errores MySQL, validación y autorización

---

🔍 Logging
- Logs por consola (posibilidad de ser adaptado para soportar herramientas externas)
- Errores críticos registrados en middleware
- Conexiones DB logueadas para debugging

# CreditCardApp Frontend (React)

Frontend web para la app CreditCardApp. Permite autenticación, gestión de tarjetas, pagos, transacciones e historial, consumiendo el backend REST protegido con JWT.

---

✨ Features
- Auth
  - Registro
  - Login
  - Persistencia del token (localStorage)
- Interceptor HTTP para enviar Authorization: Bearer <token>
- UI
  - Tailwind configurado con paleta del reto (tokens de color)
  - Layout principal (sidebar/topbar)
- Arquitectura Front
  - Estructura Smart / Dumb components
  - Mappers para transformar respuestas del backend a modelos internos
  - API layer centralizado (cliente HTTP + endpoints)
- Rutas
  - Rutas públicas: login/registro
  - Rutas privadas: dashboard/cards/payments/transactions (protegidas por token)

---

🧱 Stack
- React + TypeScript
- Vite
- TailwindCSS
- React Router
- HTTP client con interceptors (axios)

---

📁 Estructura del proyecto
- src/
  - api/ → cliente HTTP, interceptors, endpoints
  - auth/ → helpers de sesión/token, guards
  - components/ → componentes reutilizables (dumb)
  - config/ → configuración (env, constants)
  - features/ → módulos por dominio (cards, payments, transactions, dashboard)
  - mappers/ → conversión backend → frontend models
  - models/ → tipos / interfaces usadas por la UI
  - pages/ → páginas (smart containers que orquestan)
  - router/ → configuración de rutas

---

🔐 Variables de entorno

Vite solo expone variables con prefijo VITE_.

Crea un archivo:
- frontend/.env

Con:

```bash
VITE_API_BASE_URL=http://localhost:5253/api
```

Si usas Docker, este valor puede cambiar según cómo expongas el backend.

---

▶️ Ejecutar en local (sin Docker)

1) Instalar dependencias

Desde la carpeta frontend/:

```bash
npm install
```

2) Ejecutar en modo desarrollo

```bash
npm run dev
```

3) Abrir la app
- App: http://localhost:5173

Asegúrate de que el backend esté corriendo en http://localhost:5253 y que CORS permita http://localhost:5173.

---

🐳 Ejecutar con Docker Compose

Si tu docker-compose.yml ya levanta frontend + backend + mysql:

```bash
docker compose up –build
```

Servicios típicos:
- Frontend: http://localhost:5173
- Backend: http://localhost:5253
- Swagger: http://localhost:5253/swagger
- MySQL: localhost:3306

---

🔁 Flujo de autenticación (cómo funciona)
1.	El usuario hace login.
2.	La API responde con un JWT.
3.	El token se guarda en localStorage (o donde hayas definido).
4.	El interceptor del cliente HTTP agrega: Authorization: Bearer <token>
5.	Las rutas privadas se protegen validando si existe token.
6.	Para obtener el usuario actual se consume:

- GET /api/auth/me

---

🧩 Smart & Dumb Components (convención)
- Dumb components
  - Solo UI
  - Reciben props
  - No conocen API ni storage
- Smart components (pages/containers)
  - Llaman casos de uso / servicios (api)
  - Manejan estado
  - Usan mappers
  - Renderizan dumb components

---

🗺️ Mappers (por qué existen)

El backend puede devolver modelos con campos o formatos diferentes a los que se usan en UI.

Los mappers:
- Evitan acoplar UI a la forma exacta del backend
- Centralizan conversiones (fechas, nombres, enums, etc.)

Ejemplo típico:
- CardResponseDto (API) → CardModel (UI)

---

✅ URL de acceso
- Frontend: http://localhost:5173

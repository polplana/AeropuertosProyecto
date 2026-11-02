# Práctica: Ciudades y Aeropuertos

API REST con Node.js, Express y MySQL para gestionar ciudades y aeropuertos con autenticación JWT y roles (`user` y `admin`).

---

## 1. Puesta en marcha

1. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   ```

2. **Arrancar con Docker:**
   ```bash
   docker compose up -d --build
   ```
   La base de datos se inicializa automáticamente con el archivo `database/schema.sql`.

3. **Comprobar el servidor:**
   * `http://localhost:3000/`
   * `http://localhost:3000/health`

---

## 2. Estructura del proyecto

* `src/config/`: Conexión a la base de datos y configuración del entorno.
* `src/controllers/`: Controladores que reciben las peticiones y envían las respuestas.
* `src/routes/`: Definición de rutas (`/api/auth`, `/api/cities`, `/api/airports`).
* `src/services/`: Lógica de la aplicación y comprobaciones.
* `src/repositories/`: Consultas a la base de datos MySQL.
* `src/validators/`: Validación de los datos enviados en las peticiones.
* `src/middleware/`:
  * `authenticate.js`: Comprueba el token JWT para acceder a las rutas protegidas (devuelve 401 si no es válido).
  * `authorizeAdmin.js`: Comprueba que el usuario sea administrador para crear o modificar (devuelve 403 si no lo es).
  * `errorHandler.js`: Manejo de errores de la aplicación.

---

## 3. Rutas de la API

### Autenticación (`/api/auth`)
* `POST /api/auth/register`: Registro de usuario normal.
* `POST /api/auth/login`: Login y obtención del token JWT.
* `GET /api/auth/me`: Datos del usuario autenticado (requiere token).

### Ciudades (`/api/cities`)
* `GET /api/cities`: Listar ciudades (permite búsqueda con `?search=`).
* `GET /api/cities/with-airports`: Listar ciudades que tienen aeropuertos.
* `GET /api/cities/:id/airports`: Listar aeropuertos de una ciudad.
* `POST /api/cities`: Crear una ciudad (solo admin).
* `PUT /api/cities/:id`: Modificar una ciudad (solo admin).

### Aeropuertos (`/api/airports`)
* `GET /api/airports`: Listar aeropuertos (permite filtro con `?cityId=`).
* `GET /api/airports/:id`: Consultar un aeropuerto por su ID.
* `POST /api/airports`: Crear un aeropuerto (solo admin).
* `PUT /api/airports/:id`: Modificar un aeropuerto (solo admin).

---

## 4. Pruebas realizadas

Se han probado todos los casos de la práctica utilizando el archivo `api.http` con la extensión REST Client de VS Code, comprobando el funcionamiento de la autenticación, las consultas, los permisos de administrador y el control de errores (códigos 200, 201, 401, 403, 404, 409 y 422).

# Proyecto: Vuelos y Buscador Público de Aeropuertos

API REST desarrollada con Node.js, Express y MySQL que permite gestionar ciudades y aeropuertos (mediante autenticación JWT y roles), así como consultar rutas aéreas y conexiones entre ciudades de forma pública a partir del dataset de OpenFlights.

---

## 1. Puesta en marcha

1. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   ```

2. **Descargar los datasets de OpenFlights:**
   Crear la carpeta `data/openflights/` y descargar los tres ficheros fuente:
   * [`airports.dat`](https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat)
   * [`airlines.dat`](https://raw.githubusercontent.com/jpatokal/openflights/master/data/airlines.dat)
   * [`routes.dat`](https://raw.githubusercontent.com/jpatokal/openflights/master/data/routes.dat)

   Estructura esperada:
   ```
   data/
   └── openflights/
       ├── airports.dat
       ├── airlines.dat
       └── routes.dat
   ```

3. **Arrancar los contenedores con Docker:**
   ```bash
   docker compose up -d --build
   ```
   La base de datos MySQL se inicializa automáticamente en orden:
   * `database/init/001_schema.sql`: Estructura inicial (usuarios, ciudades y aeropuertos base).
   * `database/init/002_flights.sql`: Migración con las tablas `airlines`, `flights` y columnas `openflights_id` e `icao_code`.

4. **Ejecutar la importación del dataset:**
   El proceso es idempotente (se puede ejecutar varias veces sin duplicar registros):
   ```bash
   docker compose exec node npm run import
   ```

5. **Comprobar el estado del servidor:**
   * `http://localhost:3000/`
   * `http://localhost:3000/health`

---

## 2. Estructura del proyecto

* `src/config/`: Conexión a la base de datos MySQL y configuración.
* `src/controllers/`: Controladores para endpoints de autenticación, gestión y rutas públicas.
* `src/importer/`: Scripts de importación y procesamiento ETL de OpenFlights.
* `src/middleware/`: Middlewares de autenticación JWT (`authenticate.js`), control de rol admin (`authorizeAdmin.js`) y manejo centralizado de errores (`errorHandler.js`).
* `src/repositories/`: Consultas SQL a MySQL (ciudades, aeropuertos, usuarios y rutas).
* `src/routes/`: Definición de routers (`/api/auth`, `/api/cities`, `/api/airports`, `/api/public`).
* `src/services/`: Lógica de negocio y algoritmo BFS para búsqueda de escalas.
* `src/validators/`: Validación de datos de entrada y parámetros de consulta.

---

## 3. Endpoints de la API

### Rutas Públicas (sin token requerido)
* `GET /api/public/cities?search=...`: Buscar ciudades por nombre (coincidencia parcial, insensible a mayúsculas).
* `GET /api/public/cities/:id/airports`: Consultar aeropuertos de una ciudad por su ID (422 si ID no es entero, 404 si no existe).
* `GET /api/public/routes/direct?fromCityId=...&toCityId=...`: Buscar vuelos directos entre dos ciudades (`stops = 0`).
* `GET /api/public/routes?fromCityId=...&toCityId=...&maxStops=...`: Buscador de rutas con hasta `maxStops` escalas (0 a 3, por defecto 0) usando algoritmo BFS para priorizar rutas con menor número de escalas.

### Autenticación (`/api/auth`)
* `POST /api/auth/register`: Registro de usuario normal.
* `POST /api/auth/login`: Inicio de sesión y obtención del token JWT.
* `GET /api/auth/me`: Perfil del usuario autenticado (requiere token).

### Gestión de Ciudades (`/api/cities`)
* `GET /api/cities`: Listar ciudades (requiere token).
* `GET /api/cities/with-airports`: Listar ciudades con recuento de aeropuertos (requiere token).
* `GET /api/cities/:id/airports`: Listar aeropuertos de una ciudad (requiere token).
* `POST /api/cities`: Crear ciudad (solo admin).
* `PUT /api/cities/:id`: Modificar ciudad (solo admin).

### Gestión de Aeropuertos (`/api/airports`)
* `GET /api/airports`: Listar aeropuertos con filtro `?cityId=` (requiere token).
* `GET /api/airports/:id`: Consultar aeropuerto por ID (requiere token).
* `POST /api/airports`: Crear aeropuerto (solo admin).
* `PUT /api/airports/:id`: Modificar aeropuerto (solo admin).

---

## 4. Pruebas en `api.http`

El archivo `api.http` contiene la suite de pruebas completa lista para ejecutar con la extensión REST Client de VS Code:
* Secuencia completa de registro, login y obtención de tokens JWT.
* Verificación de permisos de usuario normal frente a administrador (códigos 401 y 403).
* Consultas públicas de ciudades y aeropuertos sin cabecera `Authorization`.
* Búsqueda de vuelos directos (`/api/public/routes/direct`) y rutas con escalas (`/api/public/routes`).
* Casos límite y control de errores: parámetros inválidos (422), recursos inexistentes (404) y duplicados (409).

---

## 5. Licencia y Atribución de Datos

* **Atribución de la fuente:**
  > Datos de aeropuertos, aerolíneas y rutas: OpenFlights, https://openflights.org/data.php. Dataset histórico; consultado para uso educativo bajo licencia Open Database License (ODbL).

* **Limitaciones del dataset:**
  Los datos corresponden a registros históricos de vuelos y rutas de OpenFlights recopilados entre 2014 y 2017. Representan conexiones y rutas aéreas entre aeropuertos, **no horarios comerciales ni vuelos en tiempo real**.

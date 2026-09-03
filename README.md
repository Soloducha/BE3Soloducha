# ShipNow API

API REST para gestion de usuarios, productos, pedidos y entregas, construida con arquitectura por capas (service/repository).

---

## Tabla de contenidos

- [Variables de entorno](#variables-de-entorno)
- [Como correr la API localmente](#como-correr-la-api-localmente)
- [Documentacion Swagger](#documentacion-swagger)
- [Endpoints](#endpoints)
- [Paginacion](#paginacion)
- [Uploads](#uploads)
- [Logging](#logging)
- [Arquitectura (service/repository)](#arquitectura-servicerepository)
- [Testing](#testing)
- [Docker](#docker)
- [Puerto](#puerto)
- [Seguridad en produccion](#seguridad-en-produccion)

---

## Variables de entorno

La API utiliza las siguientes variables de entorno, definidas en un archivo `.env` en la raiz del proyecto:

| Variable     | Descripcion                                                  | Ejemplo                               |
| ------------ | ------------------------------------------------------------ | ------------------------------------- |
| `PORT`       | Puerto del servidor                                          | `8080`                                |
| `MONGO_URI`  | URI de conexion a MongoDB                                    | `mongodb://localhost:27017/soloducha` |
| `NODE_ENV`   | Entorno de ejecucion (`development` / `test` / `production`) | `development`                         |
| `JWT_SECRET` | Secreto para firmar tokens JWT                               | `tu-secreto-aqui`                     |

- El archivo `.env.example` contiene la plantilla de referencia.
- El archivo `.env.test` contiene las variables preconfiguradas para los tests.
- **El archivo `.env` NUNCA debe subirse al repositorio.** Esta excluido en `.gitignore` y `.dockerignore`.

---

## Como correr la API localmente

```bash
cp .env.example .env   # configurar las variables de entorno
npm install
npm run dev
```

---

## Documentacion Swagger

La API expone **Swagger UI** en:

- **URL**: http://localhost:8080/api/docs

Desde ahi se puede consultar y probar todos los endpoints documentados, organizados por tags:

| Tag        | Que documenta                                                      |
| ---------- | ------------------------------------------------------------------ |
| Users      | CRUD de usuarios                                                   |
| Products   | CRUD de productos                                                  |
| Orders     | CRUD de pedidos y actualizacion de estado                          |
| Deliveries | CRUD de entregas y actualizacion de estado                         |
| Mocks      | Generacion de datos de prueba, con y sin persistencia              |
| Logger     | Endpoint de validacion del logger (no es funcionalidad de negocio) |

La configuracion de Swagger esta separada de la logica de rutas: los archivos viven en `src/docs/` (swagger.config.js + un archivo YAML por modulo) y se sirven en `/api/docs`.

> Nota: la API aun no tiene autenticacion real. Swagger UI se sirve abierta en `/api/docs`; esta pendiente protegerla con basic auth.

---

## Endpoints

| Metodo | Ruta                        | Descripcion                                 |
| ------ | --------------------------- | ------------------------------------------- |
| GET    | /api/users                  | Listar usuarios (paginado)                  |
| GET    | /api/users/all              | Listar todos los usuarios (sin paginacion)  |
| GET    | /api/users/:uid             | Obtener usuario por ID                      |
| POST   | /api/users                  | Crear usuario                               |
| DELETE | /api/users/:uid             | Eliminar usuario                            |
| GET    | /api/products               | Listar productos (paginado)                 |
| GET    | /api/products/all           | Listar todos los productos (sin paginacion) |
| GET    | /api/products/:pid          | Obtener producto por ID                     |
| POST   | /api/products               | Crear producto                              |
| PUT    | /api/products/:pid          | Actualizar producto                         |
| DELETE | /api/products/:pid          | Eliminar producto                           |
| GET    | /api/orders                 | Listar pedidos (paginado)                   |
| GET    | /api/orders/all             | Listar todos los pedidos (sin paginacion)   |
| GET    | /api/orders/:oid            | Obtener pedido por ID                       |
| POST   | /api/orders                 | Crear pedido                                |
| PATCH  | /api/orders/:oid/status     | Actualizar estado pedido                    |
| DELETE | /api/orders/:oid            | Eliminar pedido                             |
| GET    | /api/deliveries             | Listar entregas (paginado)                  |
| GET    | /api/deliveries/all         | Listar todas las entregas (sin paginacion)  |
| GET    | /api/deliveries/:did        | Obtener entrega por ID                      |
| POST   | /api/deliveries             | Crear entrega                               |
| PATCH  | /api/deliveries/:did/status | Actualizar estado entrega                   |
| DELETE | /api/deliveries/:did        | Eliminar entrega                            |
| GET    | /api/mocks/users            | Generar usuarios mock (sin guardar)         |
| POST   | /api/mocks/users            | Generar e insertar usuarios mock en DB      |
| GET    | /api/mocks/products         | Generar productos mock (sin guardar)        |
| POST   | /api/mocks/products         | Generar e insertar productos mock en DB     |
| GET    | /api/mocks/orders           | Generar pedidos mock (sin guardar)          |
| POST   | /api/mocks/orders           | Generar e insertar pedidos mock en DB       |
| GET    | /api/mocks/deliveries       | Generar entregas mock (sin guardar)         |
| POST   | /api/mocks/deliveries       | Generar e insertar entregas mock en DB      |
| GET    | /api/mocks/logger           | Generar mensajes con todos los logs         |

> Los endpoints de mock aceptan un parametro `count` (default: 10). En GET se pasa como query string (`?count=15`), en POST va en el body (`{ "count": 15 }`). Valores fuera del rango 1-100 (negativos, cero, no enteros o mayores a 100) devuelven HTTP 400 con el codigo `INVALID_MOCK_AMOUNT`. Los mocks de orders requieren usuarios existentes y los de deliveries requieren pedidos existentes; si la fuente esta vacia devuelven HTTP 400 con el codigo `MOCK_SOURCE_EMPTY`.

---

## Paginacion

Los endpoints de listado (`/api/users`, `/api/orders`, `/api/products`, `/api/deliveries`) estan paginados por defecto.

**Parametros de query:**

| Parametro | Default | Descripcion                       |
| --------- | ------- | --------------------------------- |
| `page`    | `1`     | Numero de pagina a obtener        |
| `limit`   | `10`    | Cantidad de documentos por pagina |

**Ejemplo:** `GET /api/orders?page=2&limit=5`

**Estructura de la respuesta:**

```json
{
  "docs": [],
  "count": 10,
  "total": 45,
  "totalPages": 5,
  "page": 2,
  "hasPreviousPage": true,
  "hasNextPages": true,
  "prevLink": "/api/orders?page=1&limit=5",
  "nextLink": "/api/orders?page=3&limit=5"
}
```

**Rutas sin paginacion:**

Si se necesitan todos los documentos sin paginacion, se pueden usar las rutas alternativas:

| Ruta                  | Descripcion         |
| --------------------- | ------------------- |
| `/api/users/all`      | Todos los usuarios  |
| `/api/orders/all`     | Todos los pedidos   |
| `/api/products/all`   | Todos los productos |
| `/api/deliveries/all` | Todas las entregas  |

---

## Uploads

La API soporta subida de archivos con las siguientes restricciones:

| Restriccion      | Valor                              |
| ---------------- | ---------------------------------- |
| Tamano maximo    | 5 MB                               |
| Tipos permitidos | PDF, JPEG, PNG, WebP               |
| Directorio       | `uploads/` en la raiz del proyecto |

Los archivos subidos se almacenan en el directorio `uploads/`. Este directorio esta excluido tanto en `.gitignore` como en `.dockerignore`, por lo que **nunca se sube al repositorio ni se incluye en las imagenes Docker**.

---

## Logging

La API usa **Winston** como sistema de logging centralizado, con rotacion de archivos diaria (`winston-daily-rotate-file`).

### Niveles de log

| Nivel | Uso                                                                                        |
| ----- | ------------------------------------------------------------------------------------------ |
| fatal | Fallas criticas (falla al conectar con MongoDB o al iniciar el server)                     |
| error | Errores inesperados del servidor (5xx)                                                     |
| warn  | Advertencias y errores de negocio (4xx, rutas inexistentes)                                |
| info  | Eventos importantes (server iniciado, Mongo conectado, entidades creadas, mocks generados) |
| http  | Requests HTTP (metodo, URL, status y duracion)                                             |
| debug | Informacion de desarrollo                                                                  |

### Endpoint de prueba del logger

Para verificar que todos los niveles funcionan: (se utiliza localhost de ejemplo)

```bash
curl http://localhost:8080/api/mocks/logger
```

Este endpoint es una **herramienta de validacion del logger**, no una funcionalidad de negocio. Genera un log por nivel (debug, http, info, warn, error y fatal) en consola. Los niveles `error` y `fatal` tambien quedan persistidos en el archivo de logs.

### Archivos de logs

Los errores (niveles `error` y `fatal`) se guardan en la carpeta `logs/` (archivo `error.log`), con rotacion diaria por fecha y retencion de 15 dias. La carpeta `logs/` y los archivos `*.log` estan ignorados en `.gitignore`, por lo que no se suben al repositorio.

### Comportamiento segun entorno

- **development** (default): registra todos los niveles, incluidos `debug` y `http`.
- **production**: registra desde `info` hacia arriba; los niveles `debug` y `http` quedan fuera para reducir ruido.

---

## Arquitectura (service/repository)

La logica se separa en **service** y **repository**.

En **Repository** solo se encarga de como obtener y guardar datos.
En **Service** se define que hacer con esos datos segun las reglas del negocio.
No puede haber logica del negocio en el repository.

---

## Testing

### Herramientas

| Herramienta   | Rol                                                          |
| ------------- | ------------------------------------------------------------ |
| **Mocha**     | Organizacion y ejecucion de tests                            |
| **Chai**      | Aserciones (expect)                                          |
| **Supertest** | Peticiones HTTP contra la app Express                        |
| **Jest**      | Tests unitarios y de integracion con mocks (suite existente) |

### Tipos de tests

| Tipo                    | Directorio          | Que cubre                           | DB                  |
| ----------------------- | ------------------- | ----------------------------------- | ------------------- |
| **Funcionales (Mocha)** | `test/functional/`  | Endpoints reales contra MongoDB     | DB de test separada |
| **Unitarios (Jest)**    | `test/unit/`        | Services con repositorios mockeados | Mock                |
| **Integracion (Jest)**  | `test/integration/` | Rutas con repositorios mockeados    | Mock                |

### Modulos cubiertos (Mocha/Chai/Supertest)

| Archivo            | Modulos cubiertos                                        |
| ------------------ | -------------------------------------------------------- |
| `users.test.js`    | GET, GET/:id, POST (201, 400, 403, 409)                  |
| `products.test.js` | GET, GET/:id, POST (201, 400, precio/stock negativo)     |
| `orders.test.js`   | GET, GET/:id, POST, PATCH status, DELETE                 |
| `mocks.test.js`    | GET/POST users, products, orders, logger, count invalido |
| `swagger.test.js`  | Health check, Swagger UI, Swagger JSON                   |
| `errors.test.js`   | Ruta inexistente 404, formato de error consistente       |

### Requisitos previos

1. **MongoDB** corriendo localmente en el puerto default (27017)
2. Node.js >= 18

### Variables de entorno de testing

El archivo `.env.test` define las variables para los tests funcionales (Mocha):

```bash
PORT=8080
MONGO_URI=mongodb://localhost:27017/basededatos_test   # DB dedicada, NO usa la de desarrollo
NODE_ENV=test
JWT_SECRET=test-secret-key-for-testing
```

> **Importante**: la DB de test (`basededatos_test`) es diferente a la de desarrollo (`basededatos`). Los datos generados por los tests se limpian automaticamente antes y despues de cada prueba.

### Como ejecutar

```bash
# Tests funcionales (Mocha + Chai + Supertest — contra MongoDB real)
npm run test:mocha

# Tests unitarios e integracion (Jest — con mocks, no necesita DB)
npm run test
```

### Estructura de un test

Los tests funcionales siguen este patron:

1. **before**: conexion a la DB de test
2. **beforeEach**: limpieza de todas las colecciones (aislamiento total)
3. **Tests**: crean sus propios datos, hacen peticiones HTTP, validan status + formato
4. **after**: limpieza final + desconexion

Cada test valida no solo que el endpoint responde, sino la **estructura del body** y sus **propiedades importantes** (status, payload, error codes, message).

### Estrategia de datos de prueba

- Los datos se crean **dentro de cada test** usando helpers (`createTestUser`, `createTestProduct`, etc.)
- Emails y nombres usan `Date.now()`
- No depende de datos cargados manualmente ni del orden de ejecucion
- La limpieza (`beforeEach` en `test/setup.js`) garantiza aislamiento entre tests

---

## Docker

### Construccion de imagen

```bash
docker build -t shipnow-api .
```

### Ejecucion del contenedor

```bash
docker run -p 8080:8080 --env-file .env shipnow-api
```

O utilizando docker-compose (incluye la API y una instancia de MongoDB):

```bash
docker-compose up --build
```

El archivo `docker-compose` levanta tanto la aplicacion como un contenedor de MongoDB, listos para usar.

---

## Puerto

La API corre por defecto en el puerto **8080**. Este valor es configurable mediante la variable de entorno `PORT`.

---

## Seguridad en produccion

- Los **endpoints de mocks** (`/api/mocks/*`) y el endpoint de **logger test** (`/api/mocks/logger`) estan bloqueados en produccion y devuelven **HTTP 403**. no queremos que este al publico (si esta en produccion)
- **Swagger UI** queda abierto en todos los entornos.
- Las **variables sensibles** (`JWT_SECRET`, `MONGO_URI`, etc.) nunca deben estar hardcodeadas en el codigo fuente; se gestionan exclusivamente via variables de entorno.

# ShipNow API - Base

API base para el ejercicio de refactorizacion a arquitectura por capas.

## Instalacion

en una terminal, colocarse en el path donde se coloco el proyecto, instalar las dependencias y luego ejecutarlo.
utilizar los siguientes comandos:

```bash
npm install
npm run dev
```

## Endpoints

| Metodo | Ruta                        | Descripcion                             |
| ------ | --------------------------- | --------------------------------------- |
| GET    | /api/users                  | Listar usuarios                         |
| GET    | /api/users/:uid             | Obtener usuario por ID                  |
| POST   | /api/users                  | Crear usuario                           |
| DELETE | /api/users/:uid             | Eliminar usuario                        |
| GET    | /api/products               | Listar productos                        |
| GET    | /api/products/:pid          | Obtener producto por ID                 |
| POST   | /api/products               | Crear producto                          |
| PUT    | /api/products/:pid          | Actualizar producto                     |
| DELETE | /api/products/:pid          | Eliminar producto                       |
| GET    | /api/orders                 | Listar pedidos                          |
| GET    | /api/orders/:oid            | Obtener pedido por ID                   |
| POST   | /api/orders                 | Crear pedido                            |
| PATCH  | /api/orders/:oid/status     | Actualizar estado pedido                |
| DELETE | /api/orders/:oid            | Eliminar pedido                         |
| GET    | /api/deliveries             | Listar entregas                         |
| GET    | /api/deliveries/:did        | Obtener entrega por ID                  |
| POST   | /api/deliveries             | Crear entrega                           |
| PATCH  | /api/deliveries/:did/status | Actualizar estado entrega               |
| DELETE | /api/deliveries/:did        | Eliminar entrega                        |
| GET    | /api/mocks/users            | Generar usuarios mock (sin guardar)     |
| POST   | /api/mocks/users            | Generar e insertar usuarios mock en DB  |
| GET    | /api/mocks/products         | Generar productos mock (sin guardar)    |
| POST   | /api/mocks/products         | Generar e insertar productos mock en DB |
| GET    | /api/mocks/orders           | Generar pedidos mock (sin guardar)      |
| POST   | /api/mocks/orders           | Generar e insertar pedidos mock en DB   |
| GET    | /api/mocks/deliveries       | Generar entregas mock (sin guardar)     |
| POST   | /api/mocks/deliveries       | Generar e insertar entregas mock en DB  |
| GET    | /api/mocks/logger           | Generar mensajes con todos los logs     |

> Los endpoints de mock aceptan un parametro `count` (default: 10). En GET se pasa como query string (`?count=15`), en POST va en el body (`{ "count": 15 }`). Valores fuera del rango 1-100 (negativos, cero, no enteros o mayores a 100) devuelven HTTP 400 con el codigo `INVALID_MOCK_AMOUNT`. Los mocks de orders requieren usuarios existentes y los de deliveries requieren pedidos existentes; si la fuente esta vacia devuelven HTTP 400 con el codigo `MOCK_SOURCE_EMPTY`.

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
curl http://localhost:8000/api/mocks/logger
```

Genera un log por nivel (debug, http, info, warn, error y fatal) en consola. Los niveles `error` y `fatal` tambien quedan persistidos en el archivo de logs.

### Archivos de logs

Los errores (niveles `error` y `fatal`) se guardan en la carpeta `logs/` (archivo `error.log`), con rotacion diaria por fecha y retencion de 15 dias. La carpeta `logs/` y los archivos `*.log` estan ignorados en `.gitignore`, por lo que no se suben al repositorio.

### Comportamiento segun entorno

- **development** (default): registra todos los niveles, incluidos `debug` y `http`.
- **production**: registra desde `info` hacia arriba; los niveles `debug` y `http` quedan fuera para reducir ruido.

## la logica se separa en service y repository

En Repository solo tengo que cómo obtener y guardar datos.
y en Service lo que tengo qué hacer con esos datos según las reglas del negocio.
No puede haber logica del negocio en el repository.

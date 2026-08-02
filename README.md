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

> Los endpoints de mock aceptan un parametro `count` (default: 10). En GET se pasa como query string (`?count=15`), en POST va en el body (`{ "count": 15 }`). Valores fuera del rango 1-100 (negativos, cero, no enteros o mayores a 100) devuelven HTTP 400 con el codigo `INVALID_MOCK_AMOUNT`. Los mocks de orders requieren usuarios existentes y los de deliveries requieren pedidos existentes; si la fuente esta vacia devuelven HTTP 400 con el codigo `MOCK_SOURCE_EMPTY`.

## la logica se separa en service y repository

En Repository solo tengo que cómo obtener y guardar datos.
y en Service lo que tengo qué hacer con esos datos según las reglas del negocio.
no puede haber logica del negocio en el repository.

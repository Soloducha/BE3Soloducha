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

| Metodo | Ruta                        | Descripcion               |
| ------ | --------------------------- | ------------------------- |
| GET    | /api/users                  | Listar usuarios           |
| GET    | /api/users/:uid             | Obtener usuario por ID    |
| POST   | /api/users                  | Crear usuario             |
| DELETE | /api/users/:uid             | Eliminar usuario          |
| GET    | /api/products               | Listar productos          |
| GET    | /api/products/:pid          | Obtener producto por ID   |
| POST   | /api/products               | Crear producto            |
| PUT    | /api/products/:pid          | Actualizar producto       |
| DELETE | /api/products/:pid          | Eliminar producto         |
| GET    | /api/orders                 | Listar pedidos            |
| GET    | /api/orders/:oid            | Obtener pedido por ID     |
| POST   | /api/orders                 | Crear pedido              |
| PATCH  | /api/orders/:oid/status     | Actualizar estado pedido  |
| DELETE | /api/orders/:oid            | Eliminar pedido           |
| GET    | /api/deliveries             | Listar entregas           |
| GET    | /api/deliveries/:did        | Obtener entrega por ID    |
| POST   | /api/deliveries             | Crear entrega             |
| PATCH  | /api/deliveries/:did/status | Actualizar estado entrega |
| DELETE | /api/deliveries/:did        | Eliminar entrega          |

## la logica se separa en service y repository

En Repository solo tengo que cómo obtener y guardar datos.
y en Service lo que tengo qué hacer con esos datos según las reglas del negocio.
no puede haber logica del negocio en el repository.

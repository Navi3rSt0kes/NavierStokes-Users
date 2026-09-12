# NavierStokes Users

API TypeScript/Node.js para usuarios y su carrito. El carrito almacena exclusivamente IDs de productos; el catálogo de productos queda fuera del alcance de este servicio.

## Ejecutar localmente

```bash
npm install
npm run dev
```

La API queda disponible en `http://localhost:3000`. Para producción:

```bash
npm run build
npm start
```

## Endpoints

| Método | Ruta | Descripción |
| --- | --- | --- |
| `POST` | `/users` | Crea un usuario (`name`, `email`). |
| `GET` | `/users/:userId` | Consulta el usuario. |
| `PUT` | `/users/:userId` | Actualiza nombre y correo. |
| `DELETE` | `/users/:userId` | Elimina el usuario. |
| `GET` | `/users/:userId/cart` | Lista IDs del carrito. |
| `POST` | `/users/:userId/cart/items` | Agrega un `{ "productId": "..." }`. |
| `DELETE` | `/users/:userId/cart/items/:productId` | Elimina una ocurrencia del ID. |
| `DELETE` | `/users/:userId/cart` | Vacía el carrito. |
| `GET` | `/health` | Estado de la aplicación. |

Ejemplo:

```bash
curl -X POST http://localhost:3000/users \
  -H "content-type: application/json" \
  -d '{"name":"Ana","email":"ana@example.com"}'
```

## Docker y CI/CD

```bash
docker compose up --build
```

La imagen usa una compilación multietapa y expone el puerto 3000. El flujo Gitflow y los pipelines se documentan en [CONTRIBUTING.md](CONTRIBUTING.md): CI valida PRs hacia `develop`/`main`; CD publica la imagen en GHCR cuando se integra en `main`.

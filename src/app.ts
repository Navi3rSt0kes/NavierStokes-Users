import express, { type NextFunction, type Request, type Response } from 'express';
import { UserStore } from './user-store.js';
import type { CreateUserInput } from './types.js';

const isUserInput = (value: unknown): value is CreateUserInput => {
  if (!value || typeof value !== 'object') return false;
  const input = value as Record<string, unknown>;
  return typeof input.name === 'string' && input.name.trim().length > 0 &&
    typeof input.email === 'string' && /^\S+@\S+\.\S+$/.test(input.email);
};

export function createApp(store = new UserStore()) {
  const app = express();
  app.use(express.json());

  app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));

  app.post('/users', (req, res) => {
    if (!isUserInput(req.body)) return res.status(400).json({ error: 'name y email válido son obligatorios' });
    return res.status(201).json(store.create({ name: req.body.name.trim(), email: req.body.email.trim().toLowerCase() }));
  });

  app.get('/users/:userId', (req, res) => {
    const user = store.get(req.params.userId);
    return user ? res.json(user) : res.status(404).json({ error: 'Usuario no encontrado' });
  });

  app.put('/users/:userId', (req, res) => {
    if (!isUserInput(req.body)) return res.status(400).json({ error: 'name y email válido son obligatorios' });
    const user = store.update(req.params.userId, { name: req.body.name.trim(), email: req.body.email.trim().toLowerCase() });
    return user ? res.json(user) : res.status(404).json({ error: 'Usuario no encontrado' });
  });

  app.delete('/users/:userId', (req, res) =>
    store.delete(req.params.userId) ? res.status(204).send() : res.status(404).json({ error: 'Usuario no encontrado' }));

  app.get('/users/:userId/cart', (req, res) => {
    const user = store.get(req.params.userId);
    return user ? res.json({ productIds: user.cartProductIds }) : res.status(404).json({ error: 'Usuario no encontrado' });
  });

  app.post('/users/:userId/cart/items', (req, res) => {
    const user = store.get(req.params.userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    const productId = req.body?.productId;
    if (typeof productId !== 'string' || productId.trim().length === 0) return res.status(400).json({ error: 'productId es obligatorio' });
    user.cartProductIds.push(productId.trim());
    return res.status(201).json({ productIds: user.cartProductIds });
  });

  app.delete('/users/:userId/cart/items/:productId', (req, res) => {
    const user = store.get(req.params.userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    const index = user.cartProductIds.indexOf(req.params.productId);
    if (index === -1) return res.status(404).json({ error: 'Producto no está en el carrito' });
    user.cartProductIds.splice(index, 1);
    return res.status(204).send();
  });

  app.delete('/users/:userId/cart', (req, res) => {
    const user = store.get(req.params.userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    user.cartProductIds = [];
    return res.status(204).send();
  });

  app.use((_req: Request, res: Response) => res.status(404).json({ error: 'Ruta no encontrada' }));
  app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => res.status(500).json({ error: error.message }));
  return app;
}

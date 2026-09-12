import assert from 'node:assert/strict';
import test from 'node:test';
import type { AddressInfo } from 'node:net';
import { createApp } from './app.js';

async function withServer(run: (baseUrl: string) => Promise<void>) {
  const server = createApp().listen(0);
  await new Promise<void>((resolve) => server.once('listening', resolve));
  const { port } = server.address() as AddressInfo;
  try {
    await run(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
}

test('crea un usuario y gestiona IDs en su carrito', async () => withServer(async (baseUrl) => {
  const creation = await fetch(`${baseUrl}/users`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name: 'Ana', email: 'ANA@example.com' })
  });
  assert.equal(creation.status, 201);
  const user = await creation.json() as { id: string; email: string; cartProductIds: string[] };
  assert.equal(user.email, 'ana@example.com');
  assert.deepEqual(user.cartProductIds, []);

  const addition = await fetch(`${baseUrl}/users/${user.id}/cart/items`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ productId: 'producto-42' })
  });
  assert.equal(addition.status, 201);
  assert.deepEqual((await addition.json() as { productIds: string[] }).productIds, ['producto-42']);

  const cart = await fetch(`${baseUrl}/users/${user.id}/cart`);
  assert.deepEqual((await cart.json() as { productIds: string[] }).productIds, ['producto-42']);

  const removal = await fetch(`${baseUrl}/users/${user.id}/cart/items/producto-42`, { method: 'DELETE' });
  assert.equal(removal.status, 204);
}));

test('rechaza usuarios inválidos y recursos inexistentes', async () => withServer(async (baseUrl) => {
  const invalid = await fetch(`${baseUrl}/users`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name: '', email: 'mal' })
  });
  assert.equal(invalid.status, 400);
  assert.equal((await fetch(`${baseUrl}/users/inexistente`)).status, 404);
}));

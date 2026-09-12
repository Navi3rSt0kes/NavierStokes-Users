import { randomUUID } from 'node:crypto';
import type { CreateUserInput, User } from './types.js';

export class UserStore {
  private readonly users = new Map<string, User>();

  create(input: CreateUserInput): User {
    const user: User = { id: randomUUID(), ...input, cartProductIds: [] };
    this.users.set(user.id, user);
    return user;
  }

  get(id: string): User | undefined {
    return this.users.get(id);
  }

  update(id: string, input: CreateUserInput): User | undefined {
    const user = this.users.get(id);
    if (!user) return undefined;
    user.name = input.name;
    user.email = input.email;
    return user;
  }

  delete(id: string): boolean {
    return this.users.delete(id);
  }
}

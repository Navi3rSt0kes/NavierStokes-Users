export interface User {
  id: string;
  name: string;
  email: string;
  cartProductIds: string[];
}

export interface CreateUserInput {
  name: string;
  email: string;
}

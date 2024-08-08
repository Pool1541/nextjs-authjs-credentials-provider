/* eslint-disable import/no-anonymous-default-export */
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

const USERS_STORE: Map<string, User> = new Map<string, User>();
USERS_STORE.set("pool_1541@hotmail.com", { id: "1", name: "Pool Llerena", email: "pool_1541@hotmail.com", password: "password123" });

async function saveUser(user: Omit<User, 'id'> & Partial<Pick<User, 'id'>>): Promise<void> {
  const newUser = {
    id: Math.random().toString(36).substring(7),
    ...user,
  }
  
  USERS_STORE.set(user.email, newUser);
}

async function getUserByEmail(email: string): Promise<User | undefined> {
  return USERS_STORE.get(email);
}

export default {
  saveUser,
  getUserByEmail,
}

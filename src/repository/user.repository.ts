/* eslint-disable import/no-anonymous-default-export */

import { Role } from '@prisma/client';

export interface User {
	id: string;
	name: string;
	email: string;
	password: string;
	role: Role;
}

const USERS_STORE: Map<string, User> = new Map<string, User>();
USERS_STORE.set('pool_1541@hotmail.com', {
	id: '1',
	name: 'Pool Llerena',
	email: 'pool_1541@hotmail.com',
	password: 'password123',
	role: Role.ADMIN,
});

async function saveUser(
	user: Omit<User, 'id' | 'role'> & Partial<Pick<User, 'id' | 'role'>>,
): Promise<void> {
	const newUser = {
		id: Math.random().toString(36).substring(7),
		role: user.role || Role.USER,
		...user,
	};

	USERS_STORE.set(user.email, newUser);
}

async function getUserByEmail(email: string): Promise<User | undefined> {
	return USERS_STORE.get(email);
}

export default {
	saveUser,
	getUserByEmail,
};

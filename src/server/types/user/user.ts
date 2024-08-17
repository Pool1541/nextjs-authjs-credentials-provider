import type { User as PrismaUser } from 'prisma/prisma-client';

export type User = PrismaUser;
export type CreateUserDTO = Partial<Omit<User, 'email'>> & Pick<User, 'email'>;
export type UpdateUserDTO = Partial<
	Pick<User, 'emailVerified' | 'image' | 'role' | 'name' | 'password' | 'updatedAt'>
>;

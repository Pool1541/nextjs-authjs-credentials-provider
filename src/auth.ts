import NextAuth from 'next-auth';
import authConfig from './auth.config';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '@/server/shared/prisma';

export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
	adapter: PrismaAdapter(prisma),
	...authConfig,
	session: {
		strategy: 'jwt',
	},
	pages: {
		signIn: '/auth/sign-in',
		newUser: '/auth/sign-up',
	},
	events: {
		createUser: async ({ user }) => {
			console.log('User created', user);
		},
	},
});

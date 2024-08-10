import NextAuth, { CredentialsSignin, Session } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { signInSchema } from './utils/zod';
import { NextRequest } from 'next/server';
import userRepository from '@/repository/user.repository';

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		Credentials({
			credentials: {
				email: {
					label: 'Email',
					type: 'text',
				},
				password: {
					label: 'Password',
					type: 'password',
				},
			},
			authorize: async (credentials) => {
				const { email, password } = await signInSchema.parseAsync(credentials);
				const user = await userRepository.getUserByEmail(email);

				if (!user) {
					throw new CredentialsSignin('User not found');
				}

				if (user.password !== password) {
					throw new CredentialsSignin('Invalid email or password');
				}

				return user;
			},
		}),
	],
	session: {
		strategy: 'jwt',
	},
	secret: 'my-secret',
	callbacks: {
		authorized: async ({ request, auth }: { request: NextRequest; auth: Session | null }) => {
			const protectedRoutes = ['/dashboard'];
			const url = request.nextUrl.pathname;
			const isProtectedRoute = protectedRoutes.includes(url);

			if (!isProtectedRoute) return true;

			if (auth) {
				const { user, expires } = auth;
				// TODO: Validar si la sesión está expirada
				if (!user) {
					return false;
				}

				return true;
			} else {
				return false;
			}
		},
		signIn: async ({ user, account }) => {
			// it is called before then "authorized" callback
			return true;
		},
		jwt: async ({ token, user }) => {
			if (user) {
				token.role = user.role;
			}
			return token;
		},
		session: async ({ session, token }) => {
			if(session.user) {
				session.user.role = token.role;
			};
			return session;
		}
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

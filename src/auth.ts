import NextAuth, { CredentialsSignin, Session } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { signInSchema } from './utils/zod';
import { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';
import userRepository from '@/repository/user.repository';

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		Credentials({
			credentials: {
				email: { label: 'Email', type: 'text' },
				password: { label: 'Password', type: 'password' },
			},
			authorize: async (credentials) => {
				const { email, password } = await signInSchema.parseAsync(credentials);
				const user = await userRepository.getUserByEmail(email);

				if (!user) {
					throw new Error('Invalid email or password');
				}

				if (user.password !== password) {
					throw new CredentialsSignin('Invalid email or password');
				}

				return { id: user.id, name: user.name, email: user.email };
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
				console.log('authorized', { user, expires });
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
			console.log('signIn-callback', user, account);
			return true;
		},
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

function validateAuthToken(authToken: any) {
	// Implement your logic to validate the authToken here
	// For example, you can check if the authToken is a valid JWT token
	// and if it has not expired
	// You can use libraries like jsonwebtoken to help with this

	// Here's an example implementation using jsonwebtoken library
	const secret = 'my-secret';

	try {
		// Verify the authToken using the secret key
		const decoded = verify(authToken, secret);
		console.log(decoded);
		// If the verification is successful, return true
		return true;
	} catch (error) {
		// If the verification fails, return false or throw an error
		return false;
	}
}

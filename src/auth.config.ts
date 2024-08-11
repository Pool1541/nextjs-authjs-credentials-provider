import { CredentialsSignin, type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { signInSchema } from './helpers/zod';
import userRepository from './repository/user-prisma.repository';

const authConfig: NextAuthConfig = {
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

				return {
					email: user.email,
					image: user.image,
					name: user.name,
					role: user.role,
				};
			},
		}),
	],
	callbacks: {
		authorized: async ({ request, auth }) => {
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
			if (session.user) {
				session.user.role = token.role;
			}
			return session;
		},
	},
};

export default authConfig;

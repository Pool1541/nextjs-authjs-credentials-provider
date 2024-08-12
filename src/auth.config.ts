import { CredentialsSignin, type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import userRepository from './repository/user-prisma.repository';
import { comparePassword } from './helpers';
import { NextResponse } from 'next/server';

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
				const { email, password } = credentials as Record<'email' | 'password', string>;
				const user = await userRepository.getUserByEmail(email);

				if (!user) {
					throw new CredentialsSignin('User not found');
				}

				// verificar si la contraseña es correcta
				const isValidPassword = await comparePassword(password, user.password!);

				if (!isValidPassword) throw new CredentialsSignin('Invalid email or password');

				return {
					email: user.email,
					image: user.image,
					name: user.name,
					role: user.role,
					emailVerified: user.emailVerified,
				};
			},
		}),
	],
	callbacks: {
		authorized: async ({ request, auth }) => {
			const protectedRoutes = ['/dashboard'];
			const url = request.nextUrl.pathname;
			const isProtectedRoute = protectedRoutes.includes(url);

			// Si la ruta no está protegida, se permite el acceso
			if (!isProtectedRoute) return true;

			// Si el usuario no está autenticado, se redirige a la página de inicio de sesión
			if (!auth?.user) return false;

			// Verificar si el usuario verificó su email
			if (!auth.user.emailVerified && url !== '/auth/email-verify')
				return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth/email-verify`);

			return true;
		},
		signIn: async ({ user, account }) => {
			// it is called before "authorized" callback
			return true;
		},
		jwt: async ({ token, user, trigger, session }) => {
			if (trigger === 'update') {
				token.emailVerified = session.user.emailVerified;
				return token;
			}

			if (user) {
				token.role = user.role;
				token.emailVerified = user.emailVerified;
			}
			return token;
		},
		session: async ({ session, token }) => {
			if (session.user) {
				session.user.role = token.role;
				session.user.emailVerified = token.emailVerified;
			}

			return session;
		},
	},
};

export default authConfig;

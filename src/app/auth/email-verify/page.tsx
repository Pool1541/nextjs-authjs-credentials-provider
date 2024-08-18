//image verify page
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { userService } from '@/server/services';
import { NotFoundException, TokenExpiredException } from '@/server/helpers';

export default async function EmailVerifyPage({
	searchParams,
}: {
	searchParams: { token: string };
}) {
	const { token } = searchParams;
	const session = await auth();

	if (session?.user?.emailVerified) return redirect('/dashboard');
	if (token) {
		try {
			await userService.verifyEmail(token);

			return <Success />;
		} catch (error) {
			if (error instanceof NotFoundException || error instanceof TokenExpiredException) {
				return <ExpiredOrInvalidToken />;
			}

			throw error;
		}
	}

	return (
		<div className="flex items-center justify-center h-screen">
			<div className="p-8 rounded shadow-md w-96">
				<h1 className="text-2xl font-semibold text-center">Verify your email</h1>
				<p className="mt-4 text-center text-gray-500">
					We have sent an email to your email address. Please verify your email address to continue.
				</p>
			</div>
		</div>
	);
}

function ExpiredOrInvalidToken() {
	return (
		<div className="flex items-center justify-center h-screen">
			<div className="p-8 rounded shadow-md w-auto">
				<h1 className="text-2xl font-semibold text-center">El token espiró o es inválido</h1>
			</div>
		</div>
	);
}

function Success() {
	return (
		<div className="flex items-center justify-center h-screen">
			<div className="p-8 rounded shadow-md w-96">
				<h1 className="text-2xl font-semibold text-center">Se verificó el email con éxito</h1>
				<p className="mt-4 text-center text-gray-500">
					<Link href={'/auth/sign-in'} className="underline-offset-2">
						Inicia sesión
					</Link>{' '}
					con tu cuenta para continuar.
				</p>
			</div>
		</div>
	);
}

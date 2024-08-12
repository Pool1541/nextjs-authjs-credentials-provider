//image verify page
import { updateSession } from '@/actions/update-session.action';
import { auth } from '@/auth';
import RefreshSessionButton from '@/components/refresh-session-button';
import userRepository from '@/repository/user-prisma.repository';
import verificationTokenRepository from '@/repository/verification-token.repository';
import { nanoid } from 'nanoid';
import { redirect } from 'next/navigation';

export default async function EmailVerifyPage({
	searchParams,
}: {
	searchParams: { token: string };
}) {
	const { token } = searchParams;
	const session = await auth();
	const verificationDate = new Date();

	console.log(session?.user.emailVerified);
	if (!session?.user) return redirect('/auth/sign-in');
	if (session?.user?.emailVerified) return redirect('/dashboard');
	if (token) {
		const verificationToken = await verificationTokenRepository.getVerificationTokenByIdentifier(
			session?.user?.email!,
		);
		// if (!verificationToken) return redirect('/auth/email-verify');
		if (verificationToken && verificationToken?.token !== token) {
			/**
			 * Extraemos el email de "identifier".
			 * Eliminamos el token actual.
			 * Creamos un nuevo token con el email extraído.
			 * Redirigimos al usuario a una página de error.
			 */
			const verificationTokenEmail = verificationToken?.identifier;
			const newToken = nanoid();
			await verificationTokenRepository.deleteVerificationToken(verificationTokenEmail);
			await verificationTokenRepository.createVerificationToken(verificationTokenEmail, newToken);
		} else {
			/**
			 * Si el token es correcto, eliminamos el token y actualizamos el campo "emailVerified" del usuario.
			 */
			return <RefreshSessionButton user={session?.user} emailVerified={verificationDate} />;
		}
	}

	console.log(token);

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

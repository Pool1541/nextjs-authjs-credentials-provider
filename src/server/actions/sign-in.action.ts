'use server';

import { signIn } from '@/auth';
import { EmailNotVerified, signInSchema } from '@/server/helpers';
import { CredentialsSignin } from 'next-auth';
import { isRedirectError } from 'next/dist/client/components/redirect';
import { redirect } from 'next/navigation';
import { verificationTokenService } from '@/server/services';

export async function authenticate(
	state: any,
	formData: FormData,
): Promise<{ success: boolean; errors: any }> {
	const validationResult = signInSchema.safeParse({
		email: formData.get('email'),
		password: formData.get('password'),
	});

	if (!validationResult.success) {
		return {
			success: false,
			errors: validationResult.error?.flatten().fieldErrors,
		};
	}

	try {
		await signIn('credentials', validationResult.data);
		return redirect('/dashboard');
	} catch (error) {
		if (isRedirectError(error)) {
			return redirect('/dashboard');
		}
		if (error instanceof CredentialsSignin) {
			const errorMessage = error.message.split('.')[0];
			return { success: false, errors: errorMessage };
		}

		if (error instanceof EmailNotVerified) {
			try {
				await verificationTokenService.recreateVerificationToken(validationResult.data.email);
			} catch (error) {
				if (error instanceof Error) {
					return { success: false, errors: 'Error sending email verification' };
				}
			}

			return redirect('/auth/email-verify');
		}

		return { success: false, errors: 'unknown error' };
	}
}

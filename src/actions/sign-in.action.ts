'use server';

import { signIn } from '@/auth';
import { signInSchema } from '@/utils/zod';
import { CredentialsSignin } from 'next-auth';
import { isRedirectError } from 'next/dist/client/components/redirect';
import { redirect } from 'next/navigation';

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

		return { success: false, errors: 'unknown error' };
	}
}

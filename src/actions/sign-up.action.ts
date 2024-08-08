'use server';

import { signIn } from '@/auth';
import { signUpSchema } from '@/utils/zod';
import { isRedirectError } from 'next/dist/client/components/redirect';
import { redirect } from 'next/navigation';
import userRepository from '@/repository/user.repository';
import { CredentialsSignin } from 'next-auth';

export async function createUser(
	state: any,
	formData: FormData,
): Promise<{ success: boolean; errors: any }> {
	const validationResult = signUpSchema.safeParse({
		name: formData.get('name'),
		email: formData.get('email'),
		password: formData.get('password'),
	});

	if (!validationResult.success) {
		return {
			success: false,
			errors: validationResult.error?.flatten().fieldErrors,
		};
	}
	// TODO: verificar si el usuario ya existe
	const user = await userRepository.getUserByEmail(validationResult.data.email);

	if (user) {
		return {
			success: false,
			errors: {
				email: ['User already exists'],
			},
		};
	}

	await userRepository.saveUser({
		email: validationResult.data.email,
		name: validationResult.data.name,
		password: validationResult.data.password,
	});

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

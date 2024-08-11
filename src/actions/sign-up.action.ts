'use server';

import { CredentialsSignin } from 'next-auth';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { isRedirectError } from 'next/dist/client/components/redirect';
import userRepository from '@/repository/user-prisma.repository';
import { saltAndHashPassword, signUpSchema } from '@/helpers';

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

	const hashedPassword = await saltAndHashPassword(validationResult.data.password);

	await userRepository.saveUser({
		email: validationResult.data.email,
		name: validationResult.data.name,
		password: hashedPassword,
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

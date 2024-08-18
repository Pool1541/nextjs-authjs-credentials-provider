'use server';

import { redirect } from 'next/navigation';
import { userService } from '../services';
import { ConflictException, signUpSchema } from '../helpers';
import { isRedirectError } from 'next/dist/client/components/redirect';

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
			errors: validationResult.error.flatten().fieldErrors,
		};
	}

	try {
		await userService.createUser(validationResult.data);
		redirect('/auth/email-verify');
	} catch (error) {
		if (isRedirectError(error)) throw error;
		if (error instanceof ConflictException) return { success: false, errors: error.message };
		else return { success: false, errors: 'An error occurred' };
	}
}

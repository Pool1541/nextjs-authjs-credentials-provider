'use server';

import { redirect } from 'next/navigation';
import { userRepository } from '@/repository/user/dependencies';
import { saltAndHashPassword, sendEmailVerification, signUpSchema } from '@/helpers';

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

	const updatedUser = await userRepository.saveUser({
		email: validationResult.data.email,
		name: validationResult.data.name,
		password: hashedPassword,
	});

	if (!updatedUser) {
		return {
			success: false,
			errors: {
				email: ['Error creating user'],
			},
		};
	}

	const sendEmailVerificationResponse = await sendEmailVerification(validationResult.data.email);
	if (!sendEmailVerificationResponse.success) {
		return {
			success: false,
			errors: {
				email: ['Error sending email verification'],
			},
		};
	}

	redirect('/auth/email-verify');
}

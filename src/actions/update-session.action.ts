'use server';

import { unstable_update } from '@/auth';
import userRepository from '@/repository/user-prisma.repository';
import verificationTokenRepository from '@/repository/verification-token.repository';

export async function updateSession(
	updatedUser: any,
): Promise<{ success: boolean; errors: string | null }> {
	try {
		const verificationDate = updatedUser.emailVerified;
		await verificationTokenRepository.deleteVerificationToken(updatedUser.email);
		await userRepository.updateUser(updatedUser.email, { emailVerified: verificationDate });
		await unstable_update({ user: { ...updatedUser } });

		return {
			success: true,
			errors: null,
		};
	} catch (error) {
		console.log(error);
		return {
			success: false,
			errors: 'unknown error',
		};
	}
}

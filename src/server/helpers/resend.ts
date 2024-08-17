import { Resend } from 'resend';
import { nanoid } from 'nanoid';
import verificationTokenRepository from '@/server/repository/verification-token.repository';

const resend = new Resend(process.env.RESEND_API_KEY);

type SendEmailVerificationResponse = {
	success: boolean;
	error: string | null;
};

type recreateVerificationTokenResponse = {
	success: boolean;
	errors: string | null;
};

export async function sendEmailVerification(email: string): Promise<SendEmailVerificationResponse> {
	const token = nanoid();
	await verificationTokenRepository.createVerificationToken(email, token);
	const baseUrl =
		process.env.VERCEL_ENV === 'production'
			? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
			: 'http://localhost:3000';
	try {
		await resend.emails.send({
			from: 'Growiit <contact@growiit.com>',
			to: email,
			subject: 'Verify your email',
			html: `<div>
        <p>Click the link below to verify your email</p>
        <a href="${baseUrl}/auth/email-verify?token=${token}">Verify email</a>
      </div>
      `,
		});

		return {
			success: true,
			error: null,
		};
	} catch (error) {
		console.log(error);
		return {
			success: false,
			error: (error as Error).message,
		};
	}
}

export async function recreateVerificationToken(
	userEmail: string,
): Promise<recreateVerificationTokenResponse> {
	try {
		await verificationTokenRepository.deleteVerificationToken(userEmail);
		const sendEmailVerificationResponse = await sendEmailVerification(userEmail);

		if (!sendEmailVerificationResponse.success) {
			throw new Error('Error sending email verification');
		}

		return {
			success: true,
			errors: null,
		};
	} catch (error) {
		console.log(error);
		return {
			success: false,
			errors: (error as Error).message,
		};
	}
}

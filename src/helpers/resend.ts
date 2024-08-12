import { Resend } from 'resend';
import { nanoid } from 'nanoid';
import verificationTokenRepository from '@/repository/verification-token.repository';

const resend = new Resend(process.env.RESEND_API_KEY);

type SendEmailVerificationResponse = {
	success: boolean;
	error: string | null;
};

export const sendEmailVerification = async (
	email: string,
): Promise<SendEmailVerificationResponse> => {
	const token = nanoid();
	await verificationTokenRepository.createVerificationToken(email, token);
	const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.BASE_URL;
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
};

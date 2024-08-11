import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

type SendEmailVerificationResponse = {
	success: boolean;
	error: string | null;
};

export const sendEmailVerification = async (): Promise<SendEmailVerificationResponse> => {
	try {
		await resend.emails.send({
			from: 'Growiit <contact@growiit.com>',
			to: 'ryoiichii@gmail.com',
			subject: 'Verify your email',
			html: `<div>
        <p>Click the link below to verify your email</p>
        <a href="https://www.google.com">Verify email</a>
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

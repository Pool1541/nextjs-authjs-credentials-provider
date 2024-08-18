import { VerificationToken } from '@prisma/client';
import { CreateVerificationTokenDTO } from '@/server/types/verification-token';
import { VerificationTokenRepository } from '@/server/repository';
import { nanoid } from 'nanoid';
import { Resend } from 'resend';

export class VerificationTokenService {
	private readonly BASE_URL: string =
		process.env.VERCEL_ENV === 'production'
			? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
			: 'http://localhost:3000';

	constructor(
		private readonly repository: VerificationTokenRepository,
		private readonly emailService: Resend,
	) {}

	async sendVerificationEmail(identifier: string): Promise<void> {
		const token = nanoid();
		await this.repository.save({
			identifier,
			token,
			expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
		});

		await this.emailService.emails.send({
			from: 'Growiit <contact@growiit.com>',
			to: identifier,
			subject: 'Verify your email',
			html: `<div>
        <p>Click the link below to verify your email</p>
        <a href="${this.BASE_URL}/auth/email-verify?token=${token}">Verify email</a>
      </div>
      `,
		});
	}

	async recreateVerificationToken(identifier: string) {
		await this.repository.delete(identifier);
		await this.sendVerificationEmail(identifier);
	}

	async getVerificationToken(token: string) {
		return await this.repository.getOne(token);
	}

	async deleteVerificationToken(identifier: string) {
		await this.repository.delete(identifier);
	}
}

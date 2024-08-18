import { Resend } from 'resend';
import { EmailOptions } from '../types/email';

export class EmailService {
	constructor(private readonly emailClient: Resend) {}

	async send(emailOptions: EmailOptions) {
		return await this.emailClient.emails.send(emailOptions);
	}
}

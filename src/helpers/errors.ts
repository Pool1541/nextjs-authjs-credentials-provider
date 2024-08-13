import { AuthError } from 'next-auth';

export class EmailNotVerified extends AuthError {
	constructor(message?: string) {
		super(message || 'Email not verified');
		this.name = 'EmailNotVerified';
	}
}

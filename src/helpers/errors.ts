import { AuthError } from 'next-auth';

export class EmailNotVerified extends AuthError {
	constructor(message?: string) {
		super(message || 'Email not verified');
		this.name = 'EmailNotVerified';
	}
}

export class NotFoundException extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'NotFoundException';
	}
}

export class BadRequestException extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'BadRequestException';
	}
}

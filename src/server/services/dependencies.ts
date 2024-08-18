import { Resend } from 'resend';
import { UserRepository, VerificationTokenRepository } from '../repository';
import { UserService } from './user.service';
import { VerificationTokenService } from './verification-token.service';
import { EmailService } from './email.service';

const resend = new Resend(process.env.RESEND_API_KEY);
const emailService = new EmailService(resend);
const verificationTokenRepository = new VerificationTokenRepository();
const verificationTokenService = new VerificationTokenService(
	verificationTokenRepository,
	emailService,
);

const userRepository = new UserRepository();
const userService = new UserService(userRepository, verificationTokenService);

export { userService, verificationTokenService };

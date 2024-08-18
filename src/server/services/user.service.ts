import { CreateUserDTO, UpdateUserDTO } from '@/server/types/user';
import { UserRepository } from '@/server/repository';
import { NotFoundException, saltAndHashPassword, TokenExpiredException } from '@/server/helpers';
import { VerificationTokenService } from './verification-token.service';

export class UserService {
	constructor(
		private readonly repository: UserRepository,
		private readonly verificationTokenService: VerificationTokenService,
	) {}

	async getUserByEmail(email: string) {
		const user = await this.repository.getOne(email);

		return user;
	}

	async createUser(data: CreateUserDTO) {
		const password = await saltAndHashPassword(data.password!);
		const newUser = await this.repository.save({ ...data, password });

		await this.verificationTokenService.sendVerificationEmail(data.email);

		return newUser;
	}

	async verifyEmail(token: string) {
		const verificationToken = await this.verificationTokenService.getVerificationToken(token);
		if (!verificationToken) throw new NotFoundException('Verification token not found');

		const currentDate = new Date();
		const verificationTokenIsExpired = verificationToken.expires.getTime() <= currentDate.getTime();
		if (verificationTokenIsExpired)
			throw new TokenExpiredException('Verification token is expired');

		const email = verificationToken.identifier;
		await this.verificationTokenService.deleteVerificationToken(email);

		const updatedUser = await this.repository.update(email, { emailVerified: currentDate });

		return updatedUser;
	}
}

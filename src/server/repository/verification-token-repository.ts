import { Prisma } from '@prisma/client';
import { ConflictException } from '@/server/helpers';
import {
	Repository,
	CreateVerificationTokenDTO,
	VerificationToken,
} from '@/server/types/verification-token';
import prisma from '@/server/shared/prisma';

export class VerificationTokenRepository
	implements Repository<VerificationToken, CreateVerificationTokenDTO>
{
	async getOne(parameter: string): Promise<VerificationToken | null> {
		const verificationToken = await prisma.verificationToken.findFirst({
			where: {
				OR: [{ token: parameter }, { identifier: parameter }],
			},
		});

		return verificationToken;
	}

	async save(data: CreateVerificationTokenDTO): Promise<VerificationToken> {
		try {
			const newVerificationToken = await prisma.verificationToken.create({
				data,
			});

			return newVerificationToken;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === 'P2002')
					throw new ConflictException(
						`Verification token with identifier ${data.identifier} already exists`,
					);
			}

			throw error;
		}
	}

	async delete(identifier: string): Promise<void> {
		await prisma.verificationToken.delete({
			where: {
				identifier,
			},
		});
	}
}

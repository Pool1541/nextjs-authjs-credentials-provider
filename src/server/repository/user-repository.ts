import { Prisma } from '@prisma/client';
import { ConflictException } from '@/server/helpers';
import { CreateUserDTO, UpdateUserDTO, User } from '@/server/types/user';
import { Repository } from '@/server/types/shared';
import prisma from '@/server/shared/prisma';

export class UserRepository implements Repository<User, CreateUserDTO> {
	async getOne(email: string): Promise<User | null> {
		const user = await prisma.user.findUnique({
			where: {
				email,
			},
		});

		return user;
	}

	async save(data: CreateUserDTO): Promise<User> {
		try {
			const newUser = await prisma.user.create({
				data,
			});

			return newUser;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === 'P2002')
					throw new ConflictException(`User with email ${data.email} already exists`);
			}

			throw error;
		}
	}

	async update(email: string, data: UpdateUserDTO): Promise<User> {
		try {
			const updatedUser = await prisma.user.update({
				where: {
					email,
				},
				data,
			});

			return updatedUser;
		} catch (error) {
			console.log(error);
			throw error;
		}
	}
}

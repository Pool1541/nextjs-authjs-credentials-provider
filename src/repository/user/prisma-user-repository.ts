import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { BadRequestException } from '@/helpers';
import { CreateUserDTO, Repository, UpdateUserDTO, User } from '@/types/user';
import prisma from '@/shared/prisma';

export class PrismaUserRepository implements Repository<User, CreateUserDTO> {
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
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002')
					throw new BadRequestException(`User with email ${data.email} already exists`);
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

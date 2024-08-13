/* eslint-disable import/no-anonymous-default-export */
import { PrismaClient, User } from '@prisma/client';

export const prisma = new PrismaClient();

async function getUserByEmail(email: string) {
	try {
		return await prisma.user.findUnique({
			where: {
				email,
			},
		});
	} catch (error) {
		console.log(error);
	}
}

async function saveUser(user: any) {
	try {
		return await prisma.user.create({
			data: user,
		});
	} catch (error) {
		console.log(error);
	}
}

async function updateUser(email: string, data: Partial<User>) {
	try {
		return await prisma.user.update({
			where: {
				email,
			},
			data,
		});
	} catch (error) {
		console.log(error);
	}
}

async function userExists(email: string) {
	try {
		return await prisma.user.findUnique({
			where: {
				email,
			},
		});
	} catch (error) {
		console.log(error);
	}
}

export default {
	getUserByEmail,
	saveUser,
	updateUser,
	userExists,
};

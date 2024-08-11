/* eslint-disable import/no-anonymous-default-export */
import { PrismaClient } from '@prisma/client';

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
	userExists,
};

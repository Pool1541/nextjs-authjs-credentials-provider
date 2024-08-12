/* eslint-disable import/no-anonymous-default-export */

import { prisma } from './user-prisma.repository';

async function getVerificationTokenByToken(token: string) {
	try {
		return await prisma.verificationToken.findFirst({
			where: {
				token,
			},
		});
	} catch (error) {
		console.log(error);
	}
}

async function createVerificationToken(email: string, token: string) {
	try {
		return await prisma.verificationToken.create({
			data: {
				identifier: email,
				token,
				expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 horas
			},
		});
	} catch (error) {
		console.log(error);
	}
}

async function deleteVerificationToken(identifier: string) {
	try {
		return await prisma.verificationToken.delete({
			where: {
				identifier,
			},
		});
	} catch (error) {
		console.log(error);
	}
}

export default {
	getVerificationTokenByToken,
	createVerificationToken,
	deleteVerificationToken,
};

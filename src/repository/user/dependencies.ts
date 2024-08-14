import { PrismaUserRepository } from './prisma-user-repository';
import { UserRepository } from './user-repository';

const prismaUserRepository = new PrismaUserRepository();
export const userRepository = new UserRepository(prismaUserRepository);

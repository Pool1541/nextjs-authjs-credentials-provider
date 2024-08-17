import { PrismaUserRepository } from './prisma-user-repository';
import { UserRepository } from './user-repository';

const prismaUserRepository = new PrismaUserRepository();
const userRepository = new UserRepository(prismaUserRepository);

export default userRepository;

import { NotFoundException } from '@/helpers';
import { CreateUserDTO, Repository, UpdateUserDTO, User } from '@/types/user';

export class UserRepository {
	constructor(private readonly db: Repository<User, CreateUserDTO>) {}

	async getUserByEmail(email: string) {
		const user = await this.db.getOne(email);

		if (!user) throw new NotFoundException(`User with email ${email} not found`);

		return user;
	}

	async saveUser(data: CreateUserDTO) {
		const newUser = await this.db.save(data);

		return newUser;
	}

	async updateUser(email: string, data: UpdateUserDTO) {
		const updatedUser = await this.db.update(email, data);

		return updatedUser;
	}
}

import { CreateUserDTO, Repository, UpdateUserDTO, User } from '@/types/user';

export class UserRepository {
	constructor(private readonly db: Repository<User, CreateUserDTO>) {}

	async getUserByEmail(email: string) {
		const user = await this.db.getOne(email);

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

import bcrypt from 'bcryptjs';

export async function saltAndHashPassword(password: string): Promise<string> {
	const saltRounds = 10; // Número de rondas de salting
	const salt = await bcrypt.genSalt(saltRounds);
	const hashedPassword = await bcrypt.hash(password, salt);
	return hashedPassword;
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
	const isMatch = await bcrypt.compare(password, hashedPassword);
	return isMatch;
}

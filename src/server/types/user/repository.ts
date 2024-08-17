export interface Repository<T, U> {
	getOne: (email: string) => Promise<T | null>;
	save: (data: U) => Promise<T>;
	update: (email: string, data: Partial<T>) => Promise<T>;
}

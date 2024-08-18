export interface Repository<T, U> {
	getOne: (parameter: string) => Promise<T | null>;
	save: (data: U) => Promise<T>;
	delete: (identifier: string) => Promise<void>;
}

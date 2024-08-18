export interface Repository<T, U> {
	getOne?: (parameter: string) => Promise<T | null>;
	save?: (data: U) => Promise<T>;
	update?: (parameter: string, data: Partial<T>) => Promise<T>;
	delete?: (parameter: string) => Promise<void>;
}

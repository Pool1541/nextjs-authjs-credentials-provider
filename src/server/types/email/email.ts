type RequireAtLeastOne<T> = {
	[K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>;
}[keyof T];

interface CreateEmailOptions {
	from: string;
	to: string;
	subject: string;
}

interface EmailRenderOptions {
	html: string;
	text: string;
	react: React.ReactNode;
}

export type EmailOptions = RequireAtLeastOne<EmailRenderOptions> & CreateEmailOptions;

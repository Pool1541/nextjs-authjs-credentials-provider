import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Home | Acme',
	description: 'Home',
};

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<h1>Home</h1>
		</main>
	);
}

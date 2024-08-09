import { Metadata } from 'next';
import Link from 'next/link';
import SendEmailVerificationButton from '../components/send-email-verification-button';

export const metadata: Metadata = {
	title: 'Home | Acme',
	description: 'Home',
};

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<div>
				<h1>Home</h1>
				<Link href={'/dashboard'} className='text-slate-100 underline underline-offset-4'>Dashboard</Link>
				<div className='size-14'></div>
				<SendEmailVerificationButton />
			</div>
		</main>
	);
}

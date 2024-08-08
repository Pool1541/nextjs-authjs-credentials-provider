import { SignIn } from '@/components/sign-in';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Sign In',
	description: 'Sign In',
};

export default function Page() {
	return (
		<div className="bg-slate-900 h-full">
			<SignIn />
		</div>
	);
}

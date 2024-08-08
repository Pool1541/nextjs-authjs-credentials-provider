import { SignUp } from '@/components/sign-up';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Sign Up',
	description: 'Sign Up',
};

export default function Page() {
	return (
		<div className="bg-slate-900 h-full">
			<SignUp />
		</div>
	);
}

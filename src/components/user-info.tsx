/* eslint-disable @next/next/no-img-element */
import { auth } from '@/auth';
import { wait } from '@/utils/utils';

export default async function UserInfo() {
	const session = await auth();
	let name: string | null | undefined;

	await wait(2);

	if (session) {
		if (!session.user) return null;
		name = session.user.name;
	}

	return (
		<span>
			<span className="text-slate-900 font-semibold">{name}</span>
		</span>
	);
}

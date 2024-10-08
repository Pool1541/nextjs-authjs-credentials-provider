import { SignOut } from '@/components/sign-out';
import UserInfo from '@/components/user-info';
import { Metadata } from 'next';
import { Suspense } from 'react';

// La carga del componente UserInfo bloquea el renderizado de toda la página
// TODO ✅: Aplicar partial-prerendering o streaming de datos para mejorar la carga de la página.
export const metadata: Metadata = {
	title: 'Dashboard	',
	description: 'Dashboard',
};

export default function Dashboard() {
	return (
		<>
			<div>
				Welcome to your dashboard{' '}
				<Suspense fallback={<span>...</span>}>
					<UserInfo />
				</Suspense>
			</div>

			<SignOut />
		</>
	);
}

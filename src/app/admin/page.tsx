import { auth } from '@/auth';
import { Role } from '@prisma/client';

export default async function Admin() {
	const session = await auth();

	if (session?.user.role !== Role.ADMIN) {
		return <div>No tienes permisos para ver este contenido.</div>;
	}

	return <div>Dashboard de administrador</div>;
}

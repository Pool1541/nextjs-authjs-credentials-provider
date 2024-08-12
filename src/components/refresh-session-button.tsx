/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { updateSession } from '@/actions/update-session.action';
import { useEffect, useState } from 'react';

export default function RefreshSessionButton({
	user,
	emailVerified,
}: {
	user: any;
	emailVerified: Date;
}) {
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		updateSession({ ...user, emailVerified })
			.then(({ success }) => setSuccess(success))
			.catch(({ error }) => setError(error));
	}, []);

	return (
		<>
			{success && (
				<div className="flex items-center justify-center h-screen">
					<div className="p-8 rounded shadow-md w-96">
						<h1 className="text-2xl font-semibold text-center">Email verified</h1>
						<p className="mt-4 text-center text-gray-500">
							Your email has been verified successfully.
						</p>
					</div>
				</div>
			)}
			{error && (
				<div className="flex items-center justify-center h-screen">
					<div className="p-8 rounded shadow-md w-96">
						<h1 className="text-2xl font-semibold text-center">Error</h1>
						<p className="mt-4 text-center text-gray-500">{error}</p>
					</div>
				</div>
			)}
		</>
	);
}

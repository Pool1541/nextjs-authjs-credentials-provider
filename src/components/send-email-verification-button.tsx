import { sendEmailVerification } from '@/helpers/resend';

export default function SendEmailVerificationButton() {
	return (
		<form
			action={async () => {
				'use server';

				// const response = await sendEmailVerification();
				// console.log({ response });
			}}>
			<button
				type="submit"
				className="bg-slate-100 text-black px-4 py-1 rounded-md hover:bg-slate-200">
				Send email
			</button>
		</form>
	);
}

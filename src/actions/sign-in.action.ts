'use server';

import { signIn } from '@/auth';
import { signInSchema } from '@/utils/zod';
import { isRedirectError } from 'next/dist/client/components/redirect';
import { redirect } from 'next/navigation'

export async function authenticate(state: any, formData: FormData): Promise<{ success: boolean, errors: any }> {

  const validationResult = signInSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password')
  });

  if (!validationResult.success) {
    return {
      success: false,
      errors: validationResult.error?.flatten().fieldErrors,
    }
  }

  try {
    await signIn('credentials', validationResult.data);
    return redirect('/dashboard');
  } catch (error) {
    if (isRedirectError(error)) {
      return redirect('/dashboard');
    }
    if (error instanceof Error) {
      console.log(error);
      return { success: false, errors: error.cause?.err.message };
    }

    return { success: false, errors: 'unknown error' };
  }
}

// export async function authenticate(state: any, formData: FormData): Promise<{data: any, errors: any}> {
//   const email = formData.get('email');
//   const password = formData.get('password');

//   const validationResult = signInSchema.safeParse({
//     email,
//     password
//   });

//   if (!validationResult.success) {
//     return {data: null, errors: validationResult.error.flatten().fieldErrors};
//   }

//   return {data: validationResult.data, errors: null};
// }
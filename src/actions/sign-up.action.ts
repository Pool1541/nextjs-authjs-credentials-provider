'use server';

import { signIn } from '@/auth';
import { signUpSchema } from '@/utils/zod';
import { isRedirectError } from 'next/dist/client/components/redirect';
import { redirect } from 'next/navigation';
import userRepository from '@/repository/user.repository';


export async function createUser(
  state: any,
  formData: FormData
): Promise<{ success: boolean; errors: any }> {
  const validationResult = signUpSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validationResult.success) {
    return {
      success: false,
      errors: validationResult.error?.flatten().fieldErrors,
    };
  }

  await userRepository.saveUser({
    email: validationResult.data.email,
    name: validationResult.data.name,
    password: validationResult.data.password
  });

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

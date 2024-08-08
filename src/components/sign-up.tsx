/* eslint-disable @next/next/no-img-element */
'use client';
import { authenticate } from '@/actions/sign-in.action';
import { createUser } from '@/actions/sign-up.action';
import { useFormState, useFormStatus } from 'react-dom';

type authenticateState =
  {
    success: boolean,
    errors: any,
  }


const initialState: authenticateState = {
  errors: {
    email: [],
    password: [],
  },
  success: false,
};

export function SignUp() {
  const [state, action] = useFormState(createUser, initialState);

  return (
    <>
      <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
        <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
          <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-slate-100'>
            Create an account
          </h2>
        </div>

        <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
          <form action={action} className='space-y-6'>
          <div>
              <label htmlFor='name' className='block text-sm font-medium leading-6 text-slate-100'>
                Name
              </label>
              <div className='mt-2'>
                <input
                  id='name'
                  name='name'
                  type='text'
                  autoComplete='name'
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 outline-none pl-3'
                />
                {state?.errors?.name && (
                  <p className='text-md text-red-600 pt-1'>{state.errors.name[0]}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor='email' className='block text-sm font-medium leading-6 text-slate-100'>
                Email address
              </label>
              <div className='mt-2'>
                <input
                  id='email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 outline-none pl-3'
                />
                {state?.errors?.email && (
                  <p className='text-md text-red-600 pt-1'>{state.errors.email[0]}</p>
                )}
              </div>
            </div>

            <div>
              <div className='flex items-center justify-between'>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium leading-6 text-slate-100'>
                  Password
                </label>
                <div className='text-sm'></div>
              </div>
              <div className='mt-2'>
                <input
                  id='password'
                  name='password'
                  type='password'
                  autoComplete='current-password'
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 outline-none pl-3'
                />
                {state?.errors?.password && (
                  <p className='text-md text-red-600 pt-1'>{state.errors.password[0]}</p>
                )}
              </div>
            </div>

            <div>
              <SubmitButton />
              {state?.errors && typeof state.errors === 'string' && (
                <p className='text-md text-red-600 pt-1'>{state.errors}</p>
              )}
            </div>
          </form>
          <p className='mt-10 text-center text-sm text-gray-500'>Not a member? </p>
        </div>
      </div>
    </>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  console.log({ pending })
  return (
    <button
      className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      disabled={pending}>
      {pending ? 'Submitting' : 'Sign in'}
    </button>
  );
}

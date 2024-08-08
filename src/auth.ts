import NextAuth, { Session } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { signInSchema } from "./utils/zod";
import { NextRequest, NextResponse } from "next/server";
import { verify } from 'jsonwebtoken'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const { email, password } = await signInSchema.parseAsync(credentials)

        // Lógica de autenticación personalizada
        if (email === "pool_1541@hotmail.com" && password === "password123") {
          // Retornar el objeto de usuario si las credenciales son válidas
          return { id: "1", name: "John Doe", email: "pool_1541@hotmail.com" };
        } else {
          // Lanzar un error si las credenciales no son válidas
          throw new Error("Invalid email or password");
        }
      },
    }),
  ],
  // Opcional: Configuración adicional de NextAuth
  session: {
    strategy: "jwt",
  },
  secret: "my-secret",
  callbacks: {
    authorized: async ({request, auth}: { request: NextRequest, auth: Session | null}) => {
      const protecterRoutes = ["/dashboard"];
      const url = request.nextUrl.pathname;
      const isProtectedRoute = protecterRoutes.includes(url);

      if (url === "/") return true;

      if (!auth) {
        return false;
      }

      if (isProtectedRoute) {
        const { user, expires } = auth;
        console.log({ user, expires});

        if (user) {
          return true;
        }
      }

      return false
    }
  },
  pages: {
    signIn: '/auth/sign-in',
  }
});

function validateAuthToken(authToken: any) {
  // Implement your logic to validate the authToken here
  // For example, you can check if the authToken is a valid JWT token
  // and if it has not expired
  // You can use libraries like jsonwebtoken to help with this

  // Here's an example implementation using jsonwebtoken library
  const secret = 'my-secret';

  try {
    // Verify the authToken using the secret key
    const decoded = verify(authToken, secret);
    console.log(decoded)
    // If the verification is successful, return true
    return true;
  } catch (error) {
    // If the verification fails, return false or throw an error
    return false;
  }
}



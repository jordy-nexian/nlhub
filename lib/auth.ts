import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const adminEmail = process.env.ADMIN_EMAIL ?? "admin@nexian.co.uk";
const adminPassword = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt"
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {}
      },
      authorize(credentials) {
        if (
          credentials.email === adminEmail &&
          credentials.password === adminPassword
        ) {
          return {
            id: "trainer-admin",
            name: "Nexian Trainer",
            email: adminEmail
          };
        }

        return null;
      }
    })
  ],
  pages: {
    signIn: "/auth/signin"
  },
  callbacks: {
    authorized({ auth: session, request }) {
      const isLoggedIn = !!session?.user;
      const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

      if (isAdminRoute) {
        return isLoggedIn;
      }

      return true;
    }
  }
});

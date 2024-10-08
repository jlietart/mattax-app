import NextAuth, { Account, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";

interface CustomSession extends Session {
  accessToken?: string;
  refreshToken?: string;
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/gmail.readonly",
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({
      token,
      account,
    }: {
      token: JWT;
      account: Account | null;
      trigger?: "signIn" | "signUp" | "update";
    }): Promise<JWT> {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: CustomSession;
      token: JWT;
    }): Promise<CustomSession> {
      (session as CustomSession).accessToken = token.accessToken as string;
      (session as CustomSession).refreshToken = token.refreshToken as string;

      return session as CustomSession;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

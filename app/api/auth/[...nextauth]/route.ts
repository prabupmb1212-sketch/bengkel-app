import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const hasGoogleCredentials =
  Boolean(process.env.GOOGLE_CLIENT_ID) &&
  Boolean(process.env.GOOGLE_CLIENT_SECRET) &&
  !["PASTE_GOOGLE_CLIENT_ID_HERE", "Client_ID_asli_dari_Google", "nilai_asli_dari_google"].includes(process.env.GOOGLE_CLIENT_ID ?? "") &&
  !["PASTE_GOOGLE_CLIENT_SECRET_HERE", "Client_Secret_asli_dari_Google", "nilai_asli_dari_google"].includes(process.env.GOOGLE_CLIENT_SECRET ?? "");

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Email dan password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (
          typeof email !== "string" ||
          typeof password !== "string" ||
          email !== process.env.LOGIN_EMAIL ||
          password !== process.env.LOGIN_PASSWORD
        ) {
          return null;
        }

        return {
          id: email,
          email,
          name: email.split("@")[0],
        };
      },
    }),
    ...(hasGoogleCredentials
      ? [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
      ]
      : []),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/login",
  },
});

export { handler as GET, handler as POST };
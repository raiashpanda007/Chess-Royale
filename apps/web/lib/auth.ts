import CredentialsProvider from 'next-auth/providers/credentials';
import { Prisma, PrismaClient } from '@workspace/db';
const prisma = new PrismaClient();
import GoogleProvider from "next-auth/providers/google";
const NEXT_AUTH_CONFIG = {
  providers: [
    // Providers configuration remains the same
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'UserName', type: 'text', placeholder: 'Enter Username/Email' },
        password: { label: 'Password', type: 'password', placeholder: 'Enter Password' },
      },
      async authorize(credentials: any) {
        try {
          const user = await prisma.user.findFirst({
            where: {
              OR: [
                { email: credentials.username },
                { username: credentials.username },
              ],
            },
            select: {
              password: true,
              profilePicture: true,
              id: true,
              email: true,
              username: true,
            },
          });
          if (user) {
            if (credentials.password === user.password) {
              return {
                id: user.id,
                email: user.email,
                profilePicture: user.profilePicture,
                username: user.username,
              };
            }
          } else {
            const createUser = await prisma.user.create({
              data: {
                email: credentials.username,
                username: credentials.username,
                password: credentials.password,
              },
            });
            return {
              id: createUser.id,
              email: createUser.email,
              profilePicture: createUser.profilePicture,
              username: createUser.username,
            };
          }
          return null;
        } catch (error) {
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ' ',
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ user, token }: any) {
      try {
        const providerAccountId = user?.id || token.sub; // Use token.sub as fallback
        const provider = user?.provider || 'GOOGLE';

        // Check if user exists in the database
        const existingUser = await prisma.user.findUnique({
          where: { email: token.email },
        });

        if (existingUser) {
          // Enrich token with user details
          token.id = existingUser.id; // Consistent field name
          token.username = existingUser.username;
          token.email = existingUser.email;
          token.profilePicture = existingUser.profilePicture;
        } else {
          // Create new user and associated account in a transaction
          const { createUser } = await prisma.$transaction(async (tx:Prisma.TransactionClient) => {
            const createUser = await tx.user.create({
              data: {
                email: token.email,
                username: token.email, // Generate unique username
                profilePicture: token.picture || null,
                name: token.name || null,
              },
            });
            const addAccount = await tx.account.create({
              data: {
                userId: createUser.id,
                providerAccountId: providerAccountId,
                provider: provider.toUpperCase(),
              },
            });
            return { createUser };
          });

          // Enrich token with newly created user details
          token.id = createUser.id; // Consistent field name
          token.username = createUser.username;
          token.email = createUser.email;
          token.profilePicture = createUser.profilePicture;
          token.name = createUser.name;
        }
      } catch (error) {
        console.error('Error during JWT callback:', error);
      }

      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id; // Correctly reference `id` here
        session.user.username = token.username;
        session.user.profilePicture = token.profilePicture;
        session.user.email = token.email;
      }
      return session;
    },
  },
};

export default NEXT_AUTH_CONFIG;
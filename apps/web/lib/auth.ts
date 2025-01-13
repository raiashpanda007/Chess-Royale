import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaClient } from '@workspace/db';

const prisma = new PrismaClient();

const NEXT_AUTH_CONFIG = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username or Email', type: 'text', placeholder: 'Enter Username/Email' },
        password: { label: 'Password', type: 'password', placeholder: 'Enter Password' },
      },
      async authorize(credentials: any) {
        try {
          // Find user by email or username
          const user = await prisma.user.findFirst({
            where: {
              OR: [
                { email: credentials.username },
                { username: credentials.username },
              ],
            },
            select: {
              id: true,
              email: true,
              username: true,
              profilePicture: true,
              password: true,
            },
          });

          if (user) {
            // Validate password directly
            if (credentials.password === user.password) {
              return {
                id: user.id,
                email: user.email,
                username: user.username || user.email,
                profilePicture: user.profilePicture,
              };
            } else {
              throw new Error('Invalid username or password');
            }
          } else {
            // Create a new user if not found
            const newUser = await prisma.user.create({
              data: {
                email: credentials.username,
                username: credentials.username || credentials.email,
                password: credentials.password,
              },
            });

            return {
              id: newUser.id,
              email: newUser.email,
              username: newUser.username,
              profilePicture: newUser.profilePicture,
            };
          }
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ user, token, account, profile }: any) {
      if (account && profile) {
        // Check if this is a Google login
        if (account.provider === 'google') {
          const email = profile.email;
          const existingUser = await prisma.user.findUnique({
            where: { email },
          });
  
          // If the user doesn't exist in the database, create it
          if (!existingUser) {
            const newUser = await prisma.user.create({
              data: {
                email,
                username: profile.name || email.split('@')[0], // Use name or fallback to email
                profilePicture: profile.picture || '', // Use Google profile picture
                
              },
            });
            console.log('New user:', newUser);
            token.id = newUser.id; // Use Prisma `id`
          } else {
            console.log('Existing user:', existingUser);
            token.id = existingUser.id; // Use existing Prisma `id`
          }
        }
      }
  
      if (user) {
        console.log('User token:', token);
        token.id = user.id; // For CredentialsProvider
      }
  
      return token;
    },
  
    async session({ session, token }: any) {
      console.log('Session token:', token);
      if (session.user) {
        session.user.id = token.id; // Use Prisma `id`
        session.user.email = token.email;
        session.user.username = token.username;
        session.user.profilePicture = token.profilePicture;
      }
      return session;
    },
  },
  
};

export default NEXT_AUTH_CONFIG;

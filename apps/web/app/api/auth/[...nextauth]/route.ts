import NextAuth from "next-auth"
import CredentialsProvider from 'next-auth/providers/credentials';
import NEXT_AUTH_CONFIG from "@/lib/auth";
const handler = NextAuth(NEXT_AUTH_CONFIG)

export { handler as GET, handler as POST }
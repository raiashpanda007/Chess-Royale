import { getServerSession } from "next-auth";
import NEXT_AUTH_CONFIG from "@/lib/auth";

export const getAuthSession = async () => {
  return await getServerSession(NEXT_AUTH_CONFIG);
};
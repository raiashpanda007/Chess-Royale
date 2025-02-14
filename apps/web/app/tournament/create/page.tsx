import { getServerSession } from "next-auth";
import { ReactElement } from "react";
import NEXT_AUTH_CONFIG from "@/lib/auth";
import CreateTournamentForm from "@/components/Forms/CreateTournament";
import useRequireAuth from "@/hooks/checkvalidation";
import { redirect } from "next/navigation";

const Page = async (): Promise<ReactElement> => { 

  const session = await getServerSession(NEXT_AUTH_CONFIG);
  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="h-screen w-full flex justify-evenly items-center flex-col">
      <h1 className="text-4xl sm:text-6xl font-poppins font-bold">Create Tournament</h1>
      <CreateTournamentForm />
    </div>
  );
};
export default Page;


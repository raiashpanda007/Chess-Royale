"use client";
import type { DefaultSession } from "next-auth";
import { Button } from "@workspace/ui/components/button";
declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
    };
  }
}
import axios from "axios";
import React from "react";
import {toast} from 'sonner'
import { useRouter } from "next/navigation";
interface TournamentsListProps {
  id: string;
  name: string;
  users: string[];
  logo: string;
  tournamentstatus: string;
  numberOfPlayers: number;
}
import { useSession } from "next-auth/react";
function TournamentsList({
  id,
  name,
  users,
  logo,
  tournamentstatus,
  numberOfPlayers,
}: TournamentsListProps) {
    const router = useRouter();
    const joinContest = async (tournamentId:string) =>{
        try {
            const response = await axios.put('http://localhost:3000/api/tournament/join/userRequest', {tournamentId});
            console.log(response);
            if(response){
                toast(response.data.data.message, {
                    description: `Tournament ID: ${response.data.data.id}`,
                    action: {
                      label: "View",
                      onClick: () => router.push(`/tournament/${response.data.data.id}`),
                    },
                  });
            }
        } catch (error) {
            toast("Failed to join the tournament", {
                description: JSON.stringify(error),
                action: {
                  label: "Retry",
                  onClick: () => joinContest(tournamentId),
                },
              });
        }
    }


  const { data: session, status } = useSession();
  console.log(session);
  if (status === "loading") return <div>Loading...</div>;
  const isUserPartOfTournament = users? users.includes(session?.user?.id as string):false;

  return (
    <div className="w-full h-36 rounded-3xl flex items-center hover:border hover:bg-gray-900 animate-in cursor-pointer font-poppins">
      <div className="w-1/6 flex items-centter justify-center ">
        <img src={logo} alt="logo" className="w-20 h-20 rounded-full" />
      </div>
      <div className="w-2/4 flex flex-col justify-center ">
        <h1 className="text-3xl font-bold">{name}</h1>
        <p className="text-sm">{id}</p>
      </div>
      <div className="w-1/3 h-full flex flex-col justify-center items-center">
        {tournamentstatus === "OPEN" ? (
          <div className="w-full flex flex-col items-center ">
            <Button
              variant={isUserPartOfTournament?"ghost":"default"}
              className="w-1/3 font-poppins font-semibold"
              onClick={()=>joinContest(id)}
            >
              {isUserPartOfTournament ? "Joined" : "Join"}
            </Button>
            <p className="text-sm">
              {users ?users.length:0 }/{numberOfPlayers}
            </p>
            <p
              className={
                isUserPartOfTournament
                  ? `font-semibold text-destructive`
                  : `font-semibold`
              }
            >
              {tournamentstatus}
            </p>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center ">
            <Button
              variant={"ghost"}
              className="w-1/3 font-poppins font-semibold cursor-not-allowed " 
            >
              {isUserPartOfTournament ? "Joined" : "Join"}
            </Button>
            <p className="text-sm">
              {users.length}/{numberOfPlayers}
            </p>
            <p
              className={
                `font-semibold text-destructive`
                 
              }
            >
              {tournamentstatus}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TournamentsList;

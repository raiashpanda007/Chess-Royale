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
import React from "react";
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
  const { data: session, status } = useSession();
  console.log(session);
  if (status === "loading") return <div>Loading...</div>;
  const isUserPartOfTournament = users.includes(session?.user?.id as string);

  return (
    <div className="w-full h-36 rounded-3xl flex items-center border font-poppins">
      <div className="w-1/6 flex items-centter justify-center border">
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
            >
              {isUserPartOfTournament ? "Joined" : "Join"}
            </Button>
            <p className="text-sm">
              {users.length}/{numberOfPlayers}
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

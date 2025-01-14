"use client";
import React, { useEffect, useState } from "react";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import SearchTournaments from "@workspace/ui/components/SearchTournaments";
import TournamentsList from "@/components/Tournaments/TournamentsList";
import Slugjoin from "@/components/Tournaments/SlugJoin";
import type { User } from "@/types/User";
interface Tournament {
  id: string;
  name: string;
  users: User[];
  logo: string;
  status: string;
  numberOfPlayers: number;
}
import axios from "axios";
function page() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/tournament/list"
        );
        setTournaments(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTournaments();
  }, []);
  return (
    <div className="h-screen w-full font-poppins">
      <div className="relative top-16 w-full h-40 items-center justify-evenly flex ">
        <div className="w-3/6 h-36 flex justify-center items-center space-x-3">
          <SearchTournaments />
        </div>
        <div className="w-1/4 h-36 flex font-popins justify-evenly items-center border rounded-3xl">
          <Slugjoin />
        </div>
      </div>
      <div
        className="relative top-16 w-full flex justify-evenly items-center "
        style={{ height: "calc(100% - 224px)" }}
      >
        <ScrollArea className="w-full h-full overflow-auto">
          {tournaments.length < 1 ? (
            <div className="w-full h-full flex items-center justify-center">
              <h1 className="text-2xl font-bold">No tournaments found</h1>
            </div>
          ) : (
            tournaments.map((tournament) => (
              <TournamentsList
                key={tournament.id}
                id={tournament.id}
                name={tournament.name}
                users={tournament.users.map((user) => user.id)}
                logo={tournament.logo}
                tournamentstatus={tournament.status}
                numberOfPlayers={tournament.numberOfPlayers}
              />
            ))
          )}
        </ScrollArea>
      </div>
    </div>
  );
}

export default page;

"use client";
import { FC, useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import type { Tournament } from "@/types/Tournament";
import type { Match } from "@/types/Match";

import { Skeleton } from "@workspace/ui/components/skeleton";
import { Button } from "@workspace/ui/components/button";
import CopyButton from "@workspace/ui/components/CopyButton";
import TabsDemo from "@/components/MacthesList/Tournament";
import DeleteDialog from "@/components/Forms/DeleteDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { User } from "@/types/User";

const Page: FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { tournamentid } = useParams();

  const [loading, setLoading] = useState<boolean>(true);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [round, setRound] = useState<string>("");
  const [matches, setMatches] = useState<Match[]>([]);
  const [winner, setWinner] = useState<User[] | null>(null);
  const [startRound, setStartRound] = useState<boolean>(false);

  const fetchTournament = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://web.chesssroyale.games/api/tournament/fetch`,
        { headers: { tournamentid } }
      );
      setTournament(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch tournament details");
    } finally {
      setLoading(false);
    }
  }, [tournamentid]);

  const startTournament = async () => {
    try {
      const response = await axios.post(
        `https://web.chesssroyale.games/api/tournament/start`,
        { tournamentid }
      );
      if (response) {
        setMatches(response.data.data.matches);
        setStartRound(true);
      }
    } catch (error) {
      toast("Failed to start the tournament", {
        description: JSON.stringify(error),
        action: { label: "Retry", onClick: startTournament },
      });
    }
  };

  const generateNextRound = async () => {
    try {
      const newRound = await axios.post(
        `https://api.chesssroyale.games/generate_next_round`,
        { tournamentID: tournament?.id, adminID: tournament?.admin.id }
      );
      console.log(newRound);
      if (newRound.data.status === 201) {
        toast("Winner of the tournament is ");
        setWinner(newRound.data.data);
      }

      await getRoundMatches();
    } catch (error) {
      toast("Failed to generate next round", {
        description: JSON.stringify(error),
        action: { label: "Retry", onClick: generateNextRound },
      });
    }
  };

  const getRoundMatches = useCallback(async () => {
    if (!round) return;

    try {
      const response = await axios.post(
        `http://localhost:3000/tournament/fetch/matches`,
        { roundid: round }
      );
      if (response.data) {
        setMatches(response.data.data.matches);
      }
    } catch (error) {
      toast("Failed to get round matches", {
        description: JSON.stringify(error),
        action: { label: "Retry", onClick: getRoundMatches },
      });
    }
  }, [round]);

  useEffect(() => {
    if (tournament?.status?.toString() === "START") {
      setStartRound(true);
    }
  }, [tournament]);

  useEffect(() => {
    fetchTournament();
  }, [fetchTournament]);

  useEffect(() => {
    getRoundMatches();
  }, [getRoundMatches]);

  return (
    <div className="h-screen w-full font-poppins">
      <div className="relative top-16 w-full h-auto flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0">
        <div className="w-full md:w-1/6 h-36 flex justify-center">
          {loading ? (
            <Skeleton className="h-28 w-28 rounded-full" />
          ) : (
            <img
              src={tournament?.logo ? tournament.logo : "/tournamentlogo.jpg"}
              className="h-28 w-28 rounded-full"
            />
          )}
        </div>
        <div className="w-full md:w-5/6 h-full space-y-3">
          {loading ? (
            <Skeleton className="h-[40px] w-full rounded-md" />
          ) : (
            <div className="flex justify-between w-full">
              <h1 className="text-5xl font-bold">{tournament?.name}</h1>
              {session?.user?.id === tournament?.admin.id && (
                <DeleteDialog tournamentid={tournamentid} />
              )}
            </div>
          )}
          {loading ? (
            <Skeleton className="h-1/4 w-full rounded-md" />
          ) : (
            <div className="h-1/3 w-full">
              <p className="flex space-x-2 w-1/2">
                <span className="font-semibold mr-2">Tournament ID:</span>
                {tournament?.admin.id}
              </p>
              <p className="flex space-x-2 w-1/2">
                <span className="font-semibold mr-2">Created At:</span>
                {tournament?.createdAt
                  ? new Date(tournament.createdAt).toLocaleDateString()
                  : ""}
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="w-full mt-6 p-3" style={{ height: "calc(100% - 80px)" }}>
        <div className="h-24 w-full md:w-1/3 rounded-lg shadow-md p-3 flex justify-center items-center border">
          <p>{tournament?.slug}</p>
          <CopyButton data={tournament?.slug || ""} />
        </div>
        <div className="w-full h-auto md:h-16 flex flex-col md:flex-row justify-between border gap-2 p-2 mt-4">
          <Select onValueChange={(value) => setRound(value)}>
            <SelectTrigger className="w-[180px] font-semibold">
              <SelectValue placeholder="Select Round" />
            </SelectTrigger>
            <SelectContent>
              {tournament?.rounds?.length ? (
                tournament.rounds.map((r, index) => (
                  <SelectItem key={r.id} value={r.id}>
                    Round {index + 1}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="0">Not started</SelectItem>
              )}
            </SelectContent>
          </Select>
          {tournament?.admin.id === session?.user.id && (
            <Button className="font-bold" onClick={generateNextRound}>
              Generate Next Round
            </Button>
          )}
          {!startRound && tournament?.admin.id === session?.user.id && (
            <Button className="font-bold" onClick={startTournament}>
              Start Tournament
            </Button>
          )}
        </div>
        <div className="w-full h-full p-3 flex flex-col items-center">
          <TabsDemo
            matches={matches}
            winner={winner}
            tournamentid={tournament?.id}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;

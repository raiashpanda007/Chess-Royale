"use client";
import { FC, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { Tournament } from "@/types/Tournament";
import axios from "axios";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Button } from "@workspace/ui/components/button";
import CopyButton from "@workspace/ui/components/CopyButton";
import TabsDemo from "@/components/MacthesList/Tournament";
import { useRouter } from "next/navigation";
import DeleteDialog from "@/components/Forms/DeleteDialog";
import { useSession } from "next-auth/react";
import { StatusTournament } from "@workspace/db";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
const Page: FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { tournamentid } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [tournament, setTournament] = useState<Tournament>();

  const startTournament = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/tournament/start",
        { tournamentid: tournamentid }
      );
      if (response) {
        toast(response.data.data.message, {
          description: `Tournament ID: ${response.data.data.id}`,
        });
      }
    } catch (error) {
      toast("Failed to start the tournament", {
        description: JSON.stringify(error),
        action: {
          label: "Retry",
          onClick: () => startTournament(),
        },
      });
    }
  };

  const fetchTournament = async () => {
    const repsonse = await axios.get(
      `http://localhost:3000/api/tournament/fetch`,
      {
        headers: {
          tournamentid: tournamentid,
        },
      }
    );
    setTournament(repsonse.data.data);
    setLoading(false);
  };
  useEffect(() => {
    const fetch = async () => {
      await fetchTournament();
    };
    fetch();
  }, []);

  const createdDate = tournament?.createdAt
    ? new Date(tournament?.createdAt).toLocaleDateString()
    : "";
  return (
    <div className="h-screen w-full font-poppins">
      <div className="relative top-16 w-full h-40 items-center flex ">
        <div className="w-1/6 h-36  flex justify-center">
          {loading ? (
            <Skeleton className="h-28 w-28 rounded-full" />
          ) : (
            <div>
              <img src={tournament?.logo} className="h-28 w-28 rounded-full" />
            </div>
          )}
        </div>
        <div className="w-5/6 h-full   space-y-3">
          {loading ? (
            <Skeleton className="h-[40px] w-full rounded-md" />
          ) : (
            <div className="flex justify-between w-full">
              <h1 className="font-poppins text-5xl font-bold">
                {tournament?.name}
              </h1>
              {session?.user.id === tournament?.admin.id && (
                <div className="flex justify-between">
                  <DeleteDialog tournamentid={tournamentid} />
                </div>
              )}
            </div>
          )}
          {loading ? (
            <Skeleton className="h-1/4 w-full rounded-md" />
          ) : (
            <div className="h-1/3 w-full ">
              <p className="flex space-x-2 w-1/2">
                <span className="font-2xl font-semibold mr-2">
                  Tournament ID
                </span>
                {tournament?.admin.id}
              </p>
              <p className="flex space-x-2 w-1/2">
                <span className="font-2xl font-semibold mr-2">Created At </span>
                {createdDate}
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="w-full mt-6  p-3" style={{ height: "calc(100% - 80px)" }}>
        <div className="h-24 w-1/3 rounded-lg shadow-md p-3 flex justify-center items-center border ">
          <p>{tournament?.slug}</p>
          <CopyButton data={tournament?.slug || ""} />
        </div>
        <div className="w-full h-full p-3 flex flex-col items-center ">
          <div className="w-full h-16 flex justify-between border border:white">
            <Select>
              <SelectTrigger className="w-[180px] font-poppins font-semibold">
                <SelectValue placeholder="Round" />
                
              </SelectTrigger>
              <SelectContent>
              {tournament?.round ?tournament.round.map((round, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {index + 1}
                  </SelectItem>
                )):<SelectItem value="0">Not started</SelectItem>}
              </SelectContent>
            </Select>

            <Button className="font-poppins font-bold">
              Generate Next Round
            </Button>
            {tournament?.status &&
              tournament.status.toString() != "START" &&
              tournament.admin.id === session?.user?.id && (
                <Button
                  className="font-poppins font-bold"
                  onClick={startTournament}
                >
                  Start Tournament
                </Button>
              )}
          </div>
          <TabsDemo />
        </div>
      </div>
    </div>
  );
};

export default Page;

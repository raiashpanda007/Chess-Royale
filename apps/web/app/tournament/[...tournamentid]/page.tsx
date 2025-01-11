"use client";
import { FC, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { Tournament } from "@/types/Tournament";
import axios from "axios";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Button } from "@workspace/ui/components/button";
import CopyButton from "@workspace/ui/components/CopyButton";
const Page: FC = () => {
  const { tournamentid } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [tournament, setTournament] = useState<Tournament>();
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
              <Button variant={"destructive"} className="font-poppins font-bold">
                Delete Tournament
              </Button>
            </div>
          )}
          {loading ? (
            <Skeleton className="h-1/4 w-full rounded-md" />
          ) : (
            <div className="h-1/3 w-full ">
              <p className="flex space-x-2 w-1/2">
                <span className="font-2xl font-semibold mr-2">Tournament ID </span>
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
      <div className="w-full mt-6 flex p-3" style={{ height: "calc(100% - 80px)" }}>
          <div className="h-28 w-1/3 rounded-lg shadow-md p-3 flex justify-center items-center border ">
              <p>{tournament?.slug}</p>
              <CopyButton data={tournament?.slug || ""} />
          </div>
      </div>
    </div>
  );
};

export default Page;

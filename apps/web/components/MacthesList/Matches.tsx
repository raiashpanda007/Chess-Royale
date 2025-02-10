"use client";
import type { User } from "@/types/User";
import { Button } from "@workspace/ui/components/button";
interface Round {
  roundid: string;
  roundNumber: number;
}
import { useSession } from "next-auth/react";
interface MatchesProps {
  id: string;
  player1: User;
  player2: User;
  result: string;
  round: Round;
  time: string;
  AddedTime: string;
}
import { useState, useEffect } from "react";
import { FC } from "react";
import { useRouter } from "next/navigation";

const MatchList: FC<MatchesProps> = ({
  id,
  player1,
  player2,
  result,
  round,
  time,
  AddedTime,
}) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showJoinButton, setShowJoinButton] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<String>(result);
  const url =  `game?id=${session?.user.id}&username=${session?.user.email}&profilePicture=${session?.user.image}&gameId=${id}`;
  useEffect(() => {
    console.log(result);
    if (result === "WINNER1") {
      setShowResult("1-0");
      setShowJoinButton(false);
    } else if (result === "WINNER2") {
      setShowResult("0-1");
      setShowJoinButton(false);
    } else if (result === "DRAW") {
      setShowResult("0.5-0.5");
      setShowJoinButton(false);
    } else {
      setShowResult("0-0");
    }

    if (player1?.id === session?.user.id || player2?.id === session?.user.id) {
      if(result === "NOT_PLAYED")
      setShowJoinButton(true);
    }
  }, [result]);

  return (
    <div className="w-full h-20 flex justify-between items-center border p-2 rounded-2xl cursor-pointer hover:bg-gray-900">
      <div className="flex space-x-3">
        <div className="w-16 h-16 rounded-full items-center justify-center flex">
          <img
            src={player1?.profilePicture?player1.profilePicture : '/user.webp'}
            alt=""
            className="h-14 w-14 rounded-full"
          />
        </div>
        <div className="flex flex-col">
          <h1 className="font-bold">{player1?.username}</h1>
          <p>{player1?.username}</p>
        </div>
      </div>
      <div className="flex flex-col items-center">
        {showJoinButton ? (
          <Button className="font-poppins" variant={"secondary"} onClick={() => router.push(`http://web.chesssroyale.games/${url}`)}>
            Join
          </Button>
        ) : (
          <>
            <h1>{result}</h1>
            <h1>{showResult}</h1>
          </>
        )}
      </div>
      <div className="flex space-x-3">
        <div className="flex flex-col">
          <h1 className="font-bold">{player2?.username}</h1>
          <p>{player2?.username}</p>
        </div>
        <div className="w-16 h-16 rounded-full flex justify-center items-center">
          <img
            src={player2?.profilePicture ? player2.profilePicture : '/user.webp'}
            alt=""
            className="h-14 w-14 rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
export default MatchList;


"use client";
import React from "react";
import { Button } from "@workspace/ui/components/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import PlayRoyale from "./PlayRoyale";
import PlaySolo from "./PlaySolo";
function PlayButton() {
  const router = useRouter();
  const { data: session, status } = useSession();

  return (
    <div className="w-1/2 flex justify-evenly animate-slideInFromBelow opacity-0 ">
      <PlaySolo />
      {status === "authenticated" ? (
        <PlayRoyale/>

      ) : (
        <Button variant={"default"} className="font-poppins font-bold" onClick={() => router.push(`http://web.chesssroyale.games/api/auth/signin`)}>
          Play Royale
        </Button>
      )}
    </div>
  );
}

export default PlayButton;

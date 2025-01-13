
"use client";
import React from "react";
import { Button } from "@workspace/ui/components/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import PlayRoyale from "./PlayRoyale";
function PlayButton() {
  const router = useRouter();
  const { data: session, status } = useSession();

  return (
    <div className="w-1/2 flex justify-evenly animate-slideInFromBelow opacity-0 ">
      <Button
        variant={"secondary"}
        className="font-poppins font-bold"
        onClick={() => router.replace("https://google.com")}
      >
        Play Solo
      </Button>
      {status === "authenticated" ? (
        <PlayRoyale/>

      ) : (
        <Button variant={"default"} className="font-poppins font-bold" onClick={() => router.push('/api/auth/signin')}>
          Play Royale
        </Button>
      )}
    </div>
  );
}

export default PlayButton;

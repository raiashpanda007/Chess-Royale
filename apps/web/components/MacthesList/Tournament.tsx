"use client";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { useEffect, useState } from "react";
import axios from "axios";
import MatchList from "./Matches";
import { User } from "@/types/User";
import { ScrollArea } from "@workspace/ui/components/scroll-area";

import { FC } from "react";
import { Match } from "@/types/Match";
import ScoreCardList from "./ScoreCardList";

interface TabsDemoProps {
  matches: Match[];
  winner: User[] | null;
  tournamentid?: string;
}
interface ScoreCard{
  score: number;
  player:User;
  playerId:string;
}


const TabsDemo: FC<TabsDemoProps> = ({ matches, winner, tournamentid }) => {
  const [scorecard , setScorecard] = useState<ScoreCard[]>([]);
  
 
  useEffect(() => {
    const getScoreCard = async () => {
      if (!tournamentid) return;
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}:3000/api/tournament/fetch/scorecard`,
          
          { headers: { tournamentid } }
        );
        if (response.data.data) {
          console.log(response.data.data);
          setScorecard(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching scorecard:", error);
      }
    };
  
    getScoreCard();
  }, [tournamentid]);
  
  return (
    <Tabs defaultValue="match" className="w-5/6 h-16 font-poppins">
      <TabsList className="grid w-full grid-cols-2 h-16">
        <TabsTrigger value="match" className="h-12 text-2xl font-bold">
          Match
        </TabsTrigger>
        <TabsTrigger value="scorecard" className="h-12 text-2xl font-bold">
          Score Card
        </TabsTrigger>
      </TabsList>
      <TabsContent value="match">
        <ScrollArea className="w-full h-96 overflow-auto">
          {matches ? (
            matches.map((match) => (
              <MatchList
                key={match.id}
                id={match.id}
                player1={match.player1}
                player2={match.player2}
                result={match.result}
                round={{ roundid: "1", roundNumber: 1 }}
                time={match.time.toString()}
                AddedTime={match.AddedTime.toString()}
              />
            ))
          ) : (
            <div>
              <h1>Matches not found</h1>
            </div>
          )}
        </ScrollArea>
      </TabsContent>
      <TabsContent value="scorecard">
        {( !winner) ? (
          <ScrollArea className="w-full  h-96 overflow-auto">
            {
             scorecard ? scorecard?.map((score) => (
                <ScoreCardList
                  key={score.player.id}
                  id={score.playerId}
                  user={score.player}
                  score={score.score}
                />
              )): <h1>Scorecard not found</h1>
            }
          </ScrollArea>
        ) : (
          <div>
            <h1 className="text-2xl font-semibold">Winners are </h1>
            <div className="flex space-x-2">
              {winner.map((user) => (
                <h1 key={user.id}>{user.name}</h1>
              ))}
            </div>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};
export default TabsDemo;


import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import ScoreCardList from "./ScoreCardList";
import MatchList from "./Matches";
import Email from "next-auth/providers/email";
import { ScrollArea } from "@workspace/ui/components/scroll-area";

import { FC } from "react";
import { Match } from "@/types/Match";

interface TabsDemoProps {
  matches: Match[];
}

const TabsDemo: FC<TabsDemoProps> = ({ matches }) => {
  
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
          { matches ? matches.map((match) => (
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
          )):<div> 
            <h1>Matches not found</h1>
            </div>}
        </ScrollArea>
      </TabsContent>
      <TabsContent value="scorecard">
        <ScrollArea className="w-full  h-96 overflow-auto">
          {/* <ScoreCardList id="1" user={user1} score={1} />
          <ScoreCardList id="2" user={user2} score={0} />
          <ScoreCardList id="1" user={user1} score={1} />
          <ScoreCardList id="2" user={user2} score={0} />
          <ScoreCardList id="1" user={user1} score={1} />
          <ScoreCardList id="2" user={user2} score={0} />
          <ScoreCardList id="1" user={user1} score={1} />
          <ScoreCardList id="2" user={user2} score={0} />
          <ScoreCardList id="1" user={user1} score={1} />
          <ScoreCardList id="2" user={user2} score={0} />
          <ScoreCardList id="1" user={user1} score={1} />
          <ScoreCardList id="2" user={user2} score={0} /> */}
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
};
export default TabsDemo;

import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
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

const TabsDemo: FC = () => {
  const user1 = {
    id: "1",
    name: "John Doe",
    email: "ravikantr535@gmail.com",
    username: "johndoe",
  };
  const user2 = {
    id: "2",
    name: "Jane Doe",
    email: "raiashwin@gmail.com",
    username: "janedoe",
  };
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
          <MatchList
            id="1"
            AddedTime="1"
            time="10"
            joiningTime="2"
            player1={user1}
            player2={user2}
            createdAt="2022"
            round={{ roundid: "1", roundNumber: 2 }}
            lastTime="21:00"
            result={"NOT_DECIDED"}
          />
          <MatchList
            id="1"
            AddedTime="1"
            time="10"
            joiningTime="2"
            player1={user1}
            player2={user2}
            createdAt="2022"
            round={{ roundid: "1", roundNumber: 2 }}
            lastTime="21:00"
            result={"NOT_DECIDED"}
          />
          <MatchList
            id="1"
            AddedTime="1"
            time="10"
            joiningTime="2"
            player1={user1}
            player2={user2}
            createdAt="2022"
            round={{ roundid: "1", roundNumber: 2 }}
            lastTime="21:00"
            result={"NOT_DECIDED"}
          />
          <MatchList
            id="1"
            AddedTime="1"
            time="10"
            joiningTime="2"
            player1={user1}
            player2={user2}
            createdAt="2022"
            round={{ roundid: "1", roundNumber: 2 }}
            lastTime="21:00"
            result={"NOT_DECIDED"}
          />
          <MatchList
            id="1"
            AddedTime="1"
            time="10"
            joiningTime="2"
            player1={user1}
            player2={user2}
            createdAt="2022"
            round={{ roundid: "1", roundNumber: 2 }}
            lastTime="21:00"
            result={"NOT_DECIDED"}
          />
          <MatchList
            id="1"
            AddedTime="1"
            time="10"
            joiningTime="2"
            player1={user1}
            player2={user2}
            createdAt="2022"
            round={{ roundid: "1", roundNumber: 2 }}
            lastTime="21:00"
            result={"NOT_DECIDED"}
          />
          <MatchList
            id="1"
            AddedTime="1"
            time="10"
            joiningTime="2"
            player1={user1}
            player2={user2}
            createdAt="2022"
            round={{ roundid: "1", roundNumber: 2 }}
            lastTime="21:00"
            result={"NOT_DECIDED"}
          />
          <MatchList
            id="1"
            AddedTime="1"
            time="10"
            joiningTime="2"
            player1={user1}
            player2={user2}
            createdAt="2022"
            round={{ roundid: "1", roundNumber: 2 }}
            lastTime="21:00"
            result={"NOT_DECIDED"}
          />

          <MatchList
            id="1"
            AddedTime="1"
            time="10"
            joiningTime="2"
            player1={user1}
            player2={user2}
            createdAt="2022"
            round={{ roundid: "1", roundNumber: 2 }}
            lastTime="21:00"
            result={"NOT_DECIDED"}
          />
        </ScrollArea>
      </TabsContent>
      <TabsContent value="scorecard">
        <ScrollArea className="w-full  h-96 overflow-auto">
          <ScoreCardList id="1" user={user1} score={1} />
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
          <ScoreCardList id="2" user={user2} score={0} />
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
};
export default TabsDemo;

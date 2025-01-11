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

import MatchList from "./Matches";
import Email from "next-auth/providers/email";

function TabsDemo() {
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
          status="CREATED"
        />
      </TabsContent>
      <TabsContent value="scorecard">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password here. After saving, you'll be logged out.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="current">Current password</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">New password</Label>
              <Input id="new" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save password</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
export default TabsDemo;

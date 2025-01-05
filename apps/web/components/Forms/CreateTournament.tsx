"use client";
import { FC } from "react";

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
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group";
import { useForm, SubmitHandler } from "react-hook-form";
import Logo from "@workspace/ui/components/Logo";
interface FormValues {
  name: string;
  numberOfPlayers: number;
  logo: File;
  visibility: string;
  time: number;
  addedTime: number;
}
const CreateTournamentForm: FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
  };
  return (
    <Card className="w-1/2 h-1/2">
      <CardHeader className="h-1/4 font-poppins ">
        <CardTitle className="text-2xl ">Create Tournament</CardTitle>
        <CardDescription>
          Enter the details of the tournament you want to create here or can
          join an existing tournament
        </CardDescription>
      </CardHeader>
      <ScrollArea className="h-3/4 w-full ">
        <CardContent>
          <form className="font-poppins" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid w-full items-center gap-4 ">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="tournamentname" className="font-extrabold">
                  Tournament Name
                </Label>
                <Input
                  id="name"
                  placeholder="Name of your Tournament ... "
                  {...register("name")}
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="numberOfPlayers" className="font-bold">
                  Number of Players in tournament
                </Label>
                <Input
                  id="numberOfPlayers"
                  placeholder="Number of players ..."
                  type="number"
                  defaultValue={16}
                  {...register("numberOfPlayers")}
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="logo" className="font-bold">
                  Logo of tournament
                </Label>
                <Input
                  id="logo"
                  placeholder="Name of your project"
                  type="file"
                  {...register("logo")}
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="visibility" className="font-bold">
                  Visibility of your tournament
                </Label>
                <RadioGroup
                  defaultValue="option-one"
                  {...register("visibility")}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="PRIVATE" id="option-one" />
                    <Label htmlFor="option-one">Private</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="PUBLIC" id="option-two" />
                    <Label htmlFor="option-two">Public</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="Time" className="font-bold">
                  <div className="flex">
                    <span>Time</span>
                    <span className="text-xs text-gray-400"> (in minutes)</span>
                  </div>
                </Label>
                <Input
                  id="Time"
                  placeholder="Time for the tournament"
                  type="number"
                  {...register("time")}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="AddedTime" className="font-bold">
                  <div className="flex">
                    <span>Added Time</span>
                    <span className="text-xs text-gray-400"> (in seconds)</span>
                  </div>
                </Label>
                <Input
                  id="AddedTime"
                  placeholder="Added Time for the tournament"
                  type="number"
                  {...register("addedTime")}
                />
              </div>
            </div>
            {/* Add added time option */}
          </form>
        </CardContent>
      </ScrollArea>
      <CardFooter className="flex justify-end">
        <Button className="font-poppins font-extrabold">
          Create Tournament
        </Button>
      </CardFooter>
    </Card>
  );
};
export default CreateTournamentForm;

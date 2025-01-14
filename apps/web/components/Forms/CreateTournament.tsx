"use client"
import { FC, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { RadioGroup, RadioGroupItem } from "@workspace/ui/components/radio-group";
import { useRouter } from "next/navigation";

interface FormValues {
  name: string;
  numberOfPlayers: number;
  logo: FileList;
  visibility: string;
  time: number;
  addedTime: number;
}

const CreateTournamentForm: FC = () => {
  const [visibility, setVisibility] = useState<string>("PRIVATE"); // Local state for visibility
  const router = useRouter();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    // Ensure visibility is part of the form data
    data.visibility = visibility;
    try {
      console.log("Form Data:", data);

      let logoKey = null;
      if (data.logo && data.logo.length > 0 && data.logo[0]?.type) {
        const uploadResponse = await axios.post("/api/upload-file", { key: data.logo[0]?.name });

        if (uploadResponse.data) {
          logoKey = uploadResponse.data.data.key;

          await axios.put(uploadResponse.data.data.url, data.logo[0], {
            headers: { "Content-Type": data.logo[0].type },
          });
        }
      }

      const payload = {
        ...data,
        logo: logoKey,
      };

      const createResponse = await axios.post("/api/tournament/create", payload);

      if (createResponse.status === 200) {
        toast("Tournament created successfully", {
          description: `Tournament ID: ${createResponse.data.data.id}`,
          action: {
            label: "View",
            onClick: () =>
              router.push(`/tournament/${createResponse.data.data.id}`),
          },
        });
      }
    } catch (error) {
      console.error("Error during tournament creation:", error);
      toast("Failed to create tournament", {
        description: "An unexpected error occurred",
        action: { label: "Retry", onClick: () => console.log("Retry clicked") },
      });
    }
  };

  return (
    <Card className="w-full h-2/3 sm:h-1/2 sm:w-1/2">
      <form className="font-poppins h-full" onSubmit={handleSubmit(onSubmit)}>
        <CardHeader className="h-1/4 font-poppins">
          <CardTitle className="text-2xl">Create Tournament</CardTitle>
          <CardDescription>
            Enter the details of the tournament you want to create here or can
            join an existing tournament
          </CardDescription>
        </CardHeader>
        <ScrollArea className="h-3/4 w-full">
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name" className="font-extrabold">
                  Tournament Name
                </Label>
                <Input
                  id="name"
                  placeholder="Name of your Tournament ..."
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
                  defaultValue={16}
                  type="number"
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
                  value={visibility}
                  onValueChange={(value) => {
                    setVisibility(value); // Update local state
                    setValue("visibility", value); // Update react-hook-form state
                  }}
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
                <Label htmlFor="time" className="font-bold">
                  <div className="flex">
                    <span>Time</span>
                    <span className="text-xs text-gray-400"> (in minutes)</span>
                  </div>
                </Label>
                <Input
                  id="time"
                  placeholder="Time for the tournament"
                  {...register("time")}
                  type="number"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="addedTime" className="font-bold">
                  <div className="flex">
                    <span>Added Time</span>
                    <span className="text-xs text-gray-400"> (in seconds)</span>
                  </div>
                </Label>
                <Input
                  id="addedTime"
                  placeholder="Added Time for the tournament"
                  {...register("addedTime")}
                  type="number"
                />
              </div>
            </div>
          </CardContent>
        </ScrollArea>
        <CardFooter className="flex justify-end">
          <Button
            className="font-poppins font-extrabold"
            type="submit"
          >
            Create Tournament
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CreateTournamentForm;

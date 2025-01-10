"use client";
import { FC, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
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
import { set } from "zod";
import response from "@/app/utils/response";
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
  const [error, setError] = useState<any>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const [logoURL, setLogoURL] = useState<string | null>(null);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      // Step 1: Handle Logo Upload
      let logoKey = null;

      if (data.logo && data.logo.length > 0 && data.logo[0]?.type) {
        const uploadResponse = await axios.post(
          "http://localhost:3000/api/upload-file",
          {
            key: data.logo[0]?.name,
          }
        );

        if (uploadResponse.data) {
          console.log("Upload response:", uploadResponse.data);
          logoKey = uploadResponse.data.data.key;

          // Upload file to the provided URL
          await axios.put(uploadResponse.data.data.url, data.logo[0], {
            headers: {
              "Content-Type": data.logo[0].type,
            },
          });
          console.log("Logo uploaded successfully");
        } else {
          throw new Error("Failed to upload logo");
        }
      }

      // Step 2: Prepare Payload
      const payload = {
        name: data.name,
        numberOfPlayers: data.numberOfPlayers,
        logo: logoKey, // Directly use the key
        visibility: data.visibility,
        time: data.time,
        addedTime: data.addedTime,
      };

      // Step 3: Create Tournament
      const createResponse = await axios.post(
        "http://localhost:3000/api/create-tournament",
        payload
      );

      if (createResponse.status === 200) {
        console.log("Tournament created successfully");

        // Trigger the toast here
        toast("Tournament created successfully", {
          description: `Tournament ID: ${createResponse.data.data.id}`,
          className:'font-poppins font-bold text-green-500',
          action: {
            label: "View",
            onClick: () =>
              router.push(`/tournament/${createResponse.data.data.id}`),
          },
        });

        // Navigate to the created tournament's page
        
      }
    } catch (error) {
      setError(error);
      console.error("Error creating tournament:", error);

      // Trigger a toast for the error
      toast("Failed to create tournament", {
        description:  "An unexpected error occurred",
        className:'font-poppins font-bold text-red-500',
        action: {
          label: "Retry",
          
          onClick: () => console.log("Retry clicked"),
        },
      });
    }
  };

  return (
    <Card className="w-full h-2/3 sm:h-1/2 sm:w-1/2">
      <form className="font-poppins h-full" onSubmit={handleSubmit(onSubmit)}>
        <CardHeader className="h-1/4 font-poppins ">
          <CardTitle className="text-2xl ">Create Tournament</CardTitle>
          <CardDescription>
            Enter the details of the tournament you want to create here or can
            join an existing tournament
          </CardDescription>
        </CardHeader>
        <ScrollArea className="h-3/4 w-full ">
          <CardContent>
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
                <RadioGroup defaultValue="PRIVATE" {...register("visibility")}>
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
                  {...register("time")}
                  type="number"
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
                  {...register("addedTime")}
                  type="number"
                />
              </div>
            </div>
            {/* Add added time option */}
          </CardContent>
        </ScrollArea>
        <CardFooter className="flex justify-end">
          <Button
            className="font-poppins font-extrabold"
            type="submit"
            onClick={() => console.log("Create Tournament")}
          >
            Create Tournament
          </Button>
        </CardFooter>
        {error && JSON.stringify(error)}
      </form>
    </Card>
  );
};
export default CreateTournamentForm;

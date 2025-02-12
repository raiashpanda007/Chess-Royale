"use client"
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { FC } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
const PlaySolo: FC = () => {
  const {data: session} = useSession();
  const router = useRouter();
  
  const url =  `game?id=${session?.user.id}&username=${session?.user.email}&profilePicture=${session?.user.image}`;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"secondary"} className="font-poppins font-bold">
          Play Solo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Play Solo </DialogTitle>
          <DialogDescription>Create a multiplayer game</DialogDescription>
        </DialogHeader>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Time"/>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Time </SelectLabel>
              <SelectItem value="10">10 min</SelectItem>
              <SelectItem value="15">15 min</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <DialogFooter>
      <Button type="submit" onClick={()=> router.push(`http://localhost:5173/${url}`)}>Start a solo game</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default PlaySolo;

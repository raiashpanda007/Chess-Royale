"use client"
import React from "react";
import { useEffect,useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Search as SearchIcon } from '@mui/icons-material';
interface TournamentsListProps {
  id: string;
  name: string;
  users: string[];
  logo: string;
  tournamentstatus: string;
  numberOfPlayers: number;
}
interface User {
  id:string
  name:string,
  email:string,
  profilePicture?:string
  username:string
}
 interface Tournament {
  id: string,
  name: string,
  numberOfPlayers: number,
  createdAt: string,
  status: status,
  logo?:string,
  slug:string,
  admin:User,
  users:User[]
}
enum status {
  OPEN,
  FILLED,
  START,
  FINISH
}
interface SearchTournamentsProps {
  tournaments: TournamentsListProps[];
  setTournaments: React.Dispatch<React.SetStateAction<TournamentsListProps[]>>;
}
  
function SearchTournaments({ tournaments, setTournaments }: SearchTournamentsProps) {
  const [search, setSearch] = useState<string>("");
  return (
    <>
      <Input className="w-2/3" placeholder="Enter the tournament name " value={search} onChange={(e) =>setSearch(e.target.value)} />
      <Button variant="default" className="font-poppins font-semibold flex">
         <SearchIcon  />
      </Button>
    </>
  );
}

export default SearchTournaments;

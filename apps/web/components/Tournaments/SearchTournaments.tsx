"use client";
import React from "react";
import { useEffect, useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Search as SearchIcon } from "@mui/icons-material";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  username: string;
}
interface Tournament {
  id: string;
  name: string;
  users: User[];
  logo: string;
  status: string;
  numberOfPlayers: number;
}
enum status {
  OPEN,
  FILLED,
  START,
  FINISH,
}
interface SearchTournamentsProps {
  tournaments: Tournament[];
  setTournaments: React.Dispatch<React.SetStateAction<Tournament[]>>;
}

function SearchTournaments({
  tournaments,
  setTournaments,
}: SearchTournamentsProps) {
  const [search, setSearch] = useState<string>("");
  useEffect(() => {
    const fetchTournaments = async () => {
      if (search === "") {
        try {
          const res = await axios.get(
            "http://localhost:3000/api/tournament/list"
          );
          setTournaments(res.data.data);
        } catch (error) {}
      } else {
        try {
          const res = await axios.post(
            "http://localhost:3000/api/tournament/search",
            { search }
          );
          setTournaments(res.data.data);
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchTournaments();
  }, [search]);
  return (
    <>
      <Input
        className="w-2/3"
        placeholder="Enter the tournament name "
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Button variant="default" className="font-poppins font-semibold flex">
        <SearchIcon />
      </Button>
    </>
  );
}

export default SearchTournaments;

import React from "react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Search as SearchIcon } from '@mui/icons-material';
function SearchTournaments() {
  return (
    <

    >
      <Input className="w-2/3" placeholder="Enter the tournament name " />
      <Button variant="default" className="font-poppins font-semibold flex">
         <SearchIcon  />
      </Button>
    </>
  );
}

export default SearchTournaments;

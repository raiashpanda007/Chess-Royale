import React from "react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import SearchTournaments from "@workspace/ui/components/SearchTournaments" 
function page() {
  return (
    <div className="h-screen w-full font-poppins">
      <div className="relative top-16 w-full h-40 items-center justify-evenly flex ">
        <div className="w-3/6 h-36 flex justify-center items-center">
          <SearchTournaments />
        </div>
        <div className="w-1/4 h-36 flex font-popins justify-evenly items-center border rounded-3xl">
          <Input placeholder="Enter the joining code " className="w-3/5 " />
          <Button variant="outline" className="font-poppins font-semibold">
            Join
          </Button>
        </div>
      </div>
      <div className="relative top-16 w-full flex justify-evenly items-center " style={{height: "calc(100% - 224px)"}}>
          
      </div>
    </div>
  );
}

export default page;

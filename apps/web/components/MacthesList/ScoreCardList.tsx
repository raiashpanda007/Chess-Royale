import React from "react";
import type { User } from "@/types/User";
interface ScoreCardListProps {
  id: string;
  user: User;
  score: number;
}
function ScoreCardList({ id, user, score }: ScoreCardListProps) {
  return (
    <div className="w-full h-28 flex items-center border border-white hover:bg-gray-900 p-2 rounded-2xl cursor-pointer">
      <div className="w-1/2 flex flex-row items-center gap-4">
        {/* Profile Picture */}
        <div className="w-16 h-16 rounded-full flex items-center justify-center">
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt=""
              className="h-14 w-14 rounded-full"
            />
          ) : (
            <div className="h-14 w-14 rounded-full bg-gray-300 flex items-center justify-center">
              {user.name}
            </div>
          )}
        </div>

        {/* Name and Username */}
        <div className="flex flex-col">
          <h1 className="font-bold">{user.name || user.username}</h1>
          <p>{user.username}</p>
        </div>
      </div>

      {/* Score Section */}
      <div className="w-1/2 flex items-center justify-center">
        {score}
      </div>
    </div>
  );
}


export default ScoreCardList;

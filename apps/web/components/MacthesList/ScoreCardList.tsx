import React from "react";
import type { User } from "@/types/User";
interface ScoreCardListProps {
  id: string;
  user: User;
  score: number;
}
function ScoreCardList({ id, user, score }: ScoreCardListProps) {
  return (
    <div className="w-full h-28 flex items-center border border:white hover:bg-gray-900 p-2 rounded-2xl cursor-pointer">
      <div className="w-1/2 flex items-center justify-around">
        <div className="w-16 h-16 rounded-full flex items-center justify-center">
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt=""
              className="h-14 w-14 rounded-full"
            />
          ) : (
            <div className="h-14 w-14 rounded-full bg-gray-300"></div>
          )}
        </div>
        <div>
            <h1 className="font-bold">{user.name}</h1>
            <p>{user.username}</p>
        </div>
      </div>
      <div className="w-1/2 flex items-center justify-center">
        {score}
      </div>
    </div>
  );
}

export default ScoreCardList;

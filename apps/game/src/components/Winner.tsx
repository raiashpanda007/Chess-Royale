"use client";

import { Button } from "@workspace/ui/components/button";
interface User {
  username: string;
  profilePicture: string;
  id: string;
}
interface WinnerAlertProps {
  user: User | null;
  draw: boolean | null;
  method: string | null;
}
import { useNavigate } from "react-router-dom";
function WinnerCard({ user, draw, method }: WinnerAlertProps) {
  const navigate = useNavigate();
  return (
    <div className="text-white text-center">
      <h1>Game Over</h1>
      {draw ? (
        <h2>It's a draw</h2>
      ) : (
        <>
          <h2>{user?.username} won the game</h2>
          <p>{method}</p>
        </>
      )}
      <Button onClick={() => (window.location.href = "http://localhost:3000")}>
        Back to Home
      </Button>
    </div>
  );
}
export default WinnerCard;

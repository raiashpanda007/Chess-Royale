"use client"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert";
import { Button } from "@workspace/ui/components/button";
interface WinnerAlertProps {
  Winner: string;
}
import { useNavigate } from "react-router-dom";
export function WinnerCard({ Winner }: WinnerAlertProps) {
  const navigate = useNavigate();
  return (
    <Alert>
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        {Winner} is the winner of the game
      </AlertDescription>
        <Button onClick={()=>navigate('https://www.google.com')}>Close</Button >
    </Alert>
  );
}

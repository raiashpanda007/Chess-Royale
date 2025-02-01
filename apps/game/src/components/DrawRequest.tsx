import { Button } from "@workspace/ui/components/button";
import { ACCEPT_DRAW, DRAW } from "../types/messagetypes";
interface DrawRequestProps {
    socket: WebSocket | null;
    setDrawRequest:React.Dispatch<React.SetStateAction<boolean>>;
}
const AcceptDrawRequest = async (socket: WebSocket | null, setDrawRequest:React.Dispatch<React.SetStateAction<boolean>>) => {
    if (!socket) return <div>Socket is connected</div>;
    socket.send(
        JSON.stringify({
            type: DRAW,
            payload: ACCEPT_DRAW
        })
    );
    setDrawRequest(false);
}
const DeclineDrawRequest = async ( setDrawRequest:React.Dispatch<React.SetStateAction<boolean>>) => {
    setDrawRequest(false);
}

function DrawRequest({socket, setDrawRequest}:DrawRequestProps) {
  return (
    <div className="text-white text-center">
      <h1 className="text-2xl font-bold">Draw Request</h1>
      <p>A draw has been requested. Do you accept?</p>
      <div className="flex justify-center mt-4">
        <Button variant="destructive" className="mr-2" onClick={()=>DeclineDrawRequest( setDrawRequest)}>
          Decline
        </Button>
        <Button variant={"default"} onClick={()=>AcceptDrawRequest(socket,setDrawRequest)}>Accept</Button>
      </div>
    </div>
  );
}

export default DrawRequest;

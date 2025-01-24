import React from "react";
const Promotion = ({socket }:{
    socket: WebSocket
}) => {
    return (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
            <div>
                <button onClick={()=>socket.send(JSON.stringify({
                    type: "PROMOTION",
                    payload: "q"
                }))} className="text-white bg-white">Queen</button>
                <button onClick={()=>socket.send(JSON.stringify({
                    type: "PROMOTION",
                    payload: "r"
                }))} className="text-white bg-white">Rook</button>
                <button onClick={()=>socket.send(JSON.stringify({
                    type: "PROMOTION",
                    payload: "b"
                }))} className="text-white bg-white">Bishop</button>
                <button onClick={()=>socket.send(JSON.stringify({
                    type: "PROMOTION",
                    payload: "n"
                }))} className="text-white bg-white">Knight</button>
            </div>
        </div>

    )

}
export default Promotion;

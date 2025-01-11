import type { User } from "@/types/User"
interface Round {
    roundid:string
    roundNumber:number
}

interface MatchesProps {
    id:string
    player1:User
    player2:User
    result:string
    createdAt:string
    joiningTime:string
    round:Round
    time:string
    AddedTime:string
    lastTime:string
    status:string
}
const MatchList = ({id,player1,player2,result,createdAt,joiningTime,round,time,AddedTime,status}:MatchesProps) => {
    return (
        <div className="w-full h-20 flex justify-between items-center border p-2 rounded-2xl cursor-pointer">
            <div className="flex space-x-3">
                <div className="w-16 h-16 rounded-full items-center justify-center flex">
                    <img src={player1.profilePicture} alt="" className="h-14 w-14 rounded-full"/>
                </div>
                <div className="flex flex-col">
                    <h1 className="font-bold">{player1.name}</h1>
                    <p>{player1.username}</p>
                </div>
            </div>
            <div className="flex flex-col items-center">
                <h1>{status==="FINISH"?result:status }</h1>
               
            </div>
            <div className="flex space-x-3">
                <div className="flex flex-col">
                    <h1 className="font-bold">{player2.name}</h1>
                    <p>{player2.username}</p>
                </div>
                <div className="w-16 h-16 rounded-full flex justify-center items-center">
                    <img src={player2.profilePicture} alt="" className="h-14 w-14 rounded-full"/>
                </div>
            </div>
        </div>
    )
}
export default MatchList

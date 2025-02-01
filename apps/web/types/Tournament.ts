import type { User } from "./User"
import type { Round } from "./Round"
export interface Tournament {
    id: string,
    name: string,
    numberOfPlayers: number,
    createdAt: string,
    status: status,
    logo?:string,
    slug:string,
    admin:User,
    users:User[],
    round:Round[]
}
enum status {
    OPEN,
    FILLED,
    START,
    FINISH
}
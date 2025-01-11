import type { User } from "./User"
export interface Tournament {
    id: string,
    name: string,
    numberOfPlayers: number,
    createdAt: string,
    status: status,
    logo?:string,
    slug:string,
    admin:User,
    users:User[]
}
enum status {
    OPEN,
    FILLED,
    START,
    FINISH
}
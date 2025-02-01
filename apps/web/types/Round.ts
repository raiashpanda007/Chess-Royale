import type { Match } from "./Match";
export interface Round {
    id:string,
    number:number,
    tournamentId:string,
    matches:Match[],
    
}
export interface User {
    username: string
    profilePicture: string
    id: string
}
export interface Match {
    id: string
    time: number,
    AddedTime: number
    roundId: string|null
}
export interface Move {
    from: string
    to: string
    promotion?: string
}

export interface PairingAlogrithm {
    tournamentID:string,
    adminID: string,

}
export interface Players {
    id:string,
    score:number
    previousOpponents:Set<string>
}
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
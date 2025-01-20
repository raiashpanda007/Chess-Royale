export interface User {
    name: string
    email: string,
    username: string
    profilePicture: string
    id: string
}
export interface Match {
    id: string
    time: string,
    AddedTime: string
    roundId?: string
}
export interface Move {
    from: string
    to: string
    promotion?: string
}
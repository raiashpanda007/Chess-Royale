
export interface Match {
    id:string,
    player1:string,
    player2:string,
    result:Result,
    winner:string,
    roundId:string | null,
    time:number,
    AddedTime:number,

}
enum Result {
    WINNER1="WINNER1",
    WINNER2="WINNER2",
    DRAW="DRAW",
    NOT_PLAYED="NOT_PLAYED",
    PLAYING="PLAYING"

}
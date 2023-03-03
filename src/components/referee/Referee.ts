import { PieceType, TeamType } from "../Chessboard/Chessboard";

export default class Referee{
    isValidMove(px: number, py: number, x: number, y: number, type: PieceType, team: TeamType){
        console.log(type)

        if(type === PieceType.PAWN){
            if(team === TeamType.OUR){
                if(py === 1){
                    if(px === x && (y - py === 1 || y - py === 2)){
                        console.log("Valid Move")
                        return true
                    }
                } else {
                    if(px === x && y - py === 1){
                        return true
                    }
                }
                    
            }
        }

        return false;
    }
}
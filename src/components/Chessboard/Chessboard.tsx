import React, { useEffect, useRef, useState } from "react";
import './Chessboard.css'
import Tile from "../Tile/Tile";
import Referee from "../referee/Referee";

const horizontalAxis = ["a","b","c","d","e","f","g","h"]
const verticalAxis = ["1","2","3","4","5","6","7","8"]

export interface Piece{
    image: string
    x: number
    y: number
    type: PieceType
    team: TeamType
}

export enum TeamType{
    OPPONENT,
    OUR
}

export enum PieceType{
    PAWN,
    BISHOP,
    KNIGHT,
    ROOK,
    QUEEN,
    KING
}

const initialBoardState: Piece[] = [];

for(let p = 0; p < 2; p++){
    const teamType = (p === 0) ? TeamType.OPPONENT : TeamType.OUR
    const type = (teamType === TeamType.OPPONENT) ? "b" : "w";
    const y = (teamType === TeamType.OPPONENT) ? 7 : 0
    
    initialBoardState.push({image: `assets/images/rook_${type}.png`, x:0, y, type: PieceType.ROOK, team: teamType})
    initialBoardState.push({image: `assets/images/rook_${type}.png`, x:7, y, type: PieceType.ROOK, team: teamType})
    initialBoardState.push({image: `assets/images/knight_${type}.png`, x:1, y, type: PieceType.KNIGHT, team: teamType})
    initialBoardState.push({image: `assets/images/knight_${type}.png`, x:6, y, type: PieceType.KNIGHT, team: teamType})
    initialBoardState.push({image: `assets/images/bishop_${type}.png`, x:2, y, type: PieceType.BISHOP, team: teamType})
    initialBoardState.push({image: `assets/images/bishop_${type}.png`, x:5, y, type: PieceType.BISHOP, team: teamType})
    initialBoardState.push({image: `assets/images/king_${type}.png`, x:4, y, type: PieceType.KING, team: teamType})
    initialBoardState.push({image: `assets/images/queen_${type}.png`, x:3, y, type: PieceType.QUEEN, team: teamType})
}
for(let i = 0; i < 8; i++){
    initialBoardState.push({image: "assets/images/pawn_b.png", x:i, y:6, type: PieceType.PAWN, team: TeamType.OPPONENT})
}
for(let i = 0; i < 8; i++){
initialBoardState.push({image: "assets/images/pawn_w.png", x:i, y:1, type: PieceType.PAWN, team: TeamType.OUR})
    }

export default function Chessboard(){
    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null)
    const [gridX, setGridX] = useState(0)
    const [gridY, setGridY] = useState(0)
    const chessboardRef = useRef<HTMLDivElement>(null)
    const [pieces, setPieces] = useState<Piece[]>(initialBoardState)
    const referee = new Referee();
   

    function grabPiece(e: React.MouseEvent){
        const element = e.target as HTMLElement;
        const chessboard = chessboardRef.current;
        if(element.classList.contains("chess-piece") && chessboard){
            setGridX(Math.floor((e.clientX - chessboard.offsetLeft) / 62.5))
            setGridY(Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 500) / 62.5)))

            const x = e.clientX - 30;
            const y = e.clientY - 30;

            element.style.position = "absolute";
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;

            setActivePiece(element)
        } 
    }

    function movePiece(e: React.MouseEvent) {
        const chessboard = chessboardRef.current;
        if(activePiece && chessboard){
            const minX = chessboard.offsetLeft - 20;
            const minY = chessboard.offsetTop - 20;
            const maxX = chessboard.offsetLeft + chessboard.clientWidth - 50;
            const maxY = chessboard.offsetTop + chessboard.clientHeight - 50;
            const x = e.clientX - 30;
            const y = e.clientY -  30;
            activePiece.style.position = "absolute";
            activePiece.style.left = `${x}px`;
            activePiece.style.top = `${y}px`;

            if(x < minX) {
                activePiece.style.left = `${minX}px`
            }   else if(x > maxX) {
                activePiece.style.left = `${maxX}px`
            } else {
                activePiece.style.left = `${x}px`
            }
            if(y < minY) {
                activePiece.style.top = `${minY}px`
            }   else if(y > maxY) {
                activePiece.style.top = `${maxY}px`
            } else {
                activePiece.style.top = `${y}px`
            }

        }
    }

    function dropPiece(e: React.MouseEvent){
        const chessboard = chessboardRef.current;

        if(activePiece && chessboard){
            const x = Math.floor((e.clientX - chessboard.offsetLeft) / 62.5);
            const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 500) / 62.5));

            const currentPiece = pieces.find(p => p.x === gridX && p.y === gridY);
            const attackPiece = pieces.find(p => p.x === x && p.y === y);

            if(currentPiece){
                const validMove = referee.isValidMove(gridX, gridY, x, y, currentPiece.type, currentPiece.team, pieces)

                if(validMove){
                    // Update Piece position
                    const updatedPieces = pieces.reduce((results, piece) => {
                        if(piece.x === currentPiece.x && piece.y === currentPiece.y){
                            piece.x = x
                            piece.y = y
                            results.push(piece)
                        } else if(!(piece.x === x && piece.y === y)){
                            results.push(piece)
                        }
                        return results;
                    }, [] as Piece[]);
                    setPieces(updatedPieces)

                    // setPieces((value) => {
                    //     const pieces = value.reduce((results, piece) => {
                            
                    //         if(piece.x === currentPiece.x && piece.y === currentPiece.y){
                    //             piece.x = x
                    //             piece.y = y
                    //             results.push(piece)
                    //         } else if(!(piece.x === x && piece.y === y)){
                    //             results.push(piece)
                    //         }

                    //         return results
                    //     }, [] as Piece[]);
                    //     return pieces;
                    // })
                } else {
                    activePiece.style.position = "relative";
                    activePiece.style.removeProperty("top")
                    activePiece.style.removeProperty("left")
                }
            }
            setActivePiece(null)
        }
    }

    let board = [];

    for(let j = verticalAxis.length - 1; j >= 0; j--){
        for(let i = 0; i < horizontalAxis.length; i++){
            const number = j + i + 2
            let image = undefined

            pieces.forEach(p => {
                if(p.x === i && p.y === j) {
                    image = p.image
                }
            })
            board.push(<Tile key={`${j},${i}`} image={image} number={number} />)
            
        }
    }
    return (
        <div 
            onMouseUp={e => dropPiece(e)} 
            onMouseMove={e => movePiece(e)} 
            onMouseDown={e => grabPiece(e)} 
            id="chessboard"
            ref={chessboardRef}
        >
            {board}
        </div>
    )
}
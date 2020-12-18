import React, { useState } from 'react';
import './index.css';
// import Board from './board';

interface historyType{
    squares: Array<string>,
    latest_move_index: number,
}

function Status(props: any){
    const [isAscending, setisAscending] = useState(true);
    const history= props.history;
    const stepNumber= props.stepNumber;

    //moves list
    const moves = history.map((step: historyType, move: number) => {
        let latest_move_index = step.latest_move_index;
        let row = Math.floor(latest_move_index / 3) + 1;
        let col = latest_move_index % 3 + 1;
        const desc = move ? 
            'Go to move #' + move + ` (${row}, ${col})` : 
            'Go to game start';
        return (
            <li key={move}>
                <button 
                    className={move === stepNumber ? 'selected-move-item' : ''} 
                    onClick={() => props.onClick(move)}>
                        {desc}
                </button>
            </li>
        );
    })

    //toggles the moves list based on state of isAscending
    if (!isAscending) {
        moves.reverse();
    }

    //status of game
    const current = props.history[stepNumber];
    const result = props.gameStatus(current.squares);
    let winner = result.winner;  
    let status;
    if (winner) {
        status = 'Winner: ' + winner;
    } else if (result.isDraw) {
        status = 'Draw';
    } else {
        status = 'Next player: ' + (props.xIsNext ? 'X' : 'O');
    } 

    return(
        <div>
            <div>{status}</div>
            <button onClick={() => setisAscending(!isAscending)}>
                {isAscending ? 'Descending' : 'Ascending'}
            </button>
            <ol>{moves}</ol>
        </div>
        
    )
}



export default Status;
import React, {useState} from 'react';
import './index.css';
import Board from './board';
import Status from './status';

export default function Game() {
    let [history, sethistory] = useState([{squares: Array(9).fill(null)}]);
    let [stepNumber, setstepNumber] = useState(0);
    let [xIsNext, setxIsNext] = useState(true);
    
    //to handle onclick function when each square is clicked
    function handleClick(i) {
        //create duplicate of variables to create a new state instead of making changes in the existing ones
        let duplicateHistory = history.slice(0, stepNumber + 1);
        const current = duplicateHistory[duplicateHistory.length - 1];
        const squares = current.squares.slice();
        
        //returns when there is a winner or every square is filles
        if (gameStatus(squares).winner || squares[i]) {
            return;
        }

        //taking turns
        squares[i] = xIsNext ? 'X' : 'O';
        sethistory(duplicateHistory.concat([{
            squares: squares,
            latest_move_index: i,
        }]));
        setstepNumber(duplicateHistory.length);
        setxIsNext(!xIsNext);
    }

    //handles onclick function when item from moves list is clicked
    const jumpTo = (step) => {
        setstepNumber(step);
        setxIsNext(step % 2 === 0);
    }

    // const history = history;
    // const stepNumber = stepNumber;
    const current = history[stepNumber];
    const result = gameStatus(current.squares);
    let winLine = result.winLine;   //array of square indices indicating the last move of winner
    
    return (
        <div className="game">
            <div className="game-board">
                <Board
                    squares= {current.squares}
                    onClick= {(i) => {handleClick(i)}}
                    winLine= {winLine} />
            </div>
            <div className="game-info">
                <Status 
                    history= {history}
                    stepNumber= {stepNumber}
                    xIsNext= {xIsNext}
                    onClick= {(move) => {jumpTo(move)}}
                    gameStatus= {gameStatus} />
            </div>
        </div>
    );
}


function gameStatus(squares){
    //possible array for winning game
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    //returns when there is winner
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
                winner: squares[a],
                winLine: lines[i],
                isDraw: false,
            };
        }
    }

    //returns when there is at least one square null 
    for (let i=0; i < squares.length; i++) {
        if (squares[i] == null) {
            return {
                winner: null,
                winLine: null,
                isDraw: false
            };;
        }
    }

    //returns if all squares are filled i.e. when there is draw
    return {
        winner: null,
        winLine: null,
        isDraw: true
    };
}
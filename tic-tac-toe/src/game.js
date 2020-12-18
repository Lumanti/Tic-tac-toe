import React from 'react';
import './index.css';
import Board from './board';
import Status from './status';

export default class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
            isAscending: true,
        }
    }

    //to handle onclick function when each square is clicked
    handleClick(i){
        //create duplicate of variables to create a new state instead of making changes in the existing ones
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        
        //returns when there is a winner or every square is filles
        if (gameStatus(squares).winner || squares[i]) {
            return;
        }

        //taking turns
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                latest_move_index: i,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        })
    }

    //handles onclick function when item from moves list is clicked
    jumpTo(step){
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2 === 0),
        })
    }

    //hanndles onclick function to change the isAscending state 
    handleToggleMoves() {
        this.setState({
            isAscending: !this.state.isAscending,
        });
    }

    render() {
        const history = this.state.history;
        const stepNumber = this.state.stepNumber;
        const current = history[stepNumber];
        const result = gameStatus(current.squares);
        let winLine = result.winLine;   //array of square indices indicating the last move of winner
        
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares= {current.squares}
                        onClick= {(i) => {this.handleClick(i)}}
                        winLine= {winLine} />
                </div>
                <div className="game-info">
                    <Status 
                        history= {history}
                        stepNumber= {stepNumber}
                        xIsNext= {this.state.xIsNext}
                        onClick= {(move) => {this.jumpTo(move)}}
                        gameStatus= {gameStatus} />
                </div>
            </div>
        );
    }
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
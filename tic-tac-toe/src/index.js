import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
    const className = 'square' + (props.highlight ? ' highlighted' : '');
    return(
        <button 
            className={className}
            onClick={props.onClick}>
            {props.value}
        </button>
    ); 
}
  
class Board extends React.Component {  
    renderSquare(i) {
        const winLine = this.props.winLine;
        return (
            <Square 
                key = {i}
                value = {this.props.squares[i]}
                onClick = {() => {this.props.onClick(i);}}
                highlight= {winLine && winLine.includes(i)} />
        );
    }

    render() {
        let board = []
        let rowsize = 3
        //use two loops to render the square board
        for(let i=0; i < 3; i++) {
            let row = []
            for(let j=0; j < 3; j++) {
                row.push(this.renderSquare(rowsize * i + j))
            }
            board.push(<div className="board-row"  key={i}>{row}</div>) 
        }
        return (
            <div>{board}</div> 
        );
    }
}

class Game extends React.Component {
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
        
        //moves list
        const moves = history.map((step, move) => {
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
                        onClick={() => this.jumpTo(move)}>
                            {desc}
                    </button>
                </li>
            );
        })

        //toggles the moves list based on state of isAscending
        const isAscending = this.state.isAscending;
        if (!isAscending) {
            moves.reverse();
        }
        
        //status of game
        const current = history[stepNumber];
        const result = gameStatus(current.squares);
        let winner = result.winner;  
        let winLine = result.winLine;   //array of square indices indicating the last move of winner
        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else if (result.isDraw) {
            status = 'Draw';
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        } 

        return (
        <div className="game">
            <div className="game-board">
                <Board
                    squares= {current.squares}
                    onClick= {(i) => {this.handleClick(i)}}
                    winLine= {winLine} />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <button onClick={() => this.handleToggleMoves()}>
                    {isAscending ? 'Descending' : 'Ascending'}
                </button>
                <ol>{moves}</ol>
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

// ========================================

ReactDOM.render(
<Game />,
document.getElementById('root')
);
  
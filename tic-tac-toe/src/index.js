import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
    return(
        <button 
            className={'square' + (props.highlight ? 'highlighted' : '')}
            // className={'square' + (props.highlight ? 'highlighted' : '')}
            onClick={ 
                props.onClick
            }>
        {props.value}
        </button>
    ); 
}
  
class Board extends React.Component {  
    renderSquare(i) {
        const winLine = this.props.winLine
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

    handleClick(i){
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares).winner || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                latestmove: i,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        })
    }

    jumpTo(step){
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2 === 0),
        })
    }

    handleToggleMoves() {
        this.setState({
            isAscending: !this.state.isAscending,
        });
    }

    render() {
        const history = this.state.history;
        const stepNumber = this.state.stepNumber;
        const current = history[stepNumber];
        const result = calculateWinner(current.squares);
                
        const moves = history.map((step, move) => {
            let latestmove = step.latestmove;
            let row = Math.floor(latestmove / 3) + 1;
            let col = latestmove % 3 + 1;
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

        const isAscending = this.state.isAscending;
        if (!isAscending) {
            moves.reverse();
        }
        
        let winner = result.winner;
        let winLine = result.winLine;
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

function calculateWinner(squares){
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
    for (let i=0; i < squares.length; i++) {
        if (squares[i] == null) {
            return {
                winner: null,
                winLine: null,
                isDraw: false
            };;
        }
    }
    // if all squares are filled
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
  
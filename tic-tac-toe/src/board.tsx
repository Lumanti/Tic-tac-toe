import React from 'react';
import './index.css';
import Square from './square';

interface stateType{
    winLine: (null | Array<number>),
    squares: Array<String>,
    onClick: Function,
}

export default class Board extends React.Component <stateType, {}> {  
    renderSquare(i: number) {
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
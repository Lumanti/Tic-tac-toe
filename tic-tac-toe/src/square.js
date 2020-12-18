import React from 'react';
import './index.css';

export default function Square(props){
    const className = 'square' + (props.highlight ? ' highlighted' : '');
    return(
        <button 
            className={className}
            onClick={props.onClick}>
            {props.value}
        </button>
    ); 
}
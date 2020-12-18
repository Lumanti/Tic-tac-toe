import './index.css';

export default function Square(props: any){
    const className = 'square' + (props.highlight ? ' highlighted' : '');
    return(
        <button 
            className={className}
            onClick={props.onClick}>
            {props.value}
        </button>
    ); 
}
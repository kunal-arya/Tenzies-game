
export default function Die(props) {
    return (
        <div 
            className={`die--face ${props.isHeld ? "selected" : ""}`}
            onClick = {props.clickHandler}
            >
            <div className="die--value">{props.value}</div>
        </div>
    )
}

import React from 'react';
import { DndProvider, useDrop, DragDropContext } from 'react-dnd';
import {ItemTypes} from './Constants';
import Item from './Item';


const Square = (props) => {
    const [{isOver}, drop] = useDrop({
        accept: ItemTypes.BOX,
        drop: (item, monitor) =>{
            const delta = monitor.getDifferenceFromInitialOffset();
            // console.log(delta.x, delta.y)
            props.dropPiece();
        },
        canDrop: (item, monitor) => {
            return props.allowDrop;
        },
        collect: monitor => ({
			isOver: !!monitor.isOver(),
		}),
    })
    let backgroundColor;
    if (props.control === 0) {
        backgroundColor = 'rgb(206, 158, 146)';
    } else {
        backgroundColor = 'rgb(160, 72, 50)';
    }
    if (props.light) {
        backgroundColor = 'rgba(255, 17, 17, 0.562)';
    }
    return (
        <div ref={drop} onClick={() => props.dropOrCancelHilight()} className="square" 
        style={{backgroundColor}} squareid={props.id} key={props.id}>
            {props.children}
        </div>
    )
}

export default Square;
import React from 'react';
import { useDrop } from "react-dnd";
import { ItemTypes } from './Constants';

const Target = (props) => {
    const [{isOver}, drop] = useDrop({
        accept: ItemTypes.BOX,
        drop: (item, monitor) =>{
            const delta = monitor.getDifferenceFromInitialOffset();
            // console.log(delta.x, delta.y)
            props.placeItem();
        },
        collect: monitor => ({
			isOver: !!monitor.isOver(),
		}),
    })
    // console.log(props.droppedItem)
    return (
        <div ref={drop} onMouseMove={(e) => props.mouseMove(e)} className="Target">
            {props.droppedItem?<div className="Item">{props.droppedItem.title}</div>:'target'}
          </div>
    )
}

export default Target;
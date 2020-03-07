
import React from 'react';
import { DndProvider, useDrag, DragDropContext } from 'react-dnd';
import {ItemTypes} from './Constants';
import Item from './Item';


const Piece = (props) => {
    const [{isDragging}, drag] = useDrag({
        item: { type: ItemTypes.BOX },
        collect: monitor => ({
          isDragging: !!monitor.isDragging(),
        }),
        canDrag: (props, monitor) => (props.canDrag),
        begin: () => props.movePiece()
      })
    return (
            <div ref={drag} onClick={() => props.movePiece()} className="piece">
                <i className={props.piece.icon} style={{color: props.piece.color, fontSize: '1.8em'}}></i>
                {/* {props.id} */}
            </div>
    )
}

export default Piece;
import React from 'react';
import { DndProvider, useDrag, DragDropContext } from 'react-dnd';
import {ItemTypes} from './Constants';


const Item = (props) => {
    const [{isDragging}, drag] = useDrag({
        item: { type: ItemTypes.BOX },
        collect: monitor => ({
          isDragging: !!monitor.isDragging(),
        }),
        begin: () => props.selectedItem()
      })
              return <div ref={drag} key={props.item.id}>{props.item.title}</div>
}

export default Item;
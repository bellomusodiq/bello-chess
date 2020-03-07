import React from 'react';
import { DndProvider, useDrag, DragDropContext } from 'react-dnd';
import {ItemTypes} from './Constants';
import Item from './Item';


const Exp = (props) => {
    return (
          <div className="Items">
            {props.items.map(item => {
              return <Item selectedItem={() => props.selectedItem(item.id)} item={item} key={item.id} />
            })}
        </div>
    )
}

export default Exp;
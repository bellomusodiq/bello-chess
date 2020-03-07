import React, { Fragment } from 'react';
import logo from './logo.svg';
import './App.css';
import {
  Icons
} from './ChessIcons';
import HTML5Backend from "react-dnd-html5-backend";
import TouchBackend from 'react-dnd-touch-backend';
import { DndProvider, useDrag } from 'react-dnd';
import { ItemTypes } from './Constants';
import Exp from './Exp';
import Target from './Target';
import Piece from './Piece';
import Square from './Square';

class App extends React.Component {
  state = {
    previousColor: 'rgb(139, 134, 134)',
    turn: 'W', // 'W' or 'B'
    squares: {},
    currentSquare: null,
    pieces: [],
    moves: [],
    whiteKingCanCastleLeft: true,
    whiteKingCanCastleRight: true,
    blackKingCanCastleLeft: true,
    blackKingCanCastleRight: true,
    recentPawnPush: null,
    lightUpSquares: new Set(),
    currentPiece: null,
    forbidingSquaresForBlackKing: new Set(),
    forbidingSquaresForWhiteKing: new Set(),
    items: [
      { title: 'item 1', id: 1 },
      { title: 'item 2', id: 2 },
      { title: 'item 3', id: 3 },
      { title: 'item 4', id: 4 },
      { title: 'item 5', id: 5 },
      { title: 'item 6', id: 6 },
      { title: 'item 7', id: 7 },
      { title: 'item 8', id: 8 },
      { title: 'item 9', id: 9 },
      { title: 'item 10', id: 10 },
      { title: 'item 11', id: 11 },
      { title: 'item 12', id: 12 },
    ],
    selectedItem: null,
  }
  deleteItem = () => {
    let items = this.state.items;
    items = items.filter(el => el.id !== this.state.selectedItem)
    this.setState({ items: items })
  }
  placeItem = () => {
    let { items } = this.state;
    const droppedItem = items.find(el => el.id === this.state.selectedItem)
    items = items.filter(el => el.id !== this.state.selectedItem)
    this.setState({ items: items, droppedItem: droppedItem })
  }
  mouseMove = (e) => {
    // console.log(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
  }
  getLabel = (position) => {
    switch (position) {
      case 0:
        return 'A1'
    }
  }
  myref = React.createRef();
  componentDidMount() {
    function connect() {
      const ws = new WebSocket('ws://localhost:8000/timer/');
      ws.onopen = (e) => {
        console.log(e.type)
      }
      ws.onmessage = (e) => {
        const data = JSON.parse(e.data);
        console.log(e.type);
        console.log(data.counter);
      }
      ws.onclose = (ev => {
        setTimeout(function () {
          connect();
        }, 1000);
      })
    }
    // connect();
    ////////////////////////////
    this.myref.current.style.dragstart = true;
    let squares = [];
    let alpha = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    let originRow = 1;
    let originPosition = [0, 0];
    let alphaControl = 0;
    let control = null;
    for (let i = 0; i < 64; i++) {

      if (control === 0) {
        control = 1
      } else {
        control = 0
      }
      if ((i % 8 === 0) && (i !== 0)) {
        alphaControl = 0;
        originRow = originRow + 1;
        if (control === 0) {
          control = 1
        } else {
          control = 0
        }
      }
      let remainder = (i + 1) % 8;
      if (remainder === 0) {
        remainder = 8;
      }
      originPosition = [originRow, remainder];
      let label = alpha[alphaControl] + (9 - originRow).toString()
      alphaControl = alphaControl + 1;
      // squares.push({control: control, id: i, label: label, coordinates: originPosition})
      squares[originPosition.toString()] = { control: control, id: i, label: label, coordinates: originPosition.toString(), light: false }

    }
    let pieces = new Array(32);
    pieces[0] = { id: 'BR1', alias: 'R', position: 0, coordinates: '1,1', piece: Icons.darkrook };
    pieces[1] = { id: 'BN1', alias: 'N', position: 1, coordinates: '1,2', piece: Icons.darkknight };
    pieces[2] = { id: 'BB1', alias: 'B', position: 2, coordinates: '1,3', piece: Icons.darkbishop };
    pieces[3] = { id: 'BQ', alias: 'Q', position: 3, coordinates: '1,4', piece: Icons.darkqueen };
    pieces[4] = { id: 'BK', alias: 'K', position: 4, coordinates: '1,5', piece: Icons.darkking };
    pieces[5] = { id: 'BB2', alias: 'B', position: 5, coordinates: '1,6', piece: Icons.darkbishop };
    pieces[6] = { id: 'BN2', alias: 'N', position: 6, coordinates: '1,7', piece: Icons.darkknight };
    pieces[7] = { id: 'BR2', alias: 'R', position: 7, coordinates: '1,8', piece: Icons.darkrook };
    pieces[8] = { id: 'BP1', alias: '', position: 8, coordinates: '2,1', piece: Icons.darkpawn };
    pieces[9] = { id: 'BP2', alias: '', position: 9, coordinates: '2,2', piece: Icons.darkpawn };
    pieces[10] = { id: 'BP3', alias: '', position: 10, coordinates: '2,3', piece: Icons.darkpawn };
    pieces[11] = { id: 'BP4', alias: '', position: 11, coordinates: '2,4', piece: Icons.darkpawn };
    pieces[12] = { id: 'BP5', alias: '', position: 12, coordinates: '2,5', piece: Icons.darkpawn };
    pieces[13] = { id: 'BP6', alias: '', position: 13, coordinates: '2,6', piece: Icons.darkpawn };
    pieces[14] = { id: 'BP7', alias: '', position: 14, coordinates: '2,7', piece: Icons.darkpawn };
    pieces[15] = { id: 'BP8', alias: '', position: 15, coordinates: '2,8', piece: Icons.darkpawn };
    pieces[63] = { id: 'WR1', alias: 'R', position: 63, coordinates: '8,8', piece: Icons.lightrook };
    pieces[62] = { id: 'WN1', alias: 'N', position: 62, coordinates: '8,7', piece: Icons.lightknight };
    pieces[61] = { id: 'WB1', alias: 'B', position: 61, coordinates: '8,6', piece: Icons.lightbishop };
    pieces[60] = { id: 'WK', alias: 'K', position: 60, coordinates: '8,5', piece: Icons.lightking };
    pieces[59] = { id: 'WQ', alias: 'Q', position: 59, coordinates: '8,4', piece: Icons.lightqueen };
    pieces[58] = { id: 'WB2', alias: 'B', position: 58, coordinates: '8,3', piece: Icons.lightbishop };
    pieces[57] = { id: 'WN2', alias: 'N', position: 57, coordinates: '8,2', piece: Icons.lightknight };
    pieces[56] = { id: 'WR2', alias: 'R', position: 56, coordinates: '8,1', piece: Icons.lightrook };
    pieces[48] = { id: 'WP1', alias: '', position: 48, coordinates: '7,1', piece: Icons.lightpawn };
    pieces[49] = { id: 'WP2', alias: '', position: 49, coordinates: '7,2', piece: Icons.lightpawn };
    pieces[50] = { id: 'WP3', alias: '', position: 50, coordinates: '7,3', piece: Icons.lightpawn };
    pieces[51] = { id: 'WP4', alias: '', position: 51, coordinates: '7,4', piece: Icons.lightpawn };
    pieces[52] = { id: 'WP5', alias: '', position: 52, coordinates: '7,5', piece: Icons.lightpawn };
    pieces[53] = { id: 'WP6', alias: '', position: 53, coordinates: '7,6', piece: Icons.lightpawn };
    pieces[54] = { id: 'WP7', alias: '', position: 54, coordinates: '7,7', piece: Icons.lightpawn };
    pieces[55] = { id: 'WP8', alias: '', position: 55, coordinates: '7,8', piece: Icons.lightpawn };
    // console.log(squares)
    this.setState({ squares: squares, pieces: pieces });
  }
  forbidingSquares = (checkPieces=null) => {
    let { turn, pieces, squares } = this.state;
    if (checkPieces) {
      pieces = checkPieces;
    }
    let forbidingSquaresForBlackKing = new Set();
    let forbidingSquaresForWhiteKing = new Set();
    // squares attacked/deffended by all white pieces
    pieces.forEach(piece => {

      if (piece.alias === 'B') {
        if (piece.id[0] === 'W') {
          let currentSquare = squares[piece.coordinates]; // original position of bishop
          let bottomRightSquares = currentSquare; // other bottomright squares bishop can move to
          let bottomLeftSquares = currentSquare; // other bottomleft squares bishop can move to
          let topRightSquares = currentSquare; // other topright squares bishop can move to
          let topLeftSquares = currentSquare; // other topleft squares bishop can move to
          // bottom right squares
          let bottomRight = bottomRightSquares.coordinates.split(',');
          let bottomLeft = bottomLeftSquares.coordinates.split(',');
          let topRight = topRightSquares.coordinates.split(',');
          let topLeft = topLeftSquares.coordinates.split(',');
          let bottomRightObstruction = 0;
          let bottomLeftObstruction = 0;
          let topRightObstruction = 0;
          let topLeftObstruction = 0;
          bottomRight = bottomRight.map(el => parseInt(el));
          bottomLeft = bottomLeft.map(el => parseInt(el));
          topRight = topRight.map(el => parseInt(el));
          topLeft = topLeft.map(el => parseInt(el));
          // go through all squares the bishop can likely access on bottom right
          while (((bottomRight[0] <= 8) && (bottomRight[1] <= 8))
            || ((bottomLeft[0] <= 8) && (bottomLeft[1] >= 1))
            || ((topRight[0] >= 1) && (topRight[1] <= 8))
            || ((topLeft[0] >= 1) && (topLeft[1] >= 1))) {
            let bottomRightCoordinates = bottomRight[0] + ',' + bottomRight[1];
            let bottomLeftCoordinates = bottomLeft[0] + ',' + bottomLeft[1];
            let topRightCoordinates = topRight[0] + ',' + topRight[1];
            let topLeftCoordinates = topLeft[0] + ',' + topLeft[1];

            if (bottomRightCoordinates !== currentSquare.coordinates) {
              if (bottomRightObstruction === 0 && squares[bottomRightSquares]) {
                forbidingSquaresForBlackKing.add(bottomRightCoordinates)
              }
              if (squares[bottomRightCoordinates]) {
                if (pieces[squares[bottomRightCoordinates].id]) {
                  bottomRightObstruction = 1;
                }
              }
            }

            if (bottomLeftCoordinates !== currentSquare.coordinates) {
              if (bottomLeftObstruction === 0 && squares[bottomLeftSquares]) {
                forbidingSquaresForBlackKing.add(bottomLeftCoordinates)
              }
              if (squares[bottomLeftCoordinates]) {
                if (pieces[squares[bottomLeftCoordinates].id]) {
                  bottomLeftObstruction = 1;
                }
              }
            }

            if (topRightCoordinates !== currentSquare.coordinates) {
              if (topRightObstruction === 0 && squares[topRightSquares]) {
                forbidingSquaresForBlackKing.add(topRightCoordinates)
              }
              if (squares[topRightCoordinates]) {
                if (pieces[squares[topRightCoordinates].id]) {
                  topRightObstruction = 1;
                }
              }
            }

            if (topLeftCoordinates !== currentSquare.coordinates) {
              if (topLeftObstruction === 0 && squares[topLeftSquares]) {
                forbidingSquaresForBlackKing.add(topLeftCoordinates)
              }
              if (squares[topLeftCoordinates]) {
                if (pieces[squares[topLeftCoordinates].id]) {
                  topLeftObstruction = 1;
                }
              }
            }

            bottomRightSquares = (bottomRight[0] + 1) + ',' + (bottomRight[1] + 1);
            bottomLeftSquares = (bottomLeft[0] + 1) + ',' + (bottomLeft[1] - 1);
            topRightSquares = (topRight[0] - 1) + ',' + (topRight[1] + 1);
            topLeftSquares = (topLeft[0] - 1) + ',' + (topLeft[1] - 1);

            bottomRight[0] = bottomRight[0] + 1;
            bottomRight[1] = bottomRight[1] + 1;
            bottomLeft[0] = bottomLeft[0] + 1;
            bottomLeft[1] = bottomLeft[1] - 1;
            topRight[0] = topRight[0] - 1;
            topRight[1] = topRight[1] + 1;
            topLeft[0] = topLeft[0] - 1;
            topLeft[1] = topLeft[1] - 1;
          }
        }
        if (piece.id[0] === 'B') {
          let currentSquare = squares[piece.coordinates]; // original position of bishop
          let bottomRightSquares = currentSquare; // other bottomright squares bishop can move to
          let bottomLeftSquares = currentSquare; // other bottomleft squares bishop can move to
          let topRightSquares = currentSquare; // other topright squares bishop can move to
          let topLeftSquares = currentSquare; // other topleft squares bishop can move to
          // bottom right squares
          let bottomRight = bottomRightSquares.coordinates.split(',');
          let bottomLeft = bottomLeftSquares.coordinates.split(',');
          let topRight = topRightSquares.coordinates.split(',');
          let topLeft = topLeftSquares.coordinates.split(',');
          let bottomRightObstruction = 0;
          let bottomLeftObstruction = 0;
          let topRightObstruction = 0;
          let topLeftObstruction = 0;
          bottomRight = bottomRight.map(el => parseInt(el));
          bottomLeft = bottomLeft.map(el => parseInt(el));
          topRight = topRight.map(el => parseInt(el));
          topLeft = topLeft.map(el => parseInt(el));
          // go through all squares the bishop can likely access on bottom right
          while (((bottomRight[0] <= 8) && (bottomRight[1] <= 8))
            || ((bottomLeft[0] <= 8) && (bottomLeft[1] >= 1))
            || ((topRight[0] >= 1) && (topRight[1] <= 8))
            || ((topLeft[0] >= 1) && (topLeft[1] >= 1))) {

            let bottomRightCoordinates = bottomRight[0] + ',' + bottomRight[1];
            let bottomLeftCoordinates = bottomLeft[0] + ',' + bottomLeft[1];
            let topRightCoordinates = topRight[0] + ',' + topRight[1];
            let topLeftCoordinates = topLeft[0] + ',' + topLeft[1];

            if (bottomRightCoordinates !== currentSquare.coordinates) {
              if (bottomRightObstruction === 0 && squares[bottomRightSquares]) {
                forbidingSquaresForWhiteKing.add(bottomRightCoordinates)
              }
              if (squares[bottomRightCoordinates]) {
                if (pieces[squares[bottomRightCoordinates].id]) {
                  bottomRightObstruction = 1;
                }
              }
            }

            if (bottomLeftCoordinates !== currentSquare.coordinates) {
              if (bottomLeftObstruction === 0 && squares[bottomLeftSquares]) {
                forbidingSquaresForWhiteKing.add(bottomLeftCoordinates)
              }
              if (squares[bottomLeftCoordinates]) {
                if (pieces[squares[bottomLeftCoordinates].id]) {
                  bottomLeftObstruction = 1;
                }
              }
            }

            if (topRightCoordinates !== currentSquare.coordinates) {
              if (topRightObstruction === 0 && squares[topRightSquares]) {
                forbidingSquaresForWhiteKing.add(topRightCoordinates)
              }
              if (squares[topRightCoordinates]) {
                if (pieces[squares[topRightCoordinates].id]) {
                  topRightObstruction = 1;
                }
              }
            }

            if (topLeftCoordinates !== currentSquare.coordinates) {
              if (topLeftObstruction === 0 && squares[topLeftSquares]) {
                forbidingSquaresForWhiteKing.add(topLeftCoordinates)
              }
              if (squares[topLeftCoordinates]) {
                if (pieces[squares[topLeftCoordinates].id]) {
                  topLeftObstruction = 1;
                }
              }
            }

            bottomRightSquares = (bottomRight[0] + 1) + ',' + (bottomRight[1] + 1);
            bottomLeftSquares = (bottomLeft[0] + 1) + ',' + (bottomLeft[1] - 1);
            topRightSquares = (topRight[0] - 1) + ',' + (topRight[1] + 1);
            topLeftSquares = (topLeft[0] - 1) + ',' + (topLeft[1] - 1);

            bottomRight[0] = bottomRight[0] + 1;
            bottomRight[1] = bottomRight[1] + 1;
            bottomLeft[0] = bottomLeft[0] + 1;
            bottomLeft[1] = bottomLeft[1] - 1;
            topRight[0] = topRight[0] - 1;
            topRight[1] = topRight[1] + 1;
            topLeft[0] = topLeft[0] - 1;
            topLeft[1] = topLeft[1] - 1;
          }
        }
      }

      if (piece.alias === 'R') {
        if (piece.id[0] === 'W') {
          let currentSquare = squares[piece.coordinates];
          let topSquares = currentSquare.coordinates;
          let bottomSquares = currentSquare.coordinates;
          let leftSquares = currentSquare.coordinates;
          let rightSquares = currentSquare.coordinates;

          let top = topSquares.split(',');
          let bottom = bottomSquares.split(',');
          let left = leftSquares.split(',');
          let right = rightSquares.split(',');

          top = top.map(el => parseInt(el));
          bottom = bottom.map(el => parseInt(el));
          left = left.map(el => parseInt(el));
          right = right.map(el => parseInt(el));

          let topObstruction = 0;
          let rightObstruction = 0;
          let bottomObstruction = 0;
          let leftObstruction = 0;

          while ((top[0] >= 1) || (bottom[0] <= 8) || (left[1] >= 1) || (right[1] <= 8)) {
            if (currentSquare.coordinates !== topSquares) {
              if (topObstruction === 0 && squares[topSquares]) {
                forbidingSquaresForBlackKing.add(topSquares);
              }
              if (squares[topSquares] && pieces[squares[topSquares].id]) {
                topObstruction = 1;
              }
            }

            if (currentSquare.coordinates !== bottomSquares) {
              if (bottomObstruction === 0 && squares[bottomSquares]) {
                forbidingSquaresForBlackKing.add(bottomSquares);
              }
              if (squares[bottomSquares] && pieces[squares[bottomSquares].id]) {
                bottomObstruction = 1;
              }
            }

            if (currentSquare.coordinates !== leftSquares) {
              if (leftObstruction === 0 && squares[leftSquares]) {
                forbidingSquaresForBlackKing.add(leftSquares);
              }
              if (squares[leftSquares] && pieces[squares[leftSquares].id]) {
                leftObstruction = 1;
              }
            }

            if (currentSquare.coordinates !== rightSquares) {
              if (rightObstruction === 0 && squares[rightSquares]) {
                forbidingSquaresForBlackKing.add(rightSquares);
              }
              if (squares[rightSquares] && pieces[squares[rightSquares].id]) {
                rightObstruction = 1;
              }
            }

            topSquares = (top[0] - 1) + ',' + top[1];
            bottomSquares = (bottom[0] + 1) + ',' + bottom[1];
            leftSquares = left[0] + ',' + (left[1] - 1);
            rightSquares = right[0] + ',' + (right[1] + 1);
            top[0] = top[0] - 1;
            bottom[0] = bottom[0] + 1;
            left[1] = left[1] - 1;
            right[1] = right[1] + 1;
          }
        }

        if (piece.id[0] === 'B') {
          let currentSquare = squares[piece.coordinates];
          let topSquares = currentSquare.coordinates;
          let bottomSquares = currentSquare.coordinates;
          let leftSquares = currentSquare.coordinates;
          let rightSquares = currentSquare.coordinates;

          let top = topSquares.split(',');
          let bottom = bottomSquares.split(',');
          let left = leftSquares.split(',');
          let right = rightSquares.split(',');

          top = top.map(el => parseInt(el));
          bottom = bottom.map(el => parseInt(el));
          left = left.map(el => parseInt(el));
          right = right.map(el => parseInt(el));

          let topObstruction = 0;
          let rightObstruction = 0;
          let bottomObstruction = 0;
          let leftObstruction = 0;

          while ((top[0] >= 1) || (bottom[0] <= 8) || (left[1] >= 1) || (right[1] <= 8)) {
            if (currentSquare.coordinates !== topSquares) {
              if (topObstruction === 0 && squares[topSquares]) {
                forbidingSquaresForWhiteKing.add(topSquares);
              }
              if (squares[topSquares] && pieces[squares[topSquares].id]) {
                topObstruction = 1;
              }
            }

            if (currentSquare.coordinates !== bottomSquares) {
              if (bottomObstruction === 0 && squares[bottomSquares]) {
                forbidingSquaresForWhiteKing.add(bottomSquares);
              }
              if (squares[bottomSquares] && pieces[squares[bottomSquares].id]) {
                bottomObstruction = 1;
              }
            }

            if (currentSquare.coordinates !== leftSquares) {
              if (leftObstruction === 0 && squares[leftSquares]) {
                forbidingSquaresForWhiteKing.add(leftSquares);
              }
              if (squares[leftSquares] && pieces[squares[leftSquares].id]) {
                leftObstruction = 1;
              }
            }

            if (currentSquare.coordinates !== rightSquares) {
              if (rightObstruction === 0 && squares[rightSquares]) {
                forbidingSquaresForWhiteKing.add(rightSquares);
              }
              if (squares[rightSquares] && pieces[squares[rightSquares].id]) {
                rightObstruction = 1;
              }
            }

            topSquares = (top[0] - 1) + ',' + top[1];
            bottomSquares = (bottom[0] + 1) + ',' + bottom[1];
            leftSquares = left[0] + ',' + (left[1] - 1);
            rightSquares = right[0] + ',' + (right[1] + 1);
            top[0] = top[0] - 1;
            bottom[0] = bottom[0] + 1;
            left[1] = left[1] - 1;
            right[1] = right[1] + 1;
          }
        }
      }

      if (piece.alias === 'Q') {
        if (piece.id[0] === 'W') {
          let currentSquare = squares[piece.coordinates]; // original position of bishop
          let bottomRightSquares = currentSquare; // other bottomright squares bishop can move to
          let bottomLeftSquares = currentSquare; // other bottomleft squares bishop can move to
          let topRightSquares = currentSquare; // other topright squares bishop can move to
          let topLeftSquares = currentSquare; // other topleft squares bishop can move to
          let topSquares = currentSquare.coordinates;
          let bottomSquares = currentSquare.coordinates;
          let leftSquares = currentSquare.coordinates;
          let rightSquares = currentSquare.coordinates;

          let bottomRight = bottomRightSquares.coordinates.split(',');
          let bottomLeft = bottomLeftSquares.coordinates.split(',');
          let topRight = topRightSquares.coordinates.split(',');
          let topLeft = topLeftSquares.coordinates.split(',');
          let bottomRightObstruction = 0;
          let bottomLeftObstruction = 0;
          let topRightObstruction = 0;
          let topLeftObstruction = 0;

          bottomRight = bottomRight.map(el => parseInt(el));
          bottomLeft = bottomLeft.map(el => parseInt(el));
          topRight = topRight.map(el => parseInt(el));
          topLeft = topLeft.map(el => parseInt(el));
          let top = topSquares.split(',');
          let bottom = bottomSquares.split(',');
          let left = leftSquares.split(',');
          let right = rightSquares.split(',');

          top = top.map(el => parseInt(el));
          bottom = bottom.map(el => parseInt(el));
          left = left.map(el => parseInt(el));
          right = right.map(el => parseInt(el));

          let topObstruction = 0;
          let rightObstruction = 0;
          let bottomObstruction = 0;
          let leftObstruction = 0;

          while (((bottomRight[0] <= 8) && (bottomRight[1] <= 8))
            || ((bottomLeft[0] <= 8) && (bottomLeft[1] >= 1))
            || ((topRight[0] >= 1) && (topRight[1] <= 8))
            || ((topLeft[0] >= 1) && (topLeft[1] >= 1))
            || (top[0] >= 1) || (bottom[0] <= 8) || (left[1] >= 1) || (right[1] <= 8)) {
            let bottomRightCoordinates = bottomRight[0] + ',' + bottomRight[1];
            let bottomLeftCoordinates = bottomLeft[0] + ',' + bottomLeft[1];
            let topRightCoordinates = topRight[0] + ',' + topRight[1];
            let topLeftCoordinates = topLeft[0] + ',' + topLeft[1];

            if (bottomRightCoordinates !== currentSquare.coordinates) {
              if (bottomRightObstruction === 0 && squares[bottomRightSquares]) {
                forbidingSquaresForBlackKing.add(bottomRightCoordinates)
              }
              if (squares[bottomRightCoordinates]) {
                if (pieces[squares[bottomRightCoordinates].id]) {
                  bottomRightObstruction = 1;
                }
              }
            }

            if (bottomLeftCoordinates !== currentSquare.coordinates) {
              if (bottomLeftObstruction === 0 && squares[bottomLeftSquares]) {
                forbidingSquaresForBlackKing.add(bottomLeftCoordinates)
              }
              if (squares[bottomLeftCoordinates]) {
                if (pieces[squares[bottomLeftCoordinates].id]) {
                  bottomLeftObstruction = 1;
                }
              }
            }

            if (topRightCoordinates !== currentSquare.coordinates) {
              if (topRightObstruction === 0 && squares[topRightSquares]) {
                forbidingSquaresForBlackKing.add(topRightCoordinates)
              }
              if (squares[topRightCoordinates]) {
                if (pieces[squares[topRightCoordinates].id]) {
                  topRightObstruction = 1;
                }
              }
            }

            if (topLeftCoordinates !== currentSquare.coordinates) {
              if (topLeftObstruction === 0 && squares[topLeftSquares]) {
                forbidingSquaresForBlackKing.add(topLeftCoordinates)
              }
              if (squares[topLeftCoordinates]) {
                if (pieces[squares[topLeftCoordinates].id]) {
                  topLeftObstruction = 1;
                }
              }
            }

            if (currentSquare.coordinates !== topSquares) {
              if (topObstruction === 0 && squares[topSquares]) {
                forbidingSquaresForBlackKing.add(topSquares);
              }
              if (squares[topSquares] && pieces[squares[topSquares].id]) {
                topObstruction = 1;
              }
            }

            if (currentSquare.coordinates !== bottomSquares) {
              if (bottomObstruction === 0 && squares[bottomSquares]) {
                forbidingSquaresForBlackKing.add(bottomSquares);
              }
              if (squares[bottomSquares] && pieces[squares[bottomSquares].id]) {
                bottomObstruction = 1;
              }
            }

            if (currentSquare.coordinates !== leftSquares) {
              if (leftObstruction === 0 && squares[leftSquares]) {
                forbidingSquaresForBlackKing.add(leftSquares);
              }
              if (squares[leftSquares] && pieces[squares[leftSquares].id]) {
                leftObstruction = 1;
              }
            }

            if (currentSquare.coordinates !== rightSquares) {
              if (rightObstruction === 0 && squares[rightSquares]) {
                forbidingSquaresForBlackKing.add(rightSquares);
              }
              if (squares[rightSquares] && pieces[squares[rightSquares].id]) {
                rightObstruction = 1;
              }
            }

            bottomRightSquares = (bottomRight[0] + 1) + ',' + (bottomRight[1] + 1);
            bottomLeftSquares = (bottomLeft[0] + 1) + ',' + (bottomLeft[1] - 1);
            topRightSquares = (topRight[0] - 1) + ',' + (topRight[1] + 1);
            topLeftSquares = (topLeft[0] - 1) + ',' + (topLeft[1] - 1);
            bottomRight[0] = bottomRight[0] + 1;
            bottomRight[1] = bottomRight[1] + 1;
            bottomLeft[0] = bottomLeft[0] + 1;
            bottomLeft[1] = bottomLeft[1] - 1;
            topRight[0] = topRight[0] - 1;
            topRight[1] = topRight[1] + 1;
            topLeft[0] = topLeft[0] - 1;
            topLeft[1] = topLeft[1] - 1;

            topSquares = (top[0] - 1) + ',' + top[1];
            bottomSquares = (bottom[0] + 1) + ',' + bottom[1];
            leftSquares = left[0] + ',' + (left[1] - 1);
            rightSquares = right[0] + ',' + (right[1] + 1);
            top[0] = top[0] - 1;
            bottom[0] = bottom[0] + 1;
            left[1] = left[1] - 1;
            right[1] = right[1] + 1;
          }
        }
        if (piece.id[0] === 'B') {
          let currentSquare = squares[piece.coordinates]; // original position of bishop
          let bottomRightSquares = currentSquare; // other bottomright squares bishop can move to
          let bottomLeftSquares = currentSquare; // other bottomleft squares bishop can move to
          let topRightSquares = currentSquare; // other topright squares bishop can move to
          let topLeftSquares = currentSquare; // other topleft squares bishop can move to
          let topSquares = currentSquare.coordinates;
          let bottomSquares = currentSquare.coordinates;
          let leftSquares = currentSquare.coordinates;
          let rightSquares = currentSquare.coordinates;

          let bottomRight = bottomRightSquares.coordinates.split(',');
          let bottomLeft = bottomLeftSquares.coordinates.split(',');
          let topRight = topRightSquares.coordinates.split(',');
          let topLeft = topLeftSquares.coordinates.split(',');
          let bottomRightObstruction = 0;
          let bottomLeftObstruction = 0;
          let topRightObstruction = 0;
          let topLeftObstruction = 0;

          bottomRight = bottomRight.map(el => parseInt(el));
          bottomLeft = bottomLeft.map(el => parseInt(el));
          topRight = topRight.map(el => parseInt(el));
          topLeft = topLeft.map(el => parseInt(el));
          let top = topSquares.split(',');
          let bottom = bottomSquares.split(',');
          let left = leftSquares.split(',');
          let right = rightSquares.split(',');

          top = top.map(el => parseInt(el));
          bottom = bottom.map(el => parseInt(el));
          left = left.map(el => parseInt(el));
          right = right.map(el => parseInt(el));

          let topObstruction = 0;
          let rightObstruction = 0;
          let bottomObstruction = 0;
          let leftObstruction = 0;

          while (((bottomRight[0] <= 8) && (bottomRight[1] <= 8))
            || ((bottomLeft[0] <= 8) && (bottomLeft[1] >= 1))
            || ((topRight[0] >= 1) && (topRight[1] <= 8))
            || ((topLeft[0] >= 1) && (topLeft[1] >= 1))
            || (top[0] >= 1) || (bottom[0] <= 8) || (left[1] >= 1) || (right[1] <= 8)) {
            let bottomRightCoordinates = bottomRight[0] + ',' + bottomRight[1];
            let bottomLeftCoordinates = bottomLeft[0] + ',' + bottomLeft[1];
            let topRightCoordinates = topRight[0] + ',' + topRight[1];
            let topLeftCoordinates = topLeft[0] + ',' + topLeft[1];

            if (bottomRightCoordinates !== currentSquare.coordinates) {
              if (bottomRightObstruction === 0 && squares[bottomRightSquares]) {
                forbidingSquaresForWhiteKing.add(bottomRightCoordinates)
              }
              if (squares[bottomRightCoordinates]) {
                if (pieces[squares[bottomRightCoordinates].id]) {
                  bottomRightObstruction = 1;
                }
              }
            }

            if (bottomLeftCoordinates !== currentSquare.coordinates) {
              if (bottomLeftObstruction === 0 && squares[bottomLeftSquares]) {
                forbidingSquaresForWhiteKing.add(bottomLeftCoordinates)
              }
              if (squares[bottomLeftCoordinates]) {
                if (pieces[squares[bottomLeftCoordinates].id]) {
                  bottomLeftObstruction = 1;
                }
              }
            }

            if (topRightCoordinates !== currentSquare.coordinates) {
              if (topRightObstruction === 0 && squares[topRightSquares]) {
                forbidingSquaresForWhiteKing.add(topRightCoordinates)
              }
              if (squares[topRightCoordinates]) {
                if (pieces[squares[topRightCoordinates].id]) {
                  topRightObstruction = 1;
                }
              }
            }

            if (topLeftCoordinates !== currentSquare.coordinates) {
              if (topLeftObstruction === 0 && squares[topLeftSquares]) {
                forbidingSquaresForWhiteKing.add(topLeftCoordinates)
              }
              if (squares[topLeftCoordinates]) {
                if (pieces[squares[topLeftCoordinates].id]) {
                  topLeftObstruction = 1;
                }
              }
            }

            if (currentSquare.coordinates !== topSquares) {
              if (topObstruction === 0 && squares[topSquares]) {
                forbidingSquaresForWhiteKing.add(topSquares);
              }
              if (squares[topSquares] && pieces[squares[topSquares].id]) {
                topObstruction = 1;
              }
            }

            if (currentSquare.coordinates !== bottomSquares) {
              if (bottomObstruction === 0 && squares[bottomSquares]) {
                forbidingSquaresForWhiteKing.add(bottomSquares);
              }
              if (squares[bottomSquares] && pieces[squares[bottomSquares].id]) {
                bottomObstruction = 1;
              }
            }

            if (currentSquare.coordinates !== leftSquares) {
              if (leftObstruction === 0 && squares[leftSquares]) {
                forbidingSquaresForWhiteKing.add(leftSquares);
              }
              if (squares[leftSquares] && pieces[squares[leftSquares].id]) {
                leftObstruction = 1;
              }
            }

            if (currentSquare.coordinates !== rightSquares) {
              if (rightObstruction === 0 && squares[rightSquares]) {
                forbidingSquaresForWhiteKing.add(rightSquares);
              }
              if (squares[rightSquares] && pieces[squares[rightSquares].id]) {
                rightObstruction = 1;
              }
            }

            bottomRightSquares = (bottomRight[0] + 1) + ',' + (bottomRight[1] + 1);
            bottomLeftSquares = (bottomLeft[0] + 1) + ',' + (bottomLeft[1] - 1);
            topRightSquares = (topRight[0] - 1) + ',' + (topRight[1] + 1);
            topLeftSquares = (topLeft[0] - 1) + ',' + (topLeft[1] - 1);
            bottomRight[0] = bottomRight[0] + 1;
            bottomRight[1] = bottomRight[1] + 1;
            bottomLeft[0] = bottomLeft[0] + 1;
            bottomLeft[1] = bottomLeft[1] - 1;
            topRight[0] = topRight[0] - 1;
            topRight[1] = topRight[1] + 1;
            topLeft[0] = topLeft[0] - 1;
            topLeft[1] = topLeft[1] - 1;

            topSquares = (top[0] - 1) + ',' + top[1];
            bottomSquares = (bottom[0] + 1) + ',' + bottom[1];
            leftSquares = left[0] + ',' + (left[1] - 1);
            rightSquares = right[0] + ',' + (right[1] + 1);
            top[0] = top[0] - 1;
            bottom[0] = bottom[0] + 1;
            left[1] = left[1] - 1;
            right[1] = right[1] + 1;
          }
        }
      }

      if (piece.alias === 'N') {
        if (piece.id[0] === 'W') {
          let currentSquare = squares[piece.coordinates];
          let up = currentSquare.coordinates.split(',').map(el => parseInt(el));
          let down = currentSquare.coordinates.split(',').map(el => parseInt(el));
          let left = currentSquare.coordinates.split(',').map(el => parseInt(el));
          let right = currentSquare.coordinates.split(',').map(el => parseInt(el));

          for (let i = 0; i < 3; i++) {
            let upleft;
            let upright;
            let leftup;
            let leftdown;
            let rightup;
            let rightdown;
            let downright;
            let downleft;
            if (i === 2) {
              upleft = up[1] - 1;
              upright = up[1] + 1;
              downleft = down[1] - 1;
              downright = down[1] + 1;
              leftup = left[0] - 1;
              leftdown = left[0] + 1;
              rightup = right[0] - 1;
              rightdown = right[0] + 1;
              if ((upleft >= 1) && (upleft <= 8) && (up[0] >= 1) && (up[0] <= 8)) {
                forbidingSquaresForBlackKing.add(up[0] + ',' + upleft);
              }
              if ((upright >= 1) && (upright <= 8) && (up[0] >= 1) && (up[0] <= 8)) {
                forbidingSquaresForBlackKing.add(up[0] + ',' + upright);
              }
              if ((downleft >= 1) && (downleft <= 8) && (down[0] >= 1) && (down[0] <= 8)) {
                forbidingSquaresForBlackKing.add(down[0] + ',' + downleft);
              }
              if ((downright >= 1) && (downright <= 8) && (down[0] >= 1) && (down[0] <= 8)) {
                forbidingSquaresForBlackKing.add(down[0] + ',' + downright);
              }
              if ((leftup >= 1) && (leftup <= 8) && (left[1] >= 1) && (left[1] <= 8)) {
                forbidingSquaresForBlackKing.add(leftup + ',' + left[1]);
              }
              if ((leftdown >= 1) && (leftdown <= 8) && (left[1] >= 1) && (left[1] <= 8)) {
                forbidingSquaresForBlackKing.add(leftdown + ',' + left[1]);
              }
              if ((rightup >= 1) && (rightup <= 8) && (right[1] >= 1) && (right[1] <= 8)) {
                forbidingSquaresForBlackKing.add(rightup + ',' + right[1]);
              }
              if ((rightdown >= 1) && (rightdown <= 8) && (right[1] >= 1) && (right[1] <= 8)) {
                forbidingSquaresForBlackKing.add(rightdown + ',' + right[1]);
              }
            } else {
              up[0] = up[0] - 1;

              down[0] = down[0] + 1;

              left[1] = left[1] - 1;

              right[1] = right[1] + 1;

            }
          }
        }

        if (piece.id[0] === 'B') {
          let currentSquare = squares[piece.coordinates];
          let up = currentSquare.coordinates.split(',').map(el => parseInt(el));
          let down = currentSquare.coordinates.split(',').map(el => parseInt(el));
          let left = currentSquare.coordinates.split(',').map(el => parseInt(el));
          let right = currentSquare.coordinates.split(',').map(el => parseInt(el));

          for (let i = 0; i < 3; i++) {
            let upleft;
            let upright;
            let leftup;
            let leftdown;
            let rightup;
            let rightdown;
            let downright;
            let downleft;
            if (i === 2) {
              upleft = up[1] - 1;
              upright = up[1] + 1;
              downleft = down[1] - 1;
              downright = down[1] + 1;
              leftup = left[0] - 1;
              leftdown = left[0] + 1;
              rightup = right[0] - 1;
              rightdown = right[0] + 1;
              if ((upleft >= 1) && (upleft <= 8) && (up[0] >= 1) && (up[0] <= 8)) {
                forbidingSquaresForWhiteKing.add(up[0] + ',' + upleft);
              }
              if ((upright >= 1) && (upright <= 8) && (up[0] >= 1) && (up[0] <= 8)) {
                forbidingSquaresForWhiteKing.add(up[0] + ',' + upright);
              }
              if ((downleft >= 1) && (downleft <= 8) && (down[0] >= 1) && (down[0] <= 8)) {
                forbidingSquaresForWhiteKing.add(down[0] + ',' + downleft);
              }
              if ((downright >= 1) && (downright <= 8) && (down[0] >= 1) && (down[0] <= 8)) {
                forbidingSquaresForWhiteKing.add(down[0] + ',' + downright);
              }
              if ((leftup >= 1) && (leftup <= 8) && (left[1] >= 1) && (left[1] <= 8)) {
                forbidingSquaresForWhiteKing.add(leftup + ',' + left[1]);
              }
              if ((leftdown >= 1) && (leftdown <= 8) && (left[1] >= 1) && (left[1] <= 8)) {
                forbidingSquaresForWhiteKing.add(leftdown + ',' + left[1]);
              }
              if ((rightup >= 1) && (rightup <= 8) && (right[1] >= 1) && (right[1] <= 8)) {
                forbidingSquaresForWhiteKing.add(rightup + ',' + right[1]);
              }
              if ((rightdown >= 1) && (rightdown <= 8) && (right[1] >= 1) && (right[1] <= 8)) {
                forbidingSquaresForWhiteKing.add(rightdown + ',' + right[1]);
              }
            } else {
              up[0] = up[0] - 1;

              down[0] = down[0] + 1;

              left[1] = left[1] - 1;

              right[1] = right[1] + 1;

            }
          }
        }
      }
      if (piece.alias === '') {
        if (piece.id[0] === 'W') {
          let currentSquare = piece.coordinates.split(',').map(el => parseInt(el));
          // check if there is topleft square
          if (squares[(currentSquare[0] - 1) + ',' + (currentSquare[1] - 1)]) {
            forbidingSquaresForBlackKing.add((currentSquare[0] - 1) + ',' + (currentSquare[1] - 1));
          }
          // check if there is topright square
          if (squares[(currentSquare[0] - 1) + ',' + (currentSquare[1] + 1)]) {
            forbidingSquaresForBlackKing.add((currentSquare[0] - 1) + ',' + (currentSquare[1] + 1));
          }
        }

        if (piece.id[0] === 'B') {
          let currentSquare = piece.coordinates.split(',').map(el => parseInt(el));
          // check if there is bottom square
          if (squares[(currentSquare[0] + 1) + ',' + (currentSquare[1] - 1)]) {
            forbidingSquaresForWhiteKing.add((currentSquare[0] + 1) + ',' + (currentSquare[1] - 1));
          }
          // check if there is bottom square
          if (squares[(currentSquare[0] + 1) + ',' + (currentSquare[1] + 1)]) {
            forbidingSquaresForWhiteKing.add((currentSquare[0] + 1) + ',' + (currentSquare[1] + 1));
          }
        }
      }
      if (piece.alias === 'K') {
        if (piece.id[0] === 'W') {
          let currentCoordinates = piece.coordinates.split(',').map(el => parseInt(el));

          // check if top left square exist
          if (squares[(currentCoordinates[0] - 1) + ',' + (currentCoordinates[1] - 1)]) {
            forbidingSquaresForBlackKing.add((currentCoordinates[0] - 1) + ',' + (currentCoordinates[1] - 1))
          }
          // check if top right square exist
          if (squares[(currentCoordinates[0] - 1) + ',' + (currentCoordinates[1] + 1)]) {
            forbidingSquaresForBlackKing.add((currentCoordinates[0] - 1) + ',' + (currentCoordinates[1] + 1))
          }
          // check if bottom left square exist
          if (squares[(currentCoordinates[0] + 1) + ',' + (currentCoordinates[1] - 1)]) {
            forbidingSquaresForBlackKing.add((currentCoordinates[0] + 1) + ',' + (currentCoordinates[1] - 1))
          }
          // check if bottom right square exist
          if (squares[(currentCoordinates[0] + 1) + ',' + (currentCoordinates[1] + 1)]) {
            forbidingSquaresForBlackKing.add((currentCoordinates[0] + 1) + ',' + (currentCoordinates[1] + 1))
          }
          // check if left square exist
          if (squares[(currentCoordinates[0]) + ',' + (currentCoordinates[1] - 1)]) {
            forbidingSquaresForBlackKing.add((currentCoordinates[0]) + ',' + (currentCoordinates[1] - 1))
          }
          // check if right square exist
          if (squares[(currentCoordinates[0]) + ',' + (currentCoordinates[1] + 1)]) {
            forbidingSquaresForBlackKing.add((currentCoordinates[0]) + ',' + (currentCoordinates[1] + 1))
          }
          // check if top square exist
          if (squares[(currentCoordinates[0] - 1) + ',' + (currentCoordinates[1])]) {
            forbidingSquaresForBlackKing.add((currentCoordinates[0] - 1) + ',' + (currentCoordinates[1]))
          }
          // check if bottom square exist
          if (squares[(currentCoordinates[0] + 1) + ',' + (currentCoordinates[1])]) {
            forbidingSquaresForBlackKing.add((currentCoordinates[0] + 1) + ',' + (currentCoordinates[1]))
          }
        }
        if (piece.id[0] === 'B') {
          let currentCoordinates = piece.coordinates.split(',').map(el => parseInt(el));

          // check if top left square exist
          if (squares[(currentCoordinates[0] - 1) + ',' + (currentCoordinates[1] - 1)]) {
            forbidingSquaresForWhiteKing.add((currentCoordinates[0] - 1) + ',' + (currentCoordinates[1] - 1))
          }
          // check if top right square exist
          if (squares[(currentCoordinates[0] - 1) + ',' + (currentCoordinates[1] + 1)]) {
            forbidingSquaresForWhiteKing.add((currentCoordinates[0] - 1) + ',' + (currentCoordinates[1] + 1))
          }
          // check if bottom left square exist
          if (squares[(currentCoordinates[0] + 1) + ',' + (currentCoordinates[1] - 1)]) {
            forbidingSquaresForWhiteKing.add((currentCoordinates[0] + 1) + ',' + (currentCoordinates[1] - 1))
          }
          // check if bottom right square exist
          if (squares[(currentCoordinates[0] + 1) + ',' + (currentCoordinates[1] + 1)]) {
            forbidingSquaresForWhiteKing.add((currentCoordinates[0] + 1) + ',' + (currentCoordinates[1] + 1))
          }
          // check if left square exist
          if (squares[(currentCoordinates[0]) + ',' + (currentCoordinates[1] - 1)]) {
            forbidingSquaresForWhiteKing.add((currentCoordinates[0]) + ',' + (currentCoordinates[1] - 1))
          }
          // check if right square exist
          if (squares[(currentCoordinates[0]) + ',' + (currentCoordinates[1] + 1)]) {
            forbidingSquaresForWhiteKing.add((currentCoordinates[0]) + ',' + (currentCoordinates[1] + 1))
          }
          // check if top square exist
          if (squares[(currentCoordinates[0] - 1) + ',' + (currentCoordinates[1])]) {
            forbidingSquaresForWhiteKing.add((currentCoordinates[0] - 1) + ',' + (currentCoordinates[1]))
          }
          // check if bottom square exist
          if (squares[(currentCoordinates[0] + 1) + ',' + (currentCoordinates[1])]) {
            forbidingSquaresForWhiteKing.add((currentCoordinates[0] + 1) + ',' + (currentCoordinates[1]))
          }
        }
      }
    });
    if (!(checkPieces)) {
      this.setState({ forbidingSquaresForWhiteKing, forbidingSquaresForBlackKing }, () => {
        if (this.state.turn === 'W') {
          if (this.state.forbidingSquaresForWhiteKing.has(pieces[60].coordinates)) {
            console.log('white king on check')
          }
        }
        if (this.state.turn === 'B') {
          console.log('black\'s turn to play')
          if (this.state.forbidingSquaresForBlackKing.has(pieces[4].coordinates)) {
            console.log('black king on check')
          }
        }
      })
    } else {
      return ([
        forbidingSquaresForWhiteKing.has(pieces[60].coordinates),
        forbidingSquaresForBlackKing.has(pieces[4].coordinates)
      ])
    }
  }
  movePiece = (piece, square) => {
    if (this.state.turn === piece.id[0]) {
      let { currentPiece } = this.state;
      if (!currentPiece) {
        this.setState({ currentPiece: piece, currentSquare: square })
        const position = piece.coordinates;
        const squareCordinate = this.state.squares[position].coordinates;
        // console.log(square);
        this.hilightLegalSquares(piece);
      }
    }
  }
  dropPiece = (index, coordinates, square) => {
    let { currentPiece, pieces, lightUpSquares, squares, moves, currentSquare } = this.state;
    if (lightUpSquares.has(square.coordinates) && (square !== currentSquare)) {
      if ((pieces[square.id]) && (currentPiece !== pieces[square.id])) {
        delete pieces[square.id];
        if (currentPiece.alias !== '') {
          moves.push(currentPiece.alias + 'x' + square.label)
        } else {
          moves.push(currentSquare.label[0] + 'x' + square.label)
        }
      } else {
        if (pieces[square.id] !== currentPiece) {
          if (currentPiece.alias === '') {
            this.setState({ recentPawnPush: currentSquare.label + '-' + square.label })
          }
          if (currentPiece.alias === 'K') {
            let oldCoordinates = currentSquare.coordinates.split(',');
            oldCoordinates = oldCoordinates.map(el => parseInt(el));
            let newCoordinates = square.coordinates.split(',');
            newCoordinates = newCoordinates.map(el => parseInt(el));
            if (newCoordinates[1] === (oldCoordinates[1] + 2)) {
              moves.push('O-O')
            }
            else if (newCoordinates[1] === (oldCoordinates[1] - 2)) {
              moves.push('O-O-O')
            }
          } else {
            moves.push(currentPiece.alias + square.label)
          }
        } else {
          moves.push(currentPiece.alias + square.label)
        }
      }
      if (currentPiece) {
        delete pieces[currentPiece.position]
        currentPiece.position = index;
        currentPiece.coordinates = coordinates;
        pieces[index] = currentPiece;
        let sq = currentSquare.coordinates.split(',');
        sq = sq.map(sq => (parseInt(sq)));
        if (currentPiece.alias === 'K') {
          if ((currentPiece.id[0] === 'W') && (this.state.whiteKingCanCastleRight)) {
            this.setState({ whiteKingCanCastleLeft: false, whiteKingCanCastleRight: false })
            if (!pieces[squares[sq[0] + ',' + (sq[1] + 1)].id] && (currentPiece.id !== pieces[squares[sq[0] + ',' + (sq[1] + 2)].id])) {
              if (square.id === squares[sq[0] + ',' + (sq[1] + 2)].id) {
                let rook = pieces[squares[sq[0] + ',' + (sq[1] + 3)].id];
                rook.coordinates = sq[0] + ',' + (sq[1] + 1);
                rook.position = squares[sq[0] + ',' + (sq[1] + 1)].id;
                delete pieces[squares[sq[0] + ',' + (sq[1] + 3)].id];
                pieces[rook.position] = rook;
              }
            }
          }
          if ((currentPiece.id[0] === 'W') && (this.state.whiteKingCanCastleLeft)) {
            this.setState({ whiteKingCanCastleLeft: false, whiteKingCanCastleRight: false })
            if (!pieces[squares[sq[0] + ',' + (sq[1] - 1)].id] && (currentPiece.id !== pieces[squares[sq[0] + ',' + (sq[1] - 2)].id])
              && (currentPiece.id !== pieces[squares[sq[0] + ',' + (sq[1] - 3)].id])) {
              if (square.id === squares[sq[0] + ',' + (sq[1] - 2)].id) {
                let rook = pieces[squares[sq[0] + ',' + (sq[1] - 4)].id];
                rook.coordinates = sq[0] + ',' + (sq[1] - 1);
                rook.position = squares[sq[0] + ',' + (sq[1] - 1)].id;
                delete pieces[squares[sq[0] + ',' + (sq[1] - 4)].id];
                pieces[rook.position] = rook;
              }
            }
          }
          // black king
          if ((currentPiece.id[0] === 'B') && (this.state.blackKingCanCastleLeft)) {
            this.setState({ blackKingCanCastleRight: false, blackKingCanCastleLeft: false })
            if (!pieces[squares[sq[0] + ',' + (sq[1] + 1)].id] && (currentPiece.id !== pieces[squares[sq[0] + ',' + (sq[1] + 2)].id])) {
              if (square.id === squares[sq[0] + ',' + (sq[1] + 2)].id) {
                let rook = pieces[squares[sq[0] + ',' + (sq[1] + 3)].id];
                rook.coordinates = sq[0] + ',' + (sq[1] + 1);
                rook.position = squares[sq[0] + ',' + (sq[1] + 1)].id;
                delete pieces[squares[sq[0] + ',' + (sq[1] + 3)].id];
                pieces[rook.position] = rook;
              }
            }
          }
          if ((currentPiece.id[0] === 'B') && (this.state.blackKingCanCastleRight)) {
            this.setState({ blackKingCanCastleRight: false, blackKingCanCastleLeft: false })
            if (!pieces[squares[sq[0] + ',' + (sq[1] - 1)].id] && (currentPiece.id !== pieces[squares[sq[0] + ',' + (sq[1] - 2)].id])
              && (currentPiece.id !== pieces[squares[sq[0] + ',' + (sq[1] - 3)].id])) {
              if (square.id === squares[sq[0] + ',' + (sq[1] - 2)].id) {
                let rook = pieces[squares[sq[0] + ',' + (sq[1] - 4)].id];
                rook.coordinates = sq[0] + ',' + (sq[1] - 1);
                rook.position = squares[sq[0] + ',' + (sq[1] - 1)].id;
                delete pieces[squares[sq[0] + ',' + (sq[1] - 4)].id];
                pieces[rook.position] = rook;
              }
            }
          }
        }
        if (currentPiece.alias === '') {
          if (currentPiece.id[0] === 'W') {
            // console.log(currentSquare.coordinates, square.coordinates)
            if (currentSquare.coordinates[0] === '4') {
              // check for top left and right en passant pawn
              let xCoordinate = parseInt(currentSquare.coordinates[2]);
              let squareFiles = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
              if ((xCoordinate - 1) >= 1) {
                // check if recent movement is a left pawn push
                let m = squareFiles[xCoordinate - 2] + 7 + '-' + squareFiles[xCoordinate - 2] + 5;
                if (this.state.recentPawnPush === m) {
                  delete pieces[squares[(4 + ',' + (xCoordinate - 1))].id];
                }
              }
              if ((xCoordinate + 1) <= 8) {
                // check if recent movement is a right pawn push
                let m = squareFiles[xCoordinate] + 7 + '-' + squareFiles[xCoordinate] + 5;
                if (this.state.recentPawnPush === m) {
                  delete pieces[squares[(4 + ',' + (xCoordinate + 1))].id];
                }
              }
            }
          }
          if (currentPiece.id[0] === 'B') {
            if (currentSquare.coordinates[0] === '5') {
              // check for bottom left and right en passant pawn
              let xCoordinate = parseInt(currentSquare.coordinates[2]);
              let squareFiles = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
              if ((xCoordinate - 1) >= 1) {
                // check if recent movement is a left pawn push
                let m = squareFiles[xCoordinate - 2] + 2 + '-' + squareFiles[xCoordinate - 2] + 4;
                if (this.state.recentPawnPush === m) {
                  delete pieces[squares[(5 + ',' + (xCoordinate - 1))].id];
                }
              }
              if ((xCoordinate + 1) <= 8) {
                // check if recent movement is a right pawn push
                let m = squareFiles[xCoordinate] + 2 + '-' + squareFiles[xCoordinate] + 4;
                if (this.state.recentPawnPush === m) {
                  delete pieces[squares[(5 + ',' + (xCoordinate + 1))].id];
                }
              }
            }
          }
        }
        for (let cordinate of lightUpSquares) {
          squares[cordinate].light = false
        }
        let { turn } = this.state;
        if (turn === 'W') {
          turn = 'B';
        } else {
          turn = 'W'
        }
        this.setState({ pieces: pieces, squares: squares, currentPiece: null, moves: moves, turn })
      }
    } else {
      for (let i of lightUpSquares) {
        squares[i].light = false;
      }
      this.setState({ lightUpSquares: lightUpSquares.clear(), squares })
    }
    this.forbidingSquares()
    // checking if king is on check
  }
  hilightLegalSquares = (currentPiece) => {
    const coordinates = currentPiece.coordinates.split(','); // array of strings (y,x)
    let { squares } = this.state;
    let lightUpSquares = new Set();
    if (currentPiece.alias === 'B') {
      let bottomRight = coordinates.map(el => parseInt(el));
      let bottomLeft = coordinates.map(el => parseInt(el));
      let topRight = coordinates.map(el => parseInt(el));
      let topLeft = coordinates.map(el => parseInt(el));

      let topRightObstruction = 0;
      let topLeftObstruction = 0;
      let bottomRightObstruction = 0;
      let bottomLeftObstruction = 0;
      while ((bottomRight[0] <= 8) || (bottomRight[1] <= 8) ||
        (bottomLeft[0] <= 8) || (bottomLeft[1] >= 1) ||
        (topRight[0] >= 1) || (topRight[1] <= 8) ||
        (topLeft[0] >= 1) || (topLeft[1] >= 1)) {
        if ((bottomRight[0] <= 8) && (bottomRight[1]) <= 8) {
          let bottomRightSquares = squares[bottomRight[0] + ',' + bottomRight[1]];
          if (bottomRightSquares) {
            if (this.state.pieces[bottomRightSquares.id]) {
              if ((this.state.pieces[bottomRightSquares.id] !== currentPiece) && (this.state.pieces[bottomRightSquares.id].id[0] === currentPiece.id[0])) {
                bottomRightObstruction = bottomRightObstruction + 1;
              }
            }
          }
          if (bottomRightObstruction === 0) {
            // check if king will be in check
            const checkPieces = this.state.pieces;
            // change position of current piece
            let checkCurrentPiece = currentPiece;
            let checkCurrentSquare = squares[bottomRight[0] + ',' + bottomRight[1]];
            delete checkPieces[checkCurrentPiece.position];
            checkCurrentPiece.position = checkCurrentSquare.id;
            checkCurrentPiece.coordinates = bottomRight[0] + ',' + bottomRight[1];
            if ((this.state.turn === 'W') && (this.forbidingSquares(checkPieces)[1])) {
              // console.log(bottomRight[0] + ',' + bottomRight[1], 'danger square')
            }
            if ((this.state.turn === 'B') && (this.forbidingSquares(checkPieces)[0])) {
              console.log(bottomRight[0] + ',' + bottomRight[1], 'danger square for black')
            }
            console.log(this.forbidingSquares(checkPieces, squares))
            lightUpSquares.add(bottomRight[0] + ',' + bottomRight[1]);
            console.log(bottomRight)
            if (bottomRightSquares) {
              if (this.state.pieces[bottomRightSquares.id]) {
                if ((this.state.pieces[bottomRightSquares.id] !== currentPiece) && (this.state.pieces[bottomRightSquares.id].id[0] !== currentPiece.id[0])) {
                  bottomRightObstruction = bottomRightObstruction + 1;
                }
              }
            }
          }
        }
        if ((bottomLeft[0] <= 8) && (bottomLeft[1] >= 1)) {
          let bottomLeftSquares = squares[bottomLeft[0] + ',' + bottomLeft[1]];
          if (bottomLeftSquares) {
            if (this.state.pieces[bottomLeftSquares.id]) {
              if ((this.state.pieces[bottomLeftSquares.id] !== currentPiece) && (this.state.pieces[bottomLeftSquares.id].id[0] === currentPiece.id[0])) {
                bottomLeftObstruction = bottomLeftObstruction + 1;
              }
            }
          }
          if (bottomLeftObstruction === 0) {
            lightUpSquares.add(bottomLeft[0] + ',' + bottomLeft[1]);
            if (bottomLeftSquares) {
              if (this.state.pieces[bottomLeftSquares.id]) {
                if ((this.state.pieces[bottomLeftSquares.id] !== currentPiece) && (this.state.pieces[bottomLeftSquares.id].id[0] !== currentPiece.id[0])) {
                  bottomLeftObstruction = bottomLeftObstruction + 1;
                }
              }
            }
          }
        }
        if ((topRight[0] >= 1) && (topRight[1] <= 8)) {
          let topRightSquares = squares[topRight[0] + ',' + topRight[1]];
          if (topRightSquares) {
            if (this.state.pieces[topRightSquares.id]) {
              if ((this.state.pieces[topRightSquares.id] !== currentPiece) && (this.state.pieces[topRightSquares.id].id[0] === currentPiece.id[0])) {
                topRightObstruction = topRightObstruction + 1;
              }
            }
          }
          if (topRightObstruction === 0) {
            lightUpSquares.add(topRight[0] + ',' + topRight[1]);
            if (topRightSquares) {
              if (this.state.pieces[topRightSquares.id]) {
                if ((this.state.pieces[topRightSquares.id] !== currentPiece) && (this.state.pieces[topRightSquares.id].id[0] !== currentPiece.id[0])) {
                  topRightObstruction = topRightObstruction + 1;
                }
              }
            }
          }
        }
        if ((topLeft[0] >= 1) && (topLeft[1] >= 1)) {
          let topLeftSquares = squares[topLeft[0] + ',' + topLeft[1]];
          if (topLeftSquares) {
            if (this.state.pieces[topLeftSquares.id]) {
              if ((this.state.pieces[topLeftSquares.id] !== currentPiece) && (this.state.pieces[topLeftSquares.id].id[0] === currentPiece.id[0])) {
                topLeftObstruction = topLeftObstruction + 1;
              }
            }
          }
          if (topLeftObstruction === 0) {
            lightUpSquares.add(topLeft[0] + ',' + topLeft[1]);
            if (topLeftSquares) {
              if (this.state.pieces[topLeftSquares.id]) {
                if ((this.state.pieces[topLeftSquares.id] !== currentPiece) && (this.state.pieces[topLeftSquares.id].id[0] !== currentPiece.id[0])) {
                  topLeftObstruction = topLeftObstruction + 1;
                }
              }
            }
          }
        }
        bottomRight[0] = bottomRight[0] + 1;
        bottomRight[1] = bottomRight[1] + 1;
        bottomLeft[0] = bottomLeft[0] + 1;
        bottomLeft[1] = bottomLeft[1] - 1;
        topRight[0] = topRight[0] - 1;
        topRight[1] = topRight[1] + 1;
        topLeft[0] = topLeft[0] - 1;
        topLeft[1] = topLeft[1] - 1;
      }
    }
    if (currentPiece.alias === 'R') {
      let up = coordinates.map(el => parseInt(el));
      let down = coordinates.map(el => parseInt(el));
      let left = coordinates.map(el => parseInt(el));
      let right = coordinates.map(el => parseInt(el));
      let upwardObstructionCounter = 0;
      let downwardObstructionCounter = 0;
      let leftObstructionCounter = 0;
      let rightObstructionCounter = 0;
      while ((up[0] >= 1) || (down[0] <= 8) || (left[1] >= 1) || (right[1] <= 8)) {
        if (up[0] >= 1) {
          let upwardSquares = squares[up[0] + ',' + up[1]];
          if (upwardSquares) {
            if (this.state.pieces[upwardSquares.id]) {
              if ((this.state.pieces[upwardSquares.id] !== currentPiece) && (this.state.pieces[upwardSquares.id].id[0] === currentPiece.id[0])) {
                upwardObstructionCounter = upwardObstructionCounter + 1;
              }
            }
          }
          if (upwardObstructionCounter === 0) {
            lightUpSquares.add(up[0] + ',' + up[1]);
            if (upwardSquares) {
              if (this.state.pieces[upwardSquares.id]) {
                if ((this.state.pieces[upwardSquares.id] !== currentPiece) && (this.state.pieces[upwardSquares.id].id[0] !== currentPiece.id[0])) {
                  upwardObstructionCounter = upwardObstructionCounter + 1;
                }
              }
            }
          }
        }
        if (down[0] <= 8) {
          let downwardSqares = squares[down[0] + ',' + down[1]];
          if (downwardSqares) {
            if (this.state.pieces[downwardSqares.id]) {
              if ((this.state.pieces[downwardSqares.id] !== currentPiece) && (this.state.pieces[downwardSqares.id].id[0] === currentPiece.id[0])) {
                downwardObstructionCounter = downwardObstructionCounter + 1;
              }
            }
          }
          if (downwardObstructionCounter === 0) {
            lightUpSquares.add(down[0] + ',' + down[1]);
            if (downwardSqares) {
              if (this.state.pieces[downwardSqares.id]) {
                if ((this.state.pieces[downwardSqares.id] !== currentPiece) && (this.state.pieces[downwardSqares.id].id[0] !== currentPiece.id[0])) {
                  downwardObstructionCounter = downwardObstructionCounter + 1;
                }
              }
            }
          }
        }
        if (left[1] >= 1) {
          let leftSquares = squares[left[0] + ',' + left[1]];
          if (leftSquares) {
            if (this.state.pieces[leftSquares.id]) {
              if ((this.state.pieces[leftSquares.id] !== currentPiece) && (this.state.pieces[leftSquares.id].id[0] === currentPiece.id[0])) {
                leftObstructionCounter = leftObstructionCounter + 1;
              }
            }
          }
          if (leftObstructionCounter === 0) {
            lightUpSquares.add(left[0] + ',' + left[1]);
            if (leftSquares) {
              if (this.state.pieces[leftSquares.id]) {
                if ((this.state.pieces[leftSquares.id] !== currentPiece) && (this.state.pieces[leftSquares.id].id[0] !== currentPiece.id[0])) {
                  leftObstructionCounter = leftObstructionCounter + 1;
                }
              }
            }
          }
        }
        if (right[1] <= 8) {
          let rightSquares = squares[right[0] + ',' + right[1]];
          if (rightSquares) {
            if (this.state.pieces[rightSquares.id]) {
              if ((this.state.pieces[rightSquares.id] !== currentPiece) && (this.state.pieces[rightSquares.id].id[0] === currentPiece.id[0])) {
                rightObstructionCounter = rightObstructionCounter + 1;
              }
            }
          }
          if (rightObstructionCounter === 0) {
            lightUpSquares.add(right[0] + ',' + right[1]);
            if (rightSquares) {
              if (this.state.pieces[rightSquares.id]) {
                if ((this.state.pieces[rightSquares.id] !== currentPiece) && (this.state.pieces[rightSquares.id].id[0] !== currentPiece.id[0])) {
                  rightObstructionCounter = rightObstructionCounter + 1;
                }
              }
            }
          }
        };

        up[0] = up[0] - 1;
        down[0] = down[0] + 1;
        left[1] = left[1] - 1;
        right[1] = right[1] + 1;
      }
    }
    if (currentPiece.alias === 'Q') {
      let bottomRight = coordinates.map(el => parseInt(el));
      let bottomLeft = coordinates.map(el => parseInt(el));
      let topRight = coordinates.map(el => parseInt(el));
      let topLeft = coordinates.map(el => parseInt(el));

      let up = coordinates.map(el => parseInt(el));
      let down = coordinates.map(el => parseInt(el));
      let left = coordinates.map(el => parseInt(el));
      let right = coordinates.map(el => parseInt(el));

      let topRightObstruction = 0;
      let topLeftObstruction = 0;
      let bottomRightObstruction = 0;
      let bottomLeftObstruction = 0;
      let upwardObstructionCounter = 0;
      let downwardObstructionCounter = 0;
      let leftObstructionCounter = 0;
      let rightObstructionCounter = 0;

      while ((bottomRight[0] <= 8) || (bottomRight[1] <= 8) ||
        (bottomLeft[0] <= 8) || (bottomLeft[1] >= 1) ||
        (topRight[0] >= 1) || (topRight[1] <= 8) ||
        (topLeft[0] >= 1) || (topLeft[1] >= 1) ||
        (up[0] >= 1) || (down[0] <= 8) || (left[1] >= 1) || (right[1] <= 8)) {
        if ((bottomRight[0] <= 8) && (bottomRight[1]) <= 8) {
          let bottomRightSquares = squares[bottomRight[0] + ',' + bottomRight[1]];
          if (bottomRightSquares) {
            if (this.state.pieces[bottomRightSquares.id]) {
              if ((this.state.pieces[bottomRightSquares.id] !== currentPiece) && (this.state.pieces[bottomRightSquares.id].id[0] === currentPiece.id[0])) {
                bottomRightObstruction = bottomRightObstruction + 1;
              }
            }
          }
          if (bottomRightObstruction === 0) {
            lightUpSquares.add(bottomRight[0] + ',' + bottomRight[1]);
            if (bottomRightSquares) {
              if (this.state.pieces[bottomRightSquares.id]) {
                if ((this.state.pieces[bottomRightSquares.id] !== currentPiece) && (this.state.pieces[bottomRightSquares.id].id[0] !== currentPiece.id[0])) {
                  bottomRightObstruction = bottomRightObstruction + 1;
                }
              }
            }
          }
        }
        if ((bottomLeft[0] <= 8) && (bottomLeft[1] >= 1)) {
          let bottomLeftSquares = squares[bottomLeft[0] + ',' + bottomLeft[1]];
          if (bottomLeftSquares) {
            if (this.state.pieces[bottomLeftSquares.id]) {
              if ((this.state.pieces[bottomLeftSquares.id] !== currentPiece) && (this.state.pieces[bottomLeftSquares.id].id[0] === currentPiece.id[0])) {
                bottomLeftObstruction = bottomLeftObstruction + 1;
              }
            }
          }
          if (bottomLeftObstruction === 0) {
            lightUpSquares.add(bottomLeft[0] + ',' + bottomLeft[1]);
            if (bottomLeftSquares) {
              if (this.state.pieces[bottomLeftSquares.id]) {
                if ((this.state.pieces[bottomLeftSquares.id] !== currentPiece) && (this.state.pieces[bottomLeftSquares.id].id[0] !== currentPiece.id[0])) {
                  bottomLeftObstruction = bottomLeftObstruction + 1;
                }
              }
            }
          }
        }
        if ((topRight[0] >= 1) && (topRight[1] <= 8)) {
          let topRightSquares = squares[topRight[0] + ',' + topRight[1]];
          if (topRightSquares) {
            if (this.state.pieces[topRightSquares.id]) {
              if ((this.state.pieces[topRightSquares.id] !== currentPiece) && (this.state.pieces[topRightSquares.id].id[0] === currentPiece.id[0])) {
                topRightObstruction = topRightObstruction + 1;
              }
            }
          }
          if (topRightObstruction === 0) {
            lightUpSquares.add(topRight[0] + ',' + topRight[1]);
            if (topRightSquares) {
              if (this.state.pieces[topRightSquares.id]) {
                if ((this.state.pieces[topRightSquares.id] !== currentPiece) && (this.state.pieces[topRightSquares.id].id[0] !== currentPiece.id[0])) {
                  topRightObstruction = topRightObstruction + 1;
                }
              }
            }
          }
        }
        if ((topLeft[0] >= 1) && (topLeft[1] >= 1)) {
          let topLeftSquares = squares[topLeft[0] + ',' + topLeft[1]];
          if (topLeftSquares) {
            if (this.state.pieces[topLeftSquares.id]) {
              if ((this.state.pieces[topLeftSquares.id] !== currentPiece) && (this.state.pieces[topLeftSquares.id].id[0] === currentPiece.id[0])) {
                topLeftObstruction = topLeftObstruction + 1;
              }
            }
          }
          if (topLeftObstruction === 0) {
            lightUpSquares.add(topLeft[0] + ',' + topLeft[1]);
            if (topLeftSquares) {
              if (this.state.pieces[topLeftSquares.id]) {
                if ((this.state.pieces[topLeftSquares.id] !== currentPiece) && (this.state.pieces[topLeftSquares.id].id[0] !== currentPiece.id[0])) {
                  topLeftObstruction = topLeftObstruction + 1;
                }
              }
            }
          }
        }

        if (up[0] >= 1) {
          let upwardSquares = squares[up[0] + ',' + up[1]];
          if (upwardSquares) {
            if (this.state.pieces[upwardSquares.id]) {
              if ((this.state.pieces[upwardSquares.id] !== currentPiece) && (this.state.pieces[upwardSquares.id].id[0] === currentPiece.id[0])) {
                upwardObstructionCounter = upwardObstructionCounter + 1;
              }
            }
          }
          if (upwardObstructionCounter === 0) {
            lightUpSquares.add(up[0] + ',' + up[1]);
            if (upwardSquares) {
              if (this.state.pieces[upwardSquares.id]) {
                if ((this.state.pieces[upwardSquares.id] !== currentPiece) && (this.state.pieces[upwardSquares.id].id[0] !== currentPiece.id[0])) {
                  upwardObstructionCounter = upwardObstructionCounter + 1;
                }
              }
            }
          }
        }
        if (down[0] <= 8) {
          let downwardSqares = squares[down[0] + ',' + down[1]];
          if (downwardSqares) {
            if (this.state.pieces[downwardSqares.id]) {
              if ((this.state.pieces[downwardSqares.id] !== currentPiece) && (this.state.pieces[downwardSqares.id].id[0] === currentPiece.id[0])) {
                downwardObstructionCounter = downwardObstructionCounter + 1;
              }
            }
          }
          if (downwardObstructionCounter === 0) {
            lightUpSquares.add(down[0] + ',' + down[1]);
            if (downwardSqares) {
              if (this.state.pieces[downwardSqares.id]) {
                if ((this.state.pieces[downwardSqares.id] !== currentPiece) && (this.state.pieces[downwardSqares.id].id[0] !== currentPiece.id[0])) {
                  downwardObstructionCounter = downwardObstructionCounter + 1;
                }
              }
            }
          }
        }
        if (left[1] >= 1) {
          let leftSquares = squares[left[0] + ',' + left[1]];
          if (leftSquares) {
            if (this.state.pieces[leftSquares.id]) {
              if ((this.state.pieces[leftSquares.id] !== currentPiece) && (this.state.pieces[leftSquares.id].id[0] === currentPiece.id[0])) {
                leftObstructionCounter = leftObstructionCounter + 1;
              }
            }
          }
          if (leftObstructionCounter === 0) {
            lightUpSquares.add(left[0] + ',' + left[1]);
            if (leftSquares) {
              if (this.state.pieces[leftSquares.id]) {
                if ((this.state.pieces[leftSquares.id] !== currentPiece) && (this.state.pieces[leftSquares.id].id[0] !== currentPiece.id[0])) {
                  leftObstructionCounter = leftObstructionCounter + 1;
                }
              }
            }
          }
        }
        if (right[1] <= 8) {
          let rightSquares = squares[right[0] + ',' + right[1]];
          if (rightSquares) {
            if (this.state.pieces[rightSquares.id]) {
              if ((this.state.pieces[rightSquares.id] !== currentPiece) && (this.state.pieces[rightSquares.id].id[0] === currentPiece.id[0])) {
                rightObstructionCounter = rightObstructionCounter + 1;
              }
            }
          }
          if (rightObstructionCounter === 0) {
            lightUpSquares.add(right[0] + ',' + right[1]);
            if (rightSquares) {
              if (this.state.pieces[rightSquares.id]) {
                if ((this.state.pieces[rightSquares.id] !== currentPiece) && (this.state.pieces[rightSquares.id].id[0] !== currentPiece.id[0])) {
                  rightObstructionCounter = rightObstructionCounter + 1;
                }
              }
            }
          }
        }

        bottomRight[0] = bottomRight[0] + 1;
        bottomRight[1] = bottomRight[1] + 1;
        bottomLeft[0] = bottomLeft[0] + 1;
        bottomLeft[1] = bottomLeft[1] - 1;
        topRight[0] = topRight[0] - 1;
        topRight[1] = topRight[1] + 1;
        topLeft[0] = topLeft[0] - 1;
        topLeft[1] = topLeft[1] - 1;
        up[0] = up[0] - 1;
        down[0] = down[0] + 1;
        left[1] = left[1] - 1;
        right[1] = right[1] + 1;
      }
    }
    if (currentPiece.alias === 'N') {
      let up = coordinates.map(el => parseInt(el));
      let down = coordinates.map(el => parseInt(el));
      let left = coordinates.map(el => parseInt(el));
      let right = coordinates.map(el => parseInt(el));

      lightUpSquares.add(coordinates.join(','));
      for (let i = 0; i < 3; i++) {
        let upleft;
        let upright;
        let leftup;
        let leftdown;
        let rightup;
        let rightdown;
        let downright;
        let downleft;
        if (i === 2) {
          upleft = up[1] - 1;
          upright = up[1] + 1;
          downleft = down[1] - 1;
          downright = down[1] + 1;
          leftup = left[0] - 1;
          leftdown = left[0] + 1;
          rightup = right[0] - 1;
          rightdown = right[0] + 1;
          if ((upleft >= 1) && (upleft <= 8) && (up[0] >= 1) && (up[0] <= 8)) {
            let pieceOnSquareCheck = this.state.pieces[this.state.squares[up[0] + ',' + upleft].id];
            if (!pieceOnSquareCheck) {
              lightUpSquares.add(up[0] + ',' + upleft);
            } else {
              // console.log(pieceOnSquareCheck.id, currentPiece.id)
              if (pieceOnSquareCheck.id[0] !== currentPiece.id[0]) {
                lightUpSquares.add(up[0] + ',' + upleft);
              }
            }
          }
          if ((upright >= 1) && (upright <= 8) && (up[0] >= 1) && (up[0] <= 8)) {
            let pieceOnSquareCheck = this.state.pieces[this.state.squares[up[0] + ',' + upright].id];
            if (!pieceOnSquareCheck) {
              lightUpSquares.add(up[0] + ',' + upright);
            } else {
              // console.log(pieceOnSquareCheck.id, currentPiece.id)
              if (pieceOnSquareCheck.id[0] !== currentPiece.id[0]) {
                lightUpSquares.add(up[0] + ',' + upright);
              }
            }
          }
          if ((downleft >= 1) && (downleft <= 8) && (down[0] >= 1) && (down[0] <= 8)) {
            let pieceOnSquareCheck = this.state.pieces[this.state.squares[down[0] + ',' + downleft].id];
            if (!pieceOnSquareCheck) {
              lightUpSquares.add(down[0] + ',' + downleft);
            } else {
              // console.log(pieceOnSquareCheck.id, currentPiece.id)
              if (pieceOnSquareCheck.id[0] !== currentPiece.id[0]) {
                lightUpSquares.add(down[0] + ',' + downleft);
              }
            }
          }
          if ((downright >= 1) && (downright <= 8) && (down[0] >= 1) && (down[0] <= 8)) {
            let pieceOnSquareCheck = this.state.pieces[this.state.squares[down[0] + ',' + downright].id];
            if (!pieceOnSquareCheck) {
              lightUpSquares.add(down[0] + ',' + downright);
            } else {
              // console.log(pieceOnSquareCheck.id, currentPiece.id)
              if (pieceOnSquareCheck.id[0] !== currentPiece.id[0]) {
                lightUpSquares.add(down[0] + ',' + downright);
              }
            }
          }
          if ((leftup >= 1) && (leftup <= 8) && (left[1] >= 1) && (left[1] <= 8)) {
            let pieceOnSquareCheck = this.state.pieces[this.state.squares[leftup + ',' + left[1]].id];
            if (!pieceOnSquareCheck) {
              lightUpSquares.add(leftup + ',' + left[1]);
            } else {
              // console.log(pieceOnSquareCheck.id, currentPiece.id)
              if (pieceOnSquareCheck.id[0] !== currentPiece.id[0]) {
                lightUpSquares.add(leftup + ',' + left[1]);
              }
            }
          }
          if ((leftdown >= 1) && (leftdown <= 8) && (left[1] >= 1) && (left[1] <= 8)) {
            let pieceOnSquareCheck = this.state.pieces[this.state.squares[leftdown + ',' + left[1]].id];
            if (!pieceOnSquareCheck) {
              lightUpSquares.add(leftdown + ',' + left[1]);
            } else {
              // console.log(pieceOnSquareCheck.id, currentPiece.id)
              if (pieceOnSquareCheck.id[0] !== currentPiece.id[0]) {
                lightUpSquares.add(leftdown + ',' + left[1]);
              }
            }
          }
          if ((rightup >= 1) && (rightup <= 8) && (right[1] >= 1) && (right[1] <= 8)) {
            let pieceOnSquareCheck = this.state.pieces[this.state.squares[rightup + ',' + right[1]].id];
            if (!pieceOnSquareCheck) {
              lightUpSquares.add(rightup + ',' + right[1]);
            } else {
              // console.log(pieceOnSquareCheck.id, currentPiece.id)
              if (pieceOnSquareCheck.id[0] !== currentPiece.id[0]) {
                lightUpSquares.add(rightup + ',' + right[1]);
              }
            }
          }
          if ((rightdown >= 1) && (rightdown <= 8) && (right[1] >= 1) && (right[1] <= 8)) {
            let pieceOnSquareCheck = this.state.pieces[this.state.squares[rightdown + ',' + right[1]].id];
            if (!pieceOnSquareCheck) {
              lightUpSquares.add(rightdown + ',' + right[1]);
            } else {
              // console.log(pieceOnSquareCheck.id, currentPiece.id)
              if (pieceOnSquareCheck.id[0] !== currentPiece.id[0]) {
                lightUpSquares.add(rightdown + ',' + right[1]);
              }
            }
          }
        } else {
          up[0] = up[0] - 1;

          down[0] = down[0] + 1;

          left[1] = left[1] - 1;

          right[1] = right[1] + 1;

        }
      }
    }
    if (currentPiece.alias === 'K') {
      let up = coordinates.map(el => parseInt(el));
      let down = coordinates.map(el => parseInt(el));
      let left = coordinates.map(el => parseInt(el));
      let right = coordinates.map(el => parseInt(el));

      lightUpSquares.add(coordinates);
      // a single upward movement
      if ((up[0] - 1) >= 1) {
        const upCoordinate = (up[0] - 1) + ',' + up[1];

        // check if piece in upCoodinate
        if (this.state.pieces[squares[upCoordinate].id]) {
          // check if piece has thesame color as the king/currentPiece
          if (this.state.pieces[squares[upCoordinate].id].id[0] !== currentPiece.id[0]) {
            lightUpSquares.add(upCoordinate);
          }
        } else {
          lightUpSquares.add(upCoordinate);
        }
        const upleftCoordinate = (up[0] - 1) + ',' + (up[1] - 1);
        // check if piece in upleftCoordinate
        if (this.state.pieces[squares[upleftCoordinate].id]) {
          // check if piece has the same color as the king/currentPiece
          if (this.state.pieces[squares[upleftCoordinate].id].id[0] !== currentPiece.id[0]) {
            lightUpSquares.add(upleftCoordinate);
          }
        } else {
          lightUpSquares.add(upleftCoordinate);
        }
        const uprightCoordinate = (up[0] - 1) + ',' + (up[1] + 1);
        // check if piece in uprightCoordinate
        if (this.state.pieces[squares[uprightCoordinate].id]) {
          // check if piece has the same color as the king/currentPiece
          if (this.state.pieces[squares[uprightCoordinate].id].id[0] !== currentPiece.id[0]) {
            lightUpSquares.add(uprightCoordinate);
          }
        } else {
          lightUpSquares.add(uprightCoordinate);
        }
      }
      // a single downward movement
      if ((down[0] + 1) <= 8) {
        const downCoordinate = (down[0] + 1) + ',' + down[1];
        // check if piece in downCoordinate
        if (this.state.pieces[squares[downCoordinate].id]) {
          // check if piece has the same color as the king/currentPiece
          if (this.state.pieces[squares[downCoordinate].id].id[0] !== currentPiece.id[0]) {
            lightUpSquares.add(downCoordinate);
          }
        } else {
          lightUpSquares.add(downCoordinate);
        }
        const downleftCoordinate = (down[0] + 1) + ',' + (down[1] - 1);
        // check if piece in downleftCoordinate
        if (this.state.pieces[squares[downleftCoordinate].id]) {
          // check if piece has the same color as the king/currentPiece
          if (this.state.pieces[squares[downleftCoordinate].id].id[0] !== currentPiece.id[0]) {
            lightUpSquares.add(downleftCoordinate);
          }
        } else {
          lightUpSquares.add(downleftCoordinate);
        }
        const downrightCoordinate = (down[0] + 1) + ',' + (down[1] + 1);
        // check if piece in downrightCoordinate
        if (this.state.pieces[squares[downrightCoordinate].id]) {
          // check if piece has the same color as the king/currentPiece
          if (this.state.pieces[squares[downrightCoordinate].id].id[0] !== currentPiece.id[0]) {
            lightUpSquares.add(downrightCoordinate);
          }
        } else {
          lightUpSquares.add(downrightCoordinate);
        }
      }
      // a single left movement
      if ((left[1] - 1) >= 1) {
        const leftCoordinate = (left[0] + ',' + (left[1] - 1));
        // check if piece in leftCoordinate
        if (this.state.pieces[squares[leftCoordinate].id]) {
          // check if piece has the same color as the king/currentPiece
          if (this.state.pieces[squares[leftCoordinate].id].id[0] !== currentPiece.id[0]) {
            lightUpSquares.add(leftCoordinate);
          }
        } else {
          lightUpSquares.add(leftCoordinate);
        }
      }
      // a single right movement
      if ((right[1] + 1) >= 1) {
        const rightCoordinate = (left[0] + ',' + (left[1] + 1));
        // check if piece in rightCoordinate
        if (this.state.pieces[squares[rightCoordinate].id]) {
          // check if piece has the same color as the king/currentPiece
          if (this.state.pieces[squares[rightCoordinate].id].id[0] !== currentPiece.id[0]) {
            lightUpSquares.add(rightCoordinate);
          }
        } else {
          lightUpSquares.add(rightCoordinate);
        }
      }
      // castling movement
      // white king
      if (this.state.whiteKingCanCastleLeft && (currentPiece.id[0] === 'W')) {
        // check for left path
        let firstLeftSquare = squares[left[0] + ',' + (left[1] - 1)];
        let secondLeftSquare = squares[left[0] + ',' + (left[1] - 2)];
        let thirdLeftSquare = squares[left[0] + ',' + (left[1] - 3)];
        if ((!this.state.pieces[firstLeftSquare.id]) && (!this.state.pieces[secondLeftSquare.id]) && (!this.state.pieces[thirdLeftSquare.id])) {
          lightUpSquares.add(left[0] + ',' + (left[1] - 1));
          lightUpSquares.add(left[0] + ',' + (left[1] - 2));
        }
      }
      // check for right path
      if (this.state.whiteKingCanCastleRight && (currentPiece.id[0] === 'W')) {
        let firstRightSquare = squares[right[0] + ',' + (right[1] + 1)];
        let secondRightSquare = squares[right[0] + ',' + (right[1] + 2)];
        if ((!this.state.pieces[firstRightSquare.id]) && (!this.state.pieces[secondRightSquare.id])) {
          lightUpSquares.add(left[0] + ',' + (left[1] + 1));
          lightUpSquares.add(left[0] + ',' + (left[1] + 2));
        }
      }
      // black king
      if (this.state.blackKingCanCastleLeft && (currentPiece.id[0] === 'B')) {
        // check for left path
        let firstLeftSquare = squares[left[0] + ',' + (left[1] - 1)];
        let secondLeftSquare = squares[left[0] + ',' + (left[1] - 2)];
        let thirdLeftSquare = squares[left[0] + ',' + (left[1] - 3)];
        if ((!this.state.pieces[firstLeftSquare.id]) && (!this.state.pieces[secondLeftSquare.id]) && (!this.state.pieces[thirdLeftSquare.id])) {
          lightUpSquares.add(left[0] + ',' + (left[1] - 1));
          lightUpSquares.add(left[0] + ',' + (left[1] - 2));
        }
      }
      // check for right path
      if (this.state.blackKingCanCastleRight && (currentPiece.id[0] === 'B')) {
        let firstRightSquare = squares[right[0] + ',' + (right[1] + 1)];
        let secondRightSquare = squares[right[0] + ',' + (right[1] + 2)];
        if ((!this.state.pieces[firstRightSquare.id]) && (!this.state.pieces[secondRightSquare.id])) {
          lightUpSquares.add(left[0] + ',' + (left[1] + 1));
          lightUpSquares.add(left[0] + ',' + (left[1] + 2));
        }
      }
      lightUpSquares.forEach(coordinate => {
        if (currentPiece.id[0] === 'W') {
          if (this.state.forbidingSquaresForWhiteKing.has(coordinate)) {
            lightUpSquares.delete(coordinate);
          }
        }
        if (currentPiece.id[0] === 'B') {
          if (this.state.forbidingSquaresForBlackKing.has(coordinate)) {
            lightUpSquares.delete(coordinate);
          }
        }
      })
    }
    if (currentPiece.alias === '') {
      let whitePawn = coordinates.map(el => parseInt(el));
      let blackPawn = coordinates.map(el => parseInt(el));
      let movement;
      // light up current position
      lightUpSquares.add(coordinates);
      // case 1: starting position
      if ((currentPiece.id[0] === 'W') && (currentPiece.coordinates[0] === '7')) {
        movement = (whitePawn[0] - 1) + ',' + whitePawn[1];
        if (!this.state.pieces[squares[movement].id]) {
          lightUpSquares.add(movement.toString());
        }
        movement = whitePawn[0] - 2 + ',' + whitePawn[1];
        if (!this.state.pieces[squares[movement].id]) {
          lightUpSquares.add(movement.toString());
        }
      }
      if ((currentPiece.id[0] === 'B') && (currentPiece.coordinates[0] === '2')) {
        movement = (blackPawn[0] + 1) + ',' + whitePawn[1];
        if (!this.state.pieces[squares[movement].id]) {
          lightUpSquares.add(movement.toString());
        }
        movement = (blackPawn[0] + 2) + ',' + whitePawn[1];
        if (!this.state.pieces[squares[movement].id]) {
          lightUpSquares.add(movement.toString());
        }
      }
      // case 2: if pawn had previously moved 
      if ((currentPiece.id[0] === 'W') && (currentPiece.coordinates[0] !== '7') && (currentPiece.coordinates[0] >= 2)) {
        movement = (whitePawn[0] - 1) + ',' + whitePawn[1];
        if (!this.state.pieces[squares[movement].id]) {
          lightUpSquares.add(movement.toString());
        }
      }
      if ((currentPiece.id[0] === 'B') && (currentPiece.coordinates[0] !== '2') && (currentPiece.coordinates[0] <= 7)) {
        movement = (blackPawn[0] + 1) + ',' + whitePawn[1];
        if (!this.state.pieces[squares[movement].id]) {
          lightUpSquares.add(movement.toString());
        }
      }
      // pawn capturing
      if (currentPiece.id[0] === 'W') {
        // check for top diagonal (topleft and topright) squares
        const topRightSquare = squares[(whitePawn[0] - 1) + ',' + (whitePawn[1] + 1)];
        if (topRightSquare) {
          // console.log(topRightSquare.id)
          // check if piece in top right square
          if (this.state.pieces[topRightSquare.id]) {
            // console.log('a piece found')
            // check if piece does not have the same color as current pawn
            if (this.state.pieces[topRightSquare.id].id[0] !== currentPiece.id[0]) {
              const s = (whitePawn[0] - 1) + ',' + (whitePawn[1] + 1);
              lightUpSquares.add(s);
            }
          }
        }
        const topLeftSquare = squares[(whitePawn[0] - 1) + ',' + (whitePawn[1] - 1)];
        if (topLeftSquare) {
          // check if piece in top right square
          if (this.state.pieces[topLeftSquare.id]) {
            // check if piece does not have the same color as current pawn
            if (this.state.pieces[topLeftSquare.id].id[0] !== currentPiece.id[0]) {
              const s = (whitePawn[0] - 1) + ',' + (whitePawn[1] - 1);
              lightUpSquares.add(s);
            }
          }
        }
      }
      if (currentPiece.id[0] === 'B') {
        // check for bottom diagonal (bottomleft and bottomright) squares
        const bottomRightSquare = squares[(whitePawn[0] + 1) + ',' + (whitePawn[1] + 1)];
        if (bottomRightSquare) {
          // console.log(bottomRightSquare.id)
          // check if piece in bottom right square
          if (this.state.pieces[bottomRightSquare.id]) {
            // console.log('a piece found')
            // check if piece does not have the same color as current pawn
            if (this.state.pieces[bottomRightSquare.id].id[0] !== currentPiece.id[0]) {
              const s = (whitePawn[0] + 1) + ',' + (whitePawn[1] + 1);
              lightUpSquares.add(s);
            }
          }
        }
        const bottomLeftSquare = squares[(whitePawn[0] + 1) + ',' + (whitePawn[1] - 1)];
        if (bottomLeftSquare) {
          // check if piece in bottom right square
          if (this.state.pieces[bottomLeftSquare.id]) {
            // check if piece does not have the same color as current pawn
            if (this.state.pieces[bottomLeftSquare.id].id[0] !== currentPiece.id[0]) {
              const s = (whitePawn[0] + 1) + ',' + (whitePawn[1] - 1);
              lightUpSquares.add(s);
            }
          }
        }
      }
      // en passant capturing
      if (currentPiece.id[0] === 'W') {
        if (currentPiece.coordinates[0] === '4') {
          // check for top left and right en passant pawn
          let xCoordinate = parseInt(currentPiece.coordinates[2]);
          let squareFiles = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
          if ((xCoordinate - 1) >= 1) {
            // check if recent movement is a left pawn push
            let m = squareFiles[xCoordinate - 2] + 7 + '-' + squareFiles[xCoordinate - 2] + 5;
            if (this.state.recentPawnPush === m) {
              lightUpSquares.add(3 + ',' + (xCoordinate - 1));
            }
          }
          if ((xCoordinate + 1) <= 8) {
            // check if recent movement is a right pawn push
            let m = squareFiles[xCoordinate] + 7 + '-' + squareFiles[xCoordinate] + 5;
            if (this.state.recentPawnPush === m) {
              lightUpSquares.add(3 + ',' + (xCoordinate + 1));
            }
          }
        }
      }
      if (currentPiece.id[0] === 'B') {
        if (currentPiece.coordinates[0] === '5') {
          // check for top left and right en passant pawn
          let xCoordinate = parseInt(currentPiece.coordinates[2]);
          let squareFiles = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
          if ((xCoordinate - 1) >= 1) {
            // check if recent movement is a left pawn push
            let m = squareFiles[xCoordinate - 2] + 2 + '-' + squareFiles[xCoordinate - 2] + 4;
            if (this.state.recentPawnPush === m) {
              lightUpSquares.add(6 + ',' + (xCoordinate - 1));
            }
          }
          if ((xCoordinate + 1) <= 8) {
            // check if recent movement is a right pawn push
            let m = squareFiles[xCoordinate] + 2 + '-' + squareFiles[xCoordinate] + 4;
            if (this.state.recentPawnPush === m) {
              lightUpSquares.add(6 + ',' + (xCoordinate + 1));
            }
          }
        }
      }
    }
    for (let cordinate of lightUpSquares) {
      squares[cordinate].light = true
    }
    this.setState({ squares: squares, lightUpSquares: lightUpSquares });
  }
  getInitSquarePosition = (square, piece) => {
    this.setState({ currentPiece: piece, currentSquare: square });
    this.hilightLegalSquares(piece);
  }
  dropOrCancelHilight = (index, coordinates, square) => {
    const { pieces, currentPiece, squares } = this.state;
    // console.log(currentPiece)
    if (currentPiece) {
      this.dropPiece(index, coordinates, square);
      let updadetedSquares = {};
      for (let square in squares) {
        squares[square].color = false;
        updadetedSquares[square] = squares[square];
      }
      this.setState({ squares: updadetedSquares, currentPiece: null });
    }
  }
  render() {
    const squaresOnBoard = Object.keys(this.state.squares).map((key, index) => {
      const square = this.state.squares[key];
      let piece = null;
      if (this.state.pieces[square.id]) {
        let canDrag = false;
        if (this.state.pieces[square.id].id[0] === this.state.turn) {
          canDrag = true;
        }
        piece = <Piece getInitSquarePosition={(ref) => this.getInitSquarePosition(square, this.state.pieces[square.id])}
          piece={this.state.pieces[square.id].piece}
          movePiece={() => this.movePiece(this.state.pieces[square.id], square)} />;
        // piece = <Piece canDrag={canDrag} getInitSquarePosition={() => this.getInitSquarePosition(square, this.state.pieces[square.id])}
        //   id={this.state.pieces[square.id].id}
        //   movePiece={() => this.movePiece(this.state.pieces[square.id], square)} />;
      }
      let allowDrop = false;
      if (this.state.lightUpSquares) {
        if (this.state.lightUpSquares.has(key) && (square !== this.state.currentSquare)) {
          allowDrop = true;
        }
      }
      return (<Square key={square.id} dropPiece={() => this.dropPiece(square.id, square.coordinates, square)} allowDrop={allowDrop}
        light={square.light} dropOrCancelHilight={() => this.dropOrCancelHilight(square.id, square.coordinates, square)}
        control={square.control} id={square.id}  >
        {piece}
      </Square>)
    })
    let movesController = 0;
    let moves = this.state.moves.map((move, i) => {
      if ((i + 1) % 2 === 1) {
        movesController++;
      }
      return (
        <span key={i}>
          {((i + 1) % 2 === 1) ? <span style={{ marginRight: 5 }}>{movesController}</span> : null}
          <span style={{ marginRight: 10 }}>{move}</span>
        </span>
      )
    })
    moves = (
      <div>
        {moves}
      </div>
    )
    return (
      <div className='container'>
        <DndProvider backend={HTML5Backend}>
          <div>
            <div ref={this.myref} className="App">
              <div className="Board">
                {squaresOnBoard}
              </div>

              <div className="analysis">
                {moves}
              </div>
            </div>
            <br /><br /><br />
            <div className="Dnd">
              <Exp selectedItem={(id) => this.setState({ selectedItem: id })} items={this.state.items} />
              <Target mouseMove={e => this.mouseMove(e)} droppedItem={this.state.droppedItem} placeItem={this.placeItem} deleteItem={this.deleteItem} />

            </div>
          </div>
        </DndProvider>
      </div>
    );
  }
}

export default App;

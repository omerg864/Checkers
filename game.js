
var board;
var turn = 1;
var data = {name1: "Player1", name2: "player2", eaten1: 0, eaten2: 0}
var eaten1 = document.getElementById("eaten1");
var eaten2 = document.getElementById("eaten2");

const resetBoard = () => {
    turn = 1;
    board = [[0,1,0,1,0,1,0,1],
            [1,0,1,0,1,0,1,0],
            [0,1,0,1,0,1,0,1],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [2,0,2,0,2,0,2,0],
            [0,2,0,2,0,2,0,2],
            [2,0,2,0,2,0,2,0]];
    let player1Tag = document.getElementById("player1");
    let player1TagHTML = document.createElement("h4");
    player1TagHTML.id = "name1";
    player1TagHTML.innerHTML = data.name1;
    player1Tag.appendChild(player1TagHTML);
    let player2Tag = document.getElementById("player2");
    let player2TagHTML = document.createElement("h4");
    player2TagHTML.id = "name2";
    player2TagHTML.innerHTML = data.name2;
    player2Tag.appendChild(player2TagHTML);
    eaten1.innerHTML = data.eaten1;
    eaten2.innerHTML = data.eaten2;
    let GameBoard = document.getElementById("board");
    for(let i=0; i < 8;i++) {
        let row = document.createElement("div");
        row.className = "board-row";
        for(let j=0; j< 8; j++) {
            let spot = document.createElement("div");
            spot.id = i + "-" + j;
            if( i % 2 == 0) {
                if(j % 2 == 0) {
                    spot.className = "spot black";
                } else {
                    spot.className = "spot white";
                }
            } else {
                if(j % 2 == 0) {
                    spot.className = "spot white";
                } else {
                    spot.className = "spot black";
                }
            }
            if(board[i][j] == 1) { 
                // black piece
                let piece = document.createElement("div");
                piece.className = "piece black-piece clickable";
                piece.addEventListener("click", selectPiece);
                spot.appendChild(piece);
            }else if(board[i][j] == 2) {
                // white piece
                let piece = document.createElement("div");
                piece.className = "piece red-piece";
                spot.appendChild(piece);
            } else {
                spot.innerHTML = "&nbsp;";
            }
            row.appendChild(spot);
        }
        GameBoard.appendChild(row);
    }
}

const switchTurn = () => {
    turn = turn == 1 ? 2 : 1;
    let pointer1 = document.getElementById("pointer1");
    let pointer2 = document.getElementById("pointer2");
    let redPieces = document.getElementsByClassName("red-piece");
    let blackPieces = document.getElementsByClassName("black-piece");
    if (turn == 2) {
        for(let i=0; i< redPieces.length; i++) {
            redPieces[i].classList.add("clickable");
            redPieces[i].addEventListener("click", selectPiece);
        }
        for(let i=0; i< blackPieces.length; i++) {
            blackPieces[i].classList.remove("clickable");
            blackPieces[i].removeEventListener("click", selectPiece);
        }
        pointer1.classList.add("opacity-0");
        pointer2.classList.remove("opacity-0");
    } else {
        for(let i=0; i< redPieces.length; i++) {
            redPieces[i].classList.remove("clickable");
            redPieces[i].removeEventListener("click", selectPiece);
        }
        for(let i=0; i< blackPieces.length; i++) {
            blackPieces[i].classList.add("clickable");
            blackPieces[i].addEventListener("click", selectPiece);
        }
        pointer1.classList.remove("opacity-0");
        pointer2.classList.add("opacity-0");
    }

    canMove();
}

const movableAreas = (row, col, king) => {
    // TODO add king support
    // TODO add eating multiple support
    let movable = [];
    if(turn == 1) {
        if(!king) {
            if(row != 7) {
                if(col != 0) {
                    if(board[row+1][col-1] == 0) {
                        movable.push({row: row+1, col: col-1, color: "green", eating: []});
                    } else if(col > 1 && row < 6 && board[row+1][col-1] == 2 && board[row+2][col-2] == 0) {
                        movable.push({row: row + 2, col: col - 2, color: "red", eating: [[row+1, col-1]]});
                    }
                }
                if(col != 7) {
                    if(board[row+1][col+1] == 0) {
                        movable.push({row: row + 1, col: col + 1, color: "green", eating: []});
                    } else if(col < 6 && row < 6 && board[row+1][col+1] == 2 && board[row+2][col+2] == 0) {
                        movable.push({row: row + 2, col: col + 2, color: "red" , eating: [[row+1, col+1]]});
                    }
                }
            }
        }
    } else {
        if(!king) {
            if(row != 0) {
                if(col != 0) {
                    if(board[row - 1][col-1] == 0) {
                        movable.push({row: row - 1, col: col - 1, color: "green", eating: []});
                    } else if(col > 1 && row > 1 && board[row - 1][col-1] == 1 && board[row - 2][col-2] == 0) {
                        movable.push({row: row - 2, col: col - 2, color: "red", eating: [[row-1, col-1]]});
                    }
                }
                if(col != 7) {
                    if(board[row - 1][col+1] == 0) {
                        movable.push({row: row - 1, col: col + 1, color: "green", eating: 0});
                    } else if(col < 6 && row > 1 && board[row - 1][col+1] == 1 && board[row - 2][col+2] == 0) {
                        movable.push({row: row - 2, col: col + 2, color: "red", eating: [[row-1, col+1]]});
                    }
                }
            }
        }
    }
    console.log(row + " " + col);
    console.log(movable);
    return movable;
}


const canMove = () => {
    let glowing = document.getElementsByClassName("glowing");
    while(glowing.length > 0) {
        glowing[0].classList.remove("glowing");
    }
    let pieces;
    if(turn == 1) {
        pieces = document.getElementsByClassName("black-piece");
        
    } else {
        pieces = document.getElementsByClassName("red-piece");
    }
    for(let i=0; i< pieces.length; i++) {
        let movable = false;
        let king = false;
        let piece = pieces[i];
        let row = parseInt(piece.parentElement.id.split("-")[0]);
        let col = parseInt(piece.parentElement.id.split("-")[1]);
        if (piece.classList.contains("king")) {
            king = true;
        }
        movable = movableAreas(row, col, king).length > 0 ? true : false;
        if(movable) {
            piece.parentElement.classList.add("glowing");
        }
    }
}

const selectPiece = (event) => {
    let selected = document.getElementsByClassName("glowing-yellow");
    if(selected.length > 0) {
        console.log(selected);
        let piece = selected[0].firstChild;
        let king = false;
        if(piece.classList.contains("king")) {
            king = true;
        }
        let row = parseInt(selected[0].id.split("-")[0]);
        let col = parseInt(selected[0].id.split("-")[1]);
        let movableSpots = movableAreas(row, col, king);
        removeGlowing(movableSpots);
        let movable = movableSpots.length > 0 ? true : false;
        if(movable) {
            selected[0].classList.add("glowing");
        }
        selected[0].classList.remove("glowing-yellow");
    }
    event.stopPropagation();
    let piece = event.target;
    let row = parseInt(piece.parentElement.id.split("-")[0]);
    let col = parseInt(piece.parentElement.id.split("-")[1]);
    let movable = piece.parentElement.classList.contains("glowing");
    console.log(row + " " + col);
    piece.parentElement.classList.remove("glowing");
    piece.parentElement.classList.add("glowing-yellow");
    if(movable) {
        let movableSpots = movableAreas(row, col, piece.classList.contains("king"));
        for(let i=0; i< movableSpots.length; i++) {
            let spot = document.getElementById(movableSpots[i].row + "-" + movableSpots[i].col);
            spot.classList.add(`glowing-${movableSpots[i].color}`);
            spot.addEventListener("click", move);
        }
    }
}

const removeGlowing = (movableSpots) => {
    for(let i=0; i< movableSpots.length; i++) {
        let spot = document.getElementById(movableSpots[i].row + "-" + movableSpots[i].col);
        if(spot.classList.contains("glowing-green")) {
            spot.classList.remove("glowing-green");
        } else {
            spot.classList.remove("glowing-red");
        }
        spot.removeEventListener("click", move);
    }
}

const move = (event) => {
    let selected = document.getElementsByClassName("glowing-yellow");
    let piece = selected[0].firstChild;
    let row = parseInt(selected[0].id.split("-")[0]);
    let col = parseInt(selected[0].id.split("-")[1]);
    let movableSpots = movableAreas(row, col, piece.classList.contains("king"));
    let spot = event.target;
    let newRow = parseInt(spot.id.split("-")[0]);
    let newCol = parseInt(spot.id.split("-")[1]);
    let indexMove = -1;
    for(let i=0; i< movableSpots.length; i++) {
        if(movableSpots[i].row == newRow && movableSpots[i].col == newCol) {
            indexMove = i;
            break;
        }
    }
    if(indexMove != -1) {
        let newSpot = document.getElementById(newRow + "-" + newCol);
        newSpot.innerHTML = "";
        newSpot.appendChild(piece);
        selected[0].classList.remove("glowing-yellow");
        board[row][col] = 0;
        board[newRow][newCol] = turn;
        if(newSpot.classList.contains("glowing-red")) {
            for(let i=0; i< movableSpots[indexMove].eating.length; i++) {
                let eaten = document.getElementById(movableSpots[indexMove].eating[i][0] + "-" + movableSpots[indexMove].eating[i][1]);
                eaten.innerHTML = "";
                board[movableSpots[indexMove].eating[i][0]][movableSpots[indexMove].eating[i][1]] = 0;
            }
            data["eaten" + turn] += movableSpots[indexMove].eating.length;
            eaten1.innerHTML = data.eaten1;
            eaten2.innerHTML = data.eaten2;
        }
        console.log(data);
        removeGlowing(movableSpots);
        if(turn == 1) {
            if(newRow == 7) {
                piece.classList.add("king");
            }
        } else {
            if(newRow == 0) {
                piece.classList.add("king");
            }
        }
        switchTurn();
    }
}


const main = () => {
    resetBoard();
    canMove();
}

main();
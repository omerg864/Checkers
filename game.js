//Data
var board;
var turn = 1;
const turnOpp = {1: 2, 2: 1}
const redImage = "red.png";
const blackImage = "black.png";
var data = {name1: "Player1", name2: "player2", eaten1: 0, eaten2: 0}
var player1 = localStorage.getItem("player-name-1");
var player2 = localStorage.getItem("player-name-2");
var teamColor1 = localStorage.getItem("team-color-1");
var teamColor2 = localStorage.getItem("team-color-2");


const eaten1 = $("#eaten1");
const eaten2 = $("#eaten2");
const GameBoard = $("#board")
const pointer1 = $("#pointer1");
const pointer2 = $("#pointer2");
const player1Tag = $("#name1");
const player2Tag = $("#name2");
const openModal = $("#openModal");
const modalTitle = $("#modalTitle");
const modalBody = $("#modalBody");



const removeBoard = () => {
    document.getElementById("closeModal").click();
    GameBoard.html("");
    player1Tag.html("");
    player2Tag.html("");
    if (pointer1.hasClass("opacity-0")) {
        pointer1.removeClass("opacity-0");
        pointer2.addClass("opacity-0");
    }
    if(teamColor1=="black")
    {
        data = {name1: player1, name2: player2, eaten1: 0, eaten2: 0};
    }
    else if(teamColor2=="black")
    {
        data = {name1: player2 , name2: player1, eaten1: 0, eaten2: 0};
    }




    eaten1.html(data.eaten1);
    eaten2.html(data.eaten2);
}

const resetBoard = () => {
    removeBoard();
    turn = 1;
    board = [[0,1,0,1,0,1,0,1],
        [1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [2,0,2,0,2,0,2,0],
        [0,2,0,2,0,2,0,2],
        [2,0,2,0,2,0,2,0]];
    player1Tag.html(data.name1);
    player2Tag.html(data.name2);
    eaten1.html(data.eaten1);
    eaten2.html(data.eaten2);
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
                let image = document.createElement("img");
                image.src = blackImage;
                image.classList.add("piece-icon");
                piece.appendChild(image);
                spot.appendChild(piece);
            }else if(board[i][j] == 2) {
                // white piece
                let piece = document.createElement("div");
                piece.className = "piece red-piece";
                let image = document.createElement("img");
                image.src = redImage;
                image.classList.add("piece-icon");
                piece.appendChild(image);
                spot.appendChild(piece);
            } else {
                spot.innerHTML = "&nbsp;";
            }
            row.appendChild(spot);
        }
        GameBoard.append(row);
    }
    canMove();
}

const switchTurn = () => {
    turn = turn == 1 ? 2 : 1;
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
        pointer1.addClass("opacity-0");
        pointer2.removeClass("opacity-0");

    } else {
        for(let i=0; i< redPieces.length; i++) {
            redPieces[i].classList.remove("clickable");
            redPieces[i].removeEventListener("click", selectPiece);
        }
        for(let i=0; i< blackPieces.length; i++) {
            blackPieces[i].classList.add("clickable");
            blackPieces[i].addEventListener("click", selectPiece);
        }
        pointer1.addClass("opacity-0");
        pointer2.removeClass("opacity-0");
    }
    canMove();
    checkWinLoseTie();
}

const movableAreas = (row, col, king, tempBoard) => {
    let movable = [];
    if(turn == 1 || king) {
        if(row != 7) {
            if(col != 0) {
                if(board[row+1][col-1] == 0) {
                    movable.push({row: row+1, col: col-1, color: "green", eating: [], movements: [[row+1, col-1]]});
                } else if(col > 1 && row < 6 && tempBoard[row+1][col-1] == turnOpp[turn] && board[row+2][col-2] == 0) {
                    let newBoard = createTempBoard(tempBoard);
                    newBoard[row+1][col-1] = 0;
                    let anotherMove = movableAreas(row + 2, col - 2, king, newBoard).filter(move => {
                        return move.color == "red"
                    });
                    for(let i = 0 ;i < anotherMove.length; i++) {
                        anotherMove[i].eating.push([row + 1, col - 1]);
                        anotherMove[i].movements.push([row + 2, col - 2]);
                        movable.push(anotherMove[i]);
                    }
                    movable.push({row: row + 2, col: col - 2, color: "red", eating: [[row + 1, col - 1]], movements: [[row + 2, col - 2]]});
                }
            }
            if(col != 7) {
                if(board[row+1][col+1] == 0) {
                    movable.push({row: row + 1, col: col + 1, color: "green", eating: [], movements:[[row + 1, col + 1]]});
                } else if(col < 6 && row < 6 && tempBoard[row+1][col+1] == turnOpp[turn] && board[row+2][col+2] == 0) {
                    let newBoard = createTempBoard(tempBoard);
                    newBoard[row + 1][col + 1] = 0;
                    let anotherMove = movableAreas(row + 2, col + 2, king, newBoard).filter(move => {
                        return move.color == "red"
                    });
                    for(let i = 0 ;i < anotherMove.length; i++) {
                        anotherMove[i].eating.push([row + 1, col + 1]);
                        anotherMove[i].movements.push([row + 2, col + 2]);
                        movable.push(anotherMove[i]);
                    }
                    movable.push({row: row + 2, col: col + 2, color: "red" , eating: [[row+1, col+1]], movements: [[row + 2, col + 2]]});
                }
            }
        }
    }
    if(turn == 2 || king) {
        if(row != 0) {
            if(col != 0) {
                if(board[row - 1][col-1] == 0) {
                    movable.push({row: row - 1, col: col - 1, color: "green", eating: [], movements: [[row - 1, col - 1]]});
                } else if(col > 1 && row > 1 && tempBoard[row - 1][col-1] == turnOpp[turn] && board[row - 2][col-2] == 0) {
                    let newBoard = createTempBoard(tempBoard);
                    newBoard[row - 1][col - 1] = 0;
                    let anotherMove = movableAreas(row - 2, col - 2, king, newBoard).filter(move => {
                        return move.color == "red"
                    });
                    for(let i = 0 ;i < anotherMove.length; i++) {
                        anotherMove[i].eating.push([row-1, col-1]);
                        anotherMove[i].movements.push([row - 2, col - 2]);
                        movable.push(anotherMove[i]);
                    }
                    movable.push({row: row - 2, col: col - 2, color: "red", eating: [[row-1, col-1]], movements: [[row - 2, col - 2]]});
                }
            }
            if(col != 7) {
                if(board[row - 1][col+1] == 0) {
                    movable.push({row: row - 1, col: col + 1, color: "green", eating: 0, movements: [[row - 1, col + 1]]});
                } else if(col < 6 && row > 1 && tempBoard[row - 1][col+1] == turnOpp[turn] && board[row - 2][col + 2] == 0) {
                    let newBoard = createTempBoard(tempBoard);
                    newBoard[row - 1][col + 1] = 0;
                    let anotherMove = movableAreas(row - 2, col + 2, king, newBoard).filter(move => {
                        return move.color == "red"
                    });
                    for(let i = 0 ;i < anotherMove.length; i++) {
                        anotherMove[i].eating.push([row - 1, col + 1]);
                        anotherMove[i].movements.push([row - 2, col + 2]);
                        movable.push(anotherMove[i]);
                    }
                    movable.push({row: row - 2, col: col + 2, color: "red", eating: [[row-1, col+1]], movements: [[row - 2, col + 2]]});
                }
            }
        }
    }

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
        let piece = pieces[i];
        if(!piece.classList.contains("piece-eaten")) {
            let movable = false;
            let king = false;
            let row = parseInt(piece.parentElement.id.split("-")[0]);
            let col = parseInt(piece.parentElement.id.split("-")[1]);
            if (piece.classList.contains("king")) {
                king = true;
            }
            movable = movableAreas(row, col, king, createTempBoard(board)).length > 0 ? true : false;
            if(movable) {
                piece.parentElement.classList.add("glowing");
            }
        }
    }
}

const createTempBoard = (tb) => {
    let temp = []
    for(let i = 0 ; i < tb.length; i++) {
        let tempRow = [];
        for(let j = 0 ; j < tb[i].length; j++) {
            tempRow.push(tb[i][j]);
        }
        temp.push(tempRow);
    }
    return temp;
}

const selectPiece = (event) => {
    event.stopPropagation();
    event.preventDefault();
    let selected = document.getElementsByClassName("glowing-yellow");
    if(selected.length > 0) {
        let piece = selected[0].firstChild;
        let king = false;
        if(piece.classList.contains("king")) {
            king = true;
        }
        let row = parseInt(selected[0].id.split("-")[0]);
        let col = parseInt(selected[0].id.split("-")[1]);
        let movableSpots = movableAreas(row, col, king, createTempBoard(board));
        removeGlowing(movableSpots);
        let movable = movableSpots.length > 0 ? true : false;
        if(movable) {
            selected[0].classList.add("glowing");
        }
        selected[0].classList.remove("glowing-yellow");
    }
    let piece = event.target;
    if (piece.tagName.toLowerCase() == "img") {
        piece = piece.parentElement;
    }
    let row = parseInt(piece.parentElement.id.split("-")[0]);
    let col = parseInt(piece.parentElement.id.split("-")[1]);
    let movable = piece.parentElement.classList.contains("glowing");
    piece.parentElement.classList.remove("glowing");
    piece.parentElement.classList.add("glowing-yellow");
    if(movable) {
        let movableSpots = movableAreas(row, col, piece.classList.contains("king"), createTempBoard(board));
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

const checkWinLoseTie = () => {
    let movable = document.getElementsByClassName("glowing");
    if(data.eaten1==12) {
        modalTitle.html(`${data.name1} Wins!`);
        modalBody.html(`${data.name1} has eaten 12 pieces. to restart the game click on the restart button`);
        openModal.click();
    } else if(data.eaten2==12) {
        modalTitle.html(`${data.name2} Wins!`);
        modalBody.html(`${data.name2} has eaten 12 pieces. to restart the game click on the restart button`);
        openModal.click();
    }else if(movable.length == 0) {

        if(data.eaten1 > data.eaten2) {
            modalTitle.html(`${data.name1} Wins!`);
            modalBody.html(`${data.name1} has eaten 12 pieces. to restart the game click on the restart button`);
        } else if(data.eaten1 < data.eaten2) {
            modalTitle.html(`${data.name2} Wins!`);
            modalBody.html(`${data.name2} has eaten 12 pieces. to restart the game click on the restart button`);
        } else {
            modalTitle.html (`Tie!`);
            modalBody.html(`Both players ran out of plays to play`);
        }
        openModal.click();
    }
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

const animateMove = async (movements, piece, currentX, currentY) => {
    let newSpot;
    piece.classList.add("opacity-0");

    let color;
    if( turn == 1) {
        color = "black";
    } else {
        color = "red";
    }
    for(let i = movements.length - 1; i >= 0; i--) {
        let movement = movements[i];
        newSpot = document.getElementById(movement[0] + "-" + movement[1]);
        newSpot.innerHTML = "";
        let tempSpot = document.createElement("div");
        tempSpot.id = "tempSpot";
        tempSpot.style.position = "absolute"
        let tempPiece = document.createElement("div");
        tempSpot.className = "spot";
        let dim = newSpot.getBoundingClientRect();
        tempSpot.style.width = dim.width + "px";
        tempSpot.style.height = dim.height + "px";
        tempPiece.classList = piece.classList;
        let image = document.createElement("img");
        if(tempPiece.classList.contains("king")) {
            image.src = `${color}King.png`;
        } else {
            image.src = `${color}.png`;
        }
        image.classList.add("piece-icon");
        tempPiece.appendChild(image);
        tempPiece.classList.remove("opacity-0");
        tempSpot.appendChild(tempPiece);
        tempSpot.style.left = currentX + "px";
        tempSpot.style.top = currentY + "px";
        GameBoard.append(tempSpot);
        let newX = newSpot.offsetLeft;
        let newY = newSpot.offsetTop;
        tempSpot.style.left = newX + "px";
        tempSpot.style.top = newY + "px";
        currentX = newX;
        currentY = newY;
        await sleep(1000);
        tempSpot.remove();
    }
    newSpot.appendChild(piece);
    piece.classList.remove("opacity-0");
}

const goToHome = () => {
    window.location.href = 'HomePage.html';
}

const removeAllClass = (className) => {
    let removing= document.getElementsByClassName(className);
    while(removing.length > 0){
        removing[0].classList.remove(className);
    }
}

const showBoardIdle = () => {
    let pieces = document.getElementsByClassName("piece");
    for(let i = 0;i < pieces.length;i++) {
        pieces[i].removeEventListener("click", selectPiece);
    }
    removeAllClass("clickable");
    removeAllClass("glowing");
    removeAllClass("glowing-red");
    removeAllClass("glowing-yellow");
    removeAllClass("glowing-green");
}

const move = async (event) => {
    let selected = document.getElementsByClassName("glowing-yellow");
    if (!selected.length) {
        return;
    }
    let piece = selected[0].firstChild;
    let row = parseInt(selected[0].id.split("-")[0]);
    let col = parseInt(selected[0].id.split("-")[1]);
    let movableSpots = movableAreas(row, col, piece.classList.contains("king"), createTempBoard(board));
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
        let currentX = selected[0].offsetLeft;
        let currentY = selected[0].offsetTop;
        let movements = movableSpots[indexMove].movements;
        animateMove(movements, piece, currentX, currentY);
        let newSpot = document.getElementById(`${movements[movements.length - 1][0]}-${movements[movements.length - 1][1]}`)
        selected[0].classList.remove("glowing-yellow");
        board[row][col] = 0;
        board[newRow][newCol] = turn;
        let total = 1000;
        if(newSpot.classList.contains("glowing-red")) {

            let multi = 1;
            for(let i = movableSpots[indexMove].eating.length - 1; i >= 0; i--) {
                console.log(movableSpots[indexMove].eating[i]);
                let eatenSpot = document.getElementById(movableSpots[indexMove].eating[i][0] + "-" + movableSpots[indexMove].eating[i][1]);
                let eaten = eatenSpot.firstChild;
                eaten.classList.add("piece-eaten");
                if(i === movableSpots[indexMove].eating.length - 1) {
                    eaten.classList.add("opacity-0");
                    setTimeout(() => {
                        eatenSpot.innerHTML = "";
                    }, 1000);
                } else {
                    setTimeout(() => {
                        eaten.classList.add("opacity-0");
                        setTimeout(() => {
                            eatenSpot.innerHTML = "";
                        }, 1000);
                    }, 1000 * multi);
                    total = 1000 * multi + 1000;
                    multi++;
                }
                board[movableSpots[indexMove].eating[i][0]][movableSpots[indexMove].eating[i][1]] = 0;
            }
            data["eaten" + turn] += movableSpots[indexMove].eating.length;
            eaten1.html(data.eaten1);
            eaten2.html(data.eaten2);
        }
        showBoardIdle();
        await sleep(total);
        if((turn == 1 && newRow == 7) || (turn == 2 && newRow == 0)) {
            makeKing(piece);
        }
        switchTurn();
    }
}

const makeKing = (piece) => {
    if (!piece.classList.contains("king")) {
        piece.classList.add("king");
        let color;
        if( turn == 1) {
            color = "black";
        } else {
            color = "red";
        }
        piece.firstChild.src = `${color}King.png`;
    }
}


const main = () => {
    resetBoard();
}

main();
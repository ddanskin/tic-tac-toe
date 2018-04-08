const wins = [
    [0,1,2],
    [0,3,6],
    [0,4,8],
    [1,4,7],
    [2,4,6],
    [2,5,8],
    [3,4,5],
    [6,7,8],
  ];

let squares = [0,1,2,3,4,5,6,7,8];
let turnNumber;
let p2Computer;
let p1Turn;
let player1;
let player2;

newGame();

function newGame(){
    turnNumber = 1;
    $('.welcome, .set_players').each(function(){
        $(this).addClass('show');
        $(this).removeClass('hide');
    });
    $('.set_markers, .game, .game_over').each(function(){
        $(this).addClass('hide');
        $(this).removeClass('show');
    });
}

function vsComp(p){
    p2Computer = p;
    $('.set_players').each(function() {
        $(this).addClass('hide');
        $(this).removeClass('show');
    });
    $('.set_markers').each(function(){
        $(this).addClass('show');
        $(this).removeClass('hide');
    });
}

function start(isX){
    $('.welcome', '.set_markers').each(function(){
        $(this).addClass('hide');
        $(this).removeClass('show');
    });
    $('.game').each(function(){
        $(this).style.display = 'flex';
    });
    
    if(isX == 'X'){
        player1 = 'X';
        player2 = 'O';
        p1Turn = true;
    } else {
        player1 = 'O';
        player2 = 'X';
        p1Turn = false;
    }
    nextTurn();
}

function move(s){
    if(squares[s] != 'X' && squares[s] != 'O') {
        squares[s] = p1Turn ? player1 : player2;
        $(s).innerHTML = p1Turn ? player1 : player2;
        p1Turn = !p1Turn;
        turnNumber++;
        let winner = gameWinner(squares);
        if(winner){
            $('.game').each(function(){
                $(this).addClass('hide');
                $(this).removeClass('hide');
            });
            $('.game_over').each(function() {
                $(this).addClass('show');
                $(this).removeClass('hide');
            });
            $('h1.game_over').innerHTML = 'Game Over: ' + winner + ' won!';
        } else if (turnNumber < 10) {
            nextTurn();
        } else {
            $('.game').each(function(){
                $(this).addClass('hide');
                $(this).removeClass('hide');
            });
            $('.game_over').each(function() {
                $(this).addClass('show');
                $(this).removeClass('hide');
            });
            $('h1.game_over').innerHTML ='Game Over: Tied Game!';
        }
    }
}

function nextTurn(){
    $('h2.player').innerHTML = p1Turn ? 'Player 1' : 'Player 2';
    $('h2.player').style.background = p1Turn ? '#7fff00' : '#ff1493';
    if(p1Turn == false && p2Computer){
        aiMove(squares);
    }
}

function openSpaces(board){
    return board.filter(space => space !== 'X' && space !== 'O' );
}

function getBestScore(board, player, availableSquares, depth) {
    let aSquares = availableSquares.slice(0);
    let moveScores = [];
    let playerA = player;
    depth = depth + 1;
    for (let i = 0; i < aSquares.length; i++){
        let currentBoard = board.slice(0);
        let m = aSquares[i];
        currentBoard[m] = playerA;
        let score = 0;
        let winner = gameWinner(currentBoard);
        if(winner == playerA){
            score = 10;
        } else if(winner != null){
	        score = 0;
        } else {
            let playerB = (playerA == player1) ? player2 : player1;
            let openSquares = aSquares.filter(space => space != m);
            let nextM = getBestScore(currentBoard, playerB, openSquares, depth);
            score = nextM.score * -1;
        }
        score = score - depth;
        moveScores.push({m, score});
    }
    moveScores = moveScores.sort(function(a, b){ return b.score-a.score;});
    return moveScores[0];
}

function aiMove(board) {
    let testBoard = board.slice(0);
    let openS = openSpaces(board);
    let depth = 0;
    let bestMove = getBestScore(testBoard, player2, openS, depth).m;
  
    move(bestMove);    
      
}

function gameWinner(board){
    for (let i = 0; i < wins.length; i++) {
        if (board[wins[i][0]] && board[wins[i][0]] == board[wins[i][1]] && board[wins[i][0]] == board[wins[i][2]]){
            return board[wins[i][0]];
        }
    }
    if(openSpaces(board).length === 0) {
        return false;
    }
    return null;
}

function restart(){
    for (let i = 0; i < squares.length; i++){
        $(i).innerHTML = '';
        squares[i] = i;
    }
    newGame();
}

$('.restart').click(restart());

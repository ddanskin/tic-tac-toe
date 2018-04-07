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
var squares = [0,1,2,3,4,5,6,7,8];
var turnNumber;
var p2Computer;
var p1Turn;
var player1;
var player2;
newGame();
function newGame(){
  turnNumber = 1;
  document.getElementById('welcome').style.display = 'inline-block';
  document.getElementById('nPlayers').style.display = 'inline-block';
  document.getElementById('xOrO').style.display = 'none';
  document.getElementById('game').style.display = 'none';
  document.getElementById('end').style.display = 'none';
}
function vsComp(p){
  p2Computer = p;
  document.getElementById('nPlayers').style.display = 'none';
  document.getElementById('xOrO').style.display = 'inline-block';
}
function start(isX){
  document.getElementById('welcome').style.display = 'none';
  document.getElementById('xOrO').style.display = 'none';
  document.getElementById('game').style.display = 'flex';
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
    document.getElementById(s).innerHTML = p1Turn ? player1 : player2;
    p1Turn = !p1Turn;
    turnNumber++;
    let winner = gameWinner(squares);
    if(winner){
      document.getElementById('game').style.display = 'none';
      document.getElementById('end').style.display = 'inline-block';
      document.getElementById('endM').innerHTML ='Game Over: ' + winner + ' won!';
    }else if (turnNumber < 10){
      nextTurn();
    } else {
      document.getElementById('game').style.display = 'none';
      document.getElementById('end').style.display = 'inline-block';
      document.getElementById('endM').innerHTML ='Game Over: Tied Game!';
    }
  }
}
function nextTurn(){
  document.getElementById('currentPlayer').innerHTML = p1Turn ? 'Player 1' : 'Player 2';
  document.getElementById('currentPlayer').style.background = p1Turn ? '#7fff00' : '#ff1493';
  if(p1Turn == false && p2Computer){
    aiMove(squares);
  }
}
function openSpaces(board){
  return board.filter(space => space !== 'X' && space !== 'O' );
}
function getBestScore(board, player, availableSquares, depth) {
  var aSquares = availableSquares.slice(0);
  var moveScores = [];
  var playerA = player;
  depth = depth + 1;
  for (var i = 0; i < aSquares.length; i++){
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
  var testBoard = board.slice(0);
  var openS = openSpaces(board);
  var depth = 0;
  var bestMove = getBestScore(testBoard, player2, openS, depth).m;
  
  move(bestMove);    
      
}
function gameWinner(board){
  for (var i = 0; i < wins.length; i++) {
    if (board[wins[i][0]] && board[wins[i][0]] == board[wins[i][1]] && board[wins[i][0]] == board[wins[i][2]]){
      return board[wins[i][0]];
    };
  }
  if(openSpaces(board).length === 0) {
    return false;
  }
  return null;
}
function restart(){
  for (var i = 0; i < squares.length; i++){
    document.getElementById(i).innerHTML = '';
    squares[i] = i;
  }
  newGame();
}
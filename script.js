/*
Tine evidenta daca e  0 sau X
*/
var origBoard;

/*
Playerul
*/
const huPlayer = 'O';
/*
Artifficial Inteligence : Algoritmu minimax
*/
const aiPlayer = 'X';

/*
Array  of arrays - de pozitii castigatoare
*/ 

const winCombos = [

	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]

]

/*
Selectam clasa cell
*/
const cells = document.querySelectorAll('.cell');
/*
Functia care da startul jocului
*/
startGame();

function startGame() {
	/*
	Selectam iconita de endgame la 'none' ca sa nu apara
	dupa ce dam restart la joc
	*/
	document.querySelector(".endgame").style.display = "none"; ///selectam clasa endgame
	    
	/*
	Un mod elegant de a seta un array cu valori de la 0 -> 8
	*/                                                       
	origBoard = Array.from(Array(9).keys());
    /*
    parcurgem celulele
    remove all the X's and 0's
    */

	for (var i = 0; i < cells.length; i++) {
	/*
	accesam textul si ii atribuim ''
	*/
    cells[i].innerText = ''; 
    /*
    La restart , dam remove la propietatea care coloreaza celula
    */
	cells[i].style.removeProperty('background-color');
	/*
	De fiecare daca cand dam click pe o celula se apeleaza turnClick
	*/
	cells[i].addEventListener('click', turnClick, false);
	}
}

function turnClick(square) {
	/*
	Pentru verificare sa vedem daca returneaza id-ul celulei
	*console.log(square.target.id); 

	* OrigBoard este un array = {0 , 1 , 2 ,3 ..}
	  in momentul cand se apeleaza functia turn()
	  un index se transforma in X / 0.
	* In urmatoare instructiune verificam daca tipul elementul origBoard
	 este un numar ,ca sa nu mai putem da click inca odata 
	 pe acea celula.
	*/

	if (typeof origBoard[square.target.id] == 'number') {

		turn(square.target.id, huPlayer)
     /*

     *Daca checkTie == true atunci este remiza
     *Daca nu s-a castigat sau este remix Basic Ai muta

     */
		if ( !checkWin(origBoard, huPlayer) && ! checkTie()){

			turn( bestSpot() , aiPlayer);
			 }

	}
}

function turn( squareId , player ) {
	/*
	Atribuim in array - ul origBoard pe pozitia squareId  Player 'O'
	*/
	origBoard[squareId] = player;
	/*
	Modificam text contentu elementelul cu id-ul squareId cu Player 'O'
	*/
	document.getElementById(squareId).innerText = player;
	/*
     Verificam daca am castigat
	*/
	let gameWon = checkWin(origBoard, player)


	if (gameWon) 
		gameOver(gameWon)
}

function checkWin(board, player) {
	/*
	Gaseste fiecare index pe care jucatorul l-a jucat
	a - accumulator
	e - element
	i - index 
	e == player => concat i  to []
	else return a (accumulator)(nu adaugam nimic)
	plays => toate pozitiile pe care jucatorul le-a jucat
	*/
	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);

	let gameWon = null;

	/*
	index = indicii = { 0 , 1 , 2 ,3 };
	win = array [ 0 , 1 ,2 ]  index 0
	 			[ 3 , 4 ,5 ]  index 1
	 			....

	*/
	for (let [index, win] of winCombos.entries()) {
		/*
		Fiecare element dintr-un win [0 , 1 , 2] ...
		A jucat jucatorul pe fiecare dintre pozitiile castigatoare?
		*/
		if (win.every(elem => plays.indexOf(elem) > -1)) 
		{   /*
			gameWon un obiect cu index si player 
	        Index:indica ce fel de combinatie este castigatoare
	        Player: Jucatorul care a castigat
			*/
			gameWon = {index: index, player: player};

			break;
		}
	}
	return gameWon;
}
	/*
	Functia are ca parametru gameWon un obiect
	*/
function gameOver(gameWon) {
	/*
	Evidentiem castigatorul , combinatia care a castigat

	*/
	for (let index of winCombos[gameWon.index]) {

		document.getElementById(index).style.backgroundColor =
			gameWon.player == huPlayer ? "blue" : "red";

	}
	/*
	Anulam event Listener-ul ca sa nu putem da click pe nicio celula
	*/
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	/*
	Depinde de castigator transmitem functie declareWinner "You win"
	/ "You lose"
	*/
	declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose.");
}

function declareWinner(who) {
	/*
	Setam display 'block' ca sa apara iconita
	*/
	document.querySelector(".endgame").style.display = "block";
    /*
    Modificam contentul textului clasei 'text' cu , castigatorul
    */
	document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
	/*
	Filtram fiecare element din origBoard sa vedem daca sunt numere.
	*/
	return origBoard.filter(s => typeof s == 'number');


}

function bestSpot() {
	/*
	returnam indexu algoritmului Minimax.
	*/
	return minimax(origBoard, aiPlayer).index;
}

function checkTie() {
    /*
    Fiecare celula e umpluta iar nimeni nu a castigat (Tie)
    */
	if (emptySquares().length == 0) {

		for (var i = 0; i < cells.length; i++) {
			/*
			Evidentiem fiecare celula cu verde 
			*/
			cells[i].style.backgroundColor = "green";
			/*
			Eliminam propietatea de a apasa pe celula
			*/
			cells[i].removeEventListener('click', turnClick, false);
		}
		/*
		True daca este remiza
		*/
		declareWinner("Tie Game!")
		return true;
	}
	return false;
}


function minimax(newBoard, player)
 {
	var availSpots = emptySquares(newBoard);
   /*
   Vericam daca s-a castigat
   */
	if (checkWin(newBoard, huPlayer)) {
		return {score: -10};

	} else if (checkWin(newBoard, aiPlayer)) {

		return {score: 10};
    /*
    Nu mai sunt celule goale in care sa joci
    */
	} else if (availSpots.length === 0) {

		return {score: 0};
	}
    /*
     Colectezi scorul pentru fiecare celula goala ca sa le poti
     evalua mai incolo

    */
    /*
    Array in care memoram mutarile
    */
	var moves = [];
    /*
    Parcurgem availSpots ca sa colectam indexul si scorul

    */
	for (var i = 0; i < availSpots.length; i++) {
		/*
		obiect in care memoram indexul si scorul
		*/
		var move = {};
		/*
		Setam propietatea index al obiectului move cu
		newBoard[availSpots[i]] - celula goala din new board care
		este de tip numar
		*/
		move.index = newBoard[availSpots[i]];

		/*
		pe locu gol punem player
		*/
		newBoard[availSpots[i]] = player;
		/*
		Daca e randul Ai atunci apelam recursiv minimax 
		*/
		if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer);
			/*
			punem scoru in object ca sa tinem evidenta
			*/
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}
   /*
   Algoritmul returneaza cel mai bun obiect

   */
	return moves[bestMove];
}
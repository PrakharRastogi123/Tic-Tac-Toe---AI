// 6 parts.

window.onload = function() {//execute this function when window loads
	//Part1. Initial states

	var num;//holds our canvas number,range(1 to 9)
	var box;//holds canvas block that was clicked
	var ctx;//canvas context variable
	var turn=1;
	var filled;//holds whether the canvas box visited(marked) or not.
	var symbol;//hold current state of our tictactoe board in form of 1d array.eg, ['X','O','O','','','X','O','X,'']
	var winner;
	var gameOver = false;
	var human = 'X';
	var ai = 'O';
	var result = {};
	filled = new Array();
	symbol = new Array();
	winner = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
	for(var i=0;i<9;i++){
		filled[i] = false;
		symbol[i] = '';
	}
	//newGame-event and function
	var n = document.getElementById("new");//'n' gets the new game Button element
	n.addEventListener("click",newGame);//create an event which calls"newGame",when you click button

	//Reload page
	function newGame(){
		document.location.reload();
	}
	//Canvas click and retrieving the box's number
	//Canvas click event--

	/*Retrieving tic(consist of 9 canvases) element*/
	document.getElementById("tic").addEventListener("click",function(e){
		boxClick(e.target.id);/*.target retrieves element that was clicked , here it will retrieve its id(canvas4)*/
	});

	//Part2.Drawing X's and O's
	//Draw X
	function drawX(){
		box.style.backgroundColor = "#fb5181";
		ctx.beginPath();

		ctx.moveTo(15,15);
		ctx.lineTo(85,85);
		ctx.moveTo(85,15);
		ctx.lineTo(15,85);

		ctx.lineWidth = 21;
		ctx.lineCap = "round";//end of the line will be round
		ctx.strokeStyle = "white";
		ctx.stroke();

		ctx.closePath();
		symbol[num-1]=human;//num-1 is indexing to 0-type ,and set curr symbol to X

	}
	//Draw  O
	function drawO(next){
		box.style.backgroundColor="#93f273";
		ctx.beginPath();

		ctx.arc(50,50,35,0,2*Math.PI);//centre(50,50), arc degree 0 to 2pi
		ctx.lineWidth=20;
		ctx.strokeStyle="white";
		ctx.stroke();

		ctx.closePath();
		symbol[next]=ai;
	}
	//Part3. Winner check function
	function winnerCheck(symbol,player){
		for(var j=0;j<winner.length;j++){
			if(symbol[winner[j][0]]==player && symbol[winner[j][1]]==player && symbol[winner[j][2]]==player){
				return true;
			}
		}
		return false; 
	}
	//Part4.Box click function :- human playing
	function boxClick(numId){
		box=document.getElementById(numId);
		ctx=box.getContext("2d");
		switch(numId){
			case "canvas1":num=1;
						   break;
			case "canvas2":num=2;
						   break;
			case "canvas3":num=3;
						   break;
			case "canvas4":num=4;
						   break;
			case "canvas5":num=5;
						   break;
			case "canvas6":num=6;
						   break;
			case "canvas7":num=7;
						   break;
			case "canvas8":num=8;
						   break;
			case "canvas9":num=9;
						   break;			   			   			   			   			   			   			   
		}
		if(filled[num-1] === false){
			if(gameOver === false){
				if(turn%2 !== 0){// Human turn
					drawX();
					turn++;
					filled[num-1]=true;
					if(winnerCheck(symbol,symbol[num-1])===true){
						document.getElementById("result").innerText="Player '"+symbol[num-1]+"'won!";// -- + 'X' + --
						gameOver=true;
					}
					if(turn>9 && gameOver !== true){
						document.getElementById("result").innerText="GAME OVER! IT WAS A DRAW!";
						return;
					}
					if(turn%2==0){
						playAI();
					}
				}
			}
			else{
				alert("Game over.Please click the New Game to start again");
			}
		}
		else{
			alert("This box was already filled. Please click on another one.")
		}

	}
	//Part5.Find the empty boxes
	function emptyBoxes(newSymbol){
		var j = 0;
		var empty = [];/*contain indexes of ('')s in symbol array passed as newSymbol as current state of tic*/
		for(var i=0;i<newSymbol.length;i++){
			if(newSymbol[i]!=='X' && newSymbol[i]!=='O'){
				empty[j] = i;
				j++;
			}
		}
		return empty; //eg. [0,3,4,8]

	}
	//Part6.Making the AI play - playAI() and minimax()

	function playAI(){
		var nextMove = minimax(symbol,ai);//object that stores id of next move and score for next move acc. to minimax 
		var nextId = "canvas"+(nextMove.id + 1);//canvas + (0 to 8)+1
		box = document.getElementById(nextId);
		ctx = box.getContext("2d");
		if(gameOver === false){
			if(turn%2===0){//AI turn 
				drawO(nextMove.id);
				turn++;
				filled[nextMove.id]=true;
				//winnerCheck - ai wins
				if(winnerCheck(symbol,symbol[nextMove.id])===true){
					document.getElementById("result").innerText="Player '"+symbol[nextMove.id]+"'won!";// -- + 'X' + --
					gameOver=true;
				}
				//draw condn
				if(turn>9 && gameOver !== true){
						document.getElementById("result").innerText="GAME OVER! IT WAS A DRAW!";
						return;
				}
			}
		}
		else{
			alert("Game over.Please click the New Game to start again");
		}
	}
	//minimax function
	function minimax(newSymbol, player,alpha=-(Number.MIN_VALUE),beta=Number.MAX_VALUE){
		// a recurring function. computes scores deep through multiple levels
		 var empty= [];
		 empty = emptyBoxes(newSymbol);
		 //terminal base cases:
		 if(winnerCheck(newSymbol,human)===true){
		 	return {score:-10};//human wins
		 }
		 else if(winnerCheck(newSymbol,ai)==true){
		 	return {score:10};//ai wins;
		 }
		 else if(empty.length === 0){
		 	//at last turn someone may win.so check again for winners
		 	if(winnerCheck(newSymbol,human)===true){
		 		return  {score:-10};//human wins
		 	}
		 	else if(winnerCheck(newSymbol,ai)==true){
		 		return {score:10};//ai wins;
		 	}
			return{score:0};//game is draw
		 }
		//posMoves= their index and score values
		//If state is not terminal case(base case):-
		var posMoves = [];
		for(var i=0;i<empty.length;i++){
			//current move - index of current move,score of current move
			var curMove = {};
			//generate the new board with the current move
			curMove.id = empty[i];
			newSymbol[empty[i]] = player;

			if(player === ai){
				result = minimax(newSymbol, human,alpha,beta);// result holds index and score
				curMove.score = result.score;
			}
			else{
				result = minimax(newSymbol, ai,alpha,beta);// result holds index and score
				curMove.score = result.score;
			}
			newSymbol[empty[i]]='';//reset newSymbol , for next case. Its also a backtrack step. 
			posMoves.push(curMove);//eg. [{id: 1, score: -10}]

		}
		//calculate score of intermediate states - best move + score with respect to that player + return statement
		var bestMove;
		//Ai - max player (always chooses max score)
		//Human - min player (always chooses min score)
		if(player === ai){
			var highestScore = -1000;
			for(var j=0;j<posMoves.length;j++){
				if(posMoves[j].score > highestScore){
					highestScore=posMoves[j].score;
					bestMove = j;
					alpha=(highestScore>alpha)?highestScore:alpha;
					if(beta<=alpha){
						break;
					}
				}
			}
		}
		else{
			var lowestScore = 1000;
			for(var j=0;j<posMoves.length;j++){
				if(posMoves[j].score < lowestScore){
					lowestScore=posMoves[j].score;
					bestMove = j;
					beta=(lowestScore<beta)?lowestScore:beta;
					if(beta<=alpha){
						break;
					}

				}
			}
		}
		return posMoves[bestMove];//eg returns obj posMove[0]={id:4, score:10}
	}

};  
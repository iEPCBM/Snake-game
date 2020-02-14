/*
* Copyright 2020 Rishat Kagirov
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

$(document).ready (function () {
	"use strict";
	//Init canvas and CTX
	var snakeGame = document.getElementById("snakeGame");
	var snakeGameCTX = snakeGame.getContext("2d");

	//var gameHeight = Math.floor(snakeGame.height/(cellSize+cellMarginSize))-1;
	//var gameWidth = Math.floor(snakeGame.width/(cellSize+cellMarginSize))-1;

	var appleIterations = 0;
	var iterations = 0;

	walls = [];
	for (let i=0; i<gameHeight; i++) {
		walls.push(new Wall (0, i));
		walls.push(new Wall (gameWidth-1, i));
	}
	for (let i=0; i<gameWidth; i++) {
		walls.push(new Wall (i, 0));
		walls.push(new Wall (i, gameHeight-1));
	}

	//Init game functions
	//Play new game
	function newGame () {
		appleCreateFrequency = Math.round(Math.random()*appleCreateFrequencyMax)+1;
		snakes = [];
		snakes.push (new snake (Math.round(gameWidth/2),Math.round(gameHeight/2),3,0));
		gameOver = false;
		appleIterations = 0;
		iterations = 0;
		spawnApple();
	}

	function getPlayersSnake () {
		for (var i=0; i<snakes.length; i++) {
			if (snakes[i].isControl) {
				return snakes[i];
			}
		}
	}

	//Render game
	function renderGame () {
		snakeGameCTX.clearRect(0, 0, snakeGame.width, snakeGame.height);
		if (isMainMenu) {
			drawGrid (snakeGameCTX, gameWidth, gameHeight);
			//drawScoreData (snakeGameCTX);
			drawMainMenu (snakeGameCTX, snakeGame.width, snakeGame.height);
		} else {
			drawGrid (snakeGameCTX, gameWidth, gameHeight);
			//drawScoreData (snakeGameCTX);
			if (gameOver) {
				drawGameOver (snakeGameCTX, snakeGame.width, snakeGame.height)
			}
		}
		if (snakes.length){
			drawScore(snakeGameCTX, getPlayersSnake().score);
		}
	}
	renderGame ();

	//Event functions
	$(document).mousedown('', function(event) {
		lastDownTarget = event.target;
	}, false);
	$(document).keydown(function(event){
		let playersSnake = getPlayersSnake();
		if(lastDownTarget == snakeGame) {
			if (event.which === 13&&(isMainMenu||gameOver)) {
				isMainMenu = false;
				newGame ();
				mainSnakeGameLoop = setInterval (snakeGameLoop, stepTimeout);
			}
			else if (!isMainMenu&&!gameOver) {
				if (!canPress) return false;
				canPress = false;
				if ((event.which === 38||event.which === 87)&&playersSnake.dy == 0) {
					playersSnake.dy = -1;
					playersSnake.dx = 0;
				} else if ((event.which === 39||event.which === 68)&&playersSnake.dx == 0) {
					playersSnake.dx = 1;
					playersSnake.dy = 0;
				} else if ((event.which === 37||event.which === 65)&&playersSnake.dx == 0) {
					playersSnake.dx = -1;
					playersSnake.dy = 0;
				} else if ((event.which === 40||event.which === 83)&&playersSnake.dy == 0) {
					playersSnake.dy = 1;
					playersSnake.dx = 0;
				}
				if (event.which === 27) {
					isMainMenu = true;
				}
			}
			renderGame ();
		}
	});

	//Game loop
	function spawnApple () {
		let x=Math.round(Math.random()*gameWidth);
		let y=Math.round(Math.random()*gameHeight);
		let isFree = true;
		for (i=0; i<snakes.length; i++) {
			for (j=0; j<snakes[i].cells.length; j++) {
				if (snakes[i].cells[j].x==x&&snakes[i].cells[j].y==y) {
					isFree = false;
				}
			}
			for (j=0; j<snakes[i].apples.length; j++) {
				if (snakes[i].apples[j].x==x&&snakes[i].apples[j].y==y) {
					isFree = false;
				}
			}
		}
		for (i=0; i<walls.length; i++) {
			if (walls[i].x==x&&walls[i].y==y) {
				isFree = false;
			}
		}
		if (isFree) {
			//let healthApple = Math.floor(Math.random()*(appleMaxHealth-100))+100;
			for (i=0; i<snakes.length; i++) {
				snakes[i].apples.push (new apple (x, y, appleMaxHealth));
			}
		} else {
			spawnApple ();
		}
		appleCreateFrequency = Math.round(Math.random()*appleCreateFrequencyMax)+1;
		appleIterations=0;
	}
	function snakeGameLoop () {
		if (gameOver||isMainMenu) {
			clearInterval (mainSnakeGameLoop);
			return;
		}

		appleIterations++;
		iterations++;
		let appleDamage = Math.floor(Math.random()*5);
		for (var i=0; i<snakes.length; i++) {
			snakes[i].loop();
			for (var j=0; j<snakes[i].apples.length; j++) {
				snakes[i].apples[j].loop(appleDamage);
				if (snakes[i].apples[j].health<=0) {
					snakes[i].apples.splice(j,1);
				}
			}
		}
		if (appleIterations%appleCreateFrequency == 0) {
			spawnApple ();
		}
		let aliveSnakes = false;
		let aliveSnakesCount = 0;
		for (let i=0; i<snakes.length; i++) {
			if(snakes[i].gameOver==false) {
				aliveSnakes = true;
				aliveSnakesCount++;
			}
		}
		renderGame ();
		canPress = true;
	}
	//function

	//Classes
	function snakeCell (positionX, positionY) {
		this.x = positionX;
		this.y = positionY;
	}
	function snake (headX, headY, length, index) {
		this.apples = [];
		this.x = headX;
		this.y = headY;
		this.dx = 1;
		this.dy = 0;
		this.index = index;
		this.cells = [];
		this.snakeSize = length;
		this.isControl = true;
		this.gameOver = false;
		this.score = 0;
		this.iterations = 0;
		this.iterationsAteApple = 0;
		this.hasAction = false
		for (var i=0; i<length; i++) {
			if (this.dy>0) {
				this.cells.push (new snakeCell(this.x, this.y-i))
			}
			else if (this.dy<0) {
				this.cells.push (new snakeCell(this.x, this.y+i))
			}
			else if (this.dx>0) {
				this.cells.push (new snakeCell(this.x-i, this.y))
			}
			else if (this.dx<0) {
				this.cells.push (new snakeCell(this.x+i, this.y))
			}
		}
		this.loop = function () {
			if (!this.gameOver) {
				this.x += this.dx;
				this.y += this.dy;
				if (this.x < 0) {
					this.x = Math.floor(snakeGame.width/(cellSize+cellMarginSize))-1;
				}
				if (this.y < 0) {
					this.y = Math.floor(snakeGame.height/(cellSize+cellMarginSize))-1;
				}
				if (this.x > Math.floor(snakeGame.width/(cellSize+cellMarginSize))-1) {
					this.x = 0;
				}
				if (this.y > Math.floor(snakeGame.height/(cellSize+cellMarginSize))-1) {
					this.y = 0;
				}
				this.cells.unshift(new snakeCell(this.x, this.y));
				if (this.cells.length > this.snakeSize) {
					this.cells.pop();
				}
				for (var i=1; i<this.cells.length; i++) {
					if (this.x == this.cells[i].x && this.y == this.cells[i].y) {
						this.gameOver = true;
					}
				}
				for (var i=0; i<this.apples.length; i++) {
					if (this.x == this.apples[i].x && this.y == this.apples[i].y) {
						if (!this.apples[i].isBad()) {
							this.score += 10;
							this.iterationsAteApple=this.iterations;
							if (this.apples[i].health<=appleDangerThreshold) {
								this.score += 5;
							}
							this.apples.splice(i,1);
							this.snakeSize++;
						} else {
							this.gameOver = true;
						}
					}
				}
				for (var i=0; i<walls.length; i++) {
					if (this.x == walls[i].x && this.y == walls[i].y) {
						this.gameOver = true;
					}
				}
				if (this.gameOver&&this.isControl) {
					gameOver=true;
				}
				/*if (this.iterations-this.iterationsAteApple>=500) {
					this.gameOver=true;
				}*/
				this.iterations++;
			}
		}
	}

	function apple (positionX, positionY, health) {
		this.x = positionX;
		this.y = positionY;

		this.health = health;

		this.loop = function (damage) {
			if (this.health > 0) {
				this.health -= damage;
			}
		}
		this.isBad = function () {
			if (this.health <= appleBadThreshold) {
				return true;
			}
			return false;
		}
		this.isWarn = function () {
			if (this.health<=appleDangerThreshold&&!this.isBad()) {
				return true;
			}
			return false;
		}
	}
	function Wall (positionX, positionY) {
		this.x = positionX;
		this.y = positionY;
	}
});

function hasOwnProperty(obj, prop) {
    var proto = obj.__proto__ || obj.constructor.prototype;
    return (prop in obj) &&
        (!(prop in proto) || proto[prop] !== obj[prop]);
}

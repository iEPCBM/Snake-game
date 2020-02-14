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

function drawGrid (ctx, width, height) {
	var tmpCTX = ctx;
	width = width*(cellSize+cellMarginSize);
	height = height*(cellSize+cellMarginSize);
	ctx.fillStyle = backgroundColor;
	for (i=0; i<(Math.floor(height/(cellSize+cellMarginSize))); i++) {
		for (j=0; j<(Math.floor(width/(cellSize+cellMarginSize))); j++) {
			for (iSnake=0; iSnake<snakes.length; iSnake++) {
				for (iCell=0; iCell<snakes[iSnake].cells.length; iCell++) {
					if (snakes[iSnake].cells[iCell].x == j && snakes[iSnake].cells[iCell].y == i) {
						ctx.fillStyle = snakeColor;
					}
				}
				for (iApple=0; iApple<snakes[iSnake].apples.length; iApple++) {
					if (snakes[iSnake].apples[iApple].x == j && snakes[iSnake].apples[iApple].y == i) {
						if (snakes[iSnake].apples[iApple].isBad()) {
							ctx.fillStyle = wallColor;
						} else {
							if (snakes[iSnake].apples[iApple].health>appleDangerThreshold) {
								ctx.fillStyle = appleColor;
							} else {
								ctx.fillStyle = appleDangerColor;
							}
						}
					}
				}
			}
			for (iWall=0; iWall<walls.length; iWall++) {
				if (walls[iWall].x == j && walls[iWall].y == i) {
					ctx.fillStyle = wallColor;
				}
			}
			ctx.fillRect(j*(cellSize+cellMarginSize), i*(cellSize+cellMarginSize), cellSize, cellSize);
			ctx.fillStyle = backgroundColor;
		}
	}
	ctx = tmpCTX;
}

function drawScore (ctx, score) {
	var tmpCTX = ctx;
	ctx.fillStyle = UI_BG_Color;
	ctx.globalAlpha = 0.5;
	var wRect = 90+cellSize;
	var hRect = 30+cellSize;
	if (score.toString().length>4) {
		wRect += (score.toString().length-4)*8+15;
	}
	ctx.fillRect(0,0,wRect,hRect);
	ctx.globalAlpha = 1;
	ctx.font = 'bold 15px "Lato", sans-serif';
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillStyle = UI_TextColor;
    ctx.fillText("Score: "+score, cellSize+10, cellSize+5);
	ctx = tmpCTX;
}

function drawMainMenu (ctx, width, height) {
	var tmpCTX = ctx;
	var heightMenuBlock = Math.round(height/2);
	ctx.fillStyle = UI_BG_Color;
	ctx.globalAlpha = 0.6;
	ctx.fillRect(0, (height-heightMenuBlock)/2, width, heightMenuBlock);
	var basePosY = (height-heightMenuBlock)/2;

	//Draw text title
	ctx.globalAlpha = 1;
	ctx.font = 'bold 60px "Lato", sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = UI_TextColor;
    ctx.fillText("Snake game!", width/2, basePosY+25);

	//Draw desc
	ctx.font = '400 20px Lato, sans-serif';
    ctx.fillText("Press <ENTER> to start the game!", width/2, basePosY+100);
	ctx = tmpCTX;
}
function drawGameOver (ctx, width, height) {
	var tmpCTX = ctx;
	var heightMenuBlock = Math.round(height/2);
	ctx.fillStyle = UI_BG_Color;
	ctx.globalAlpha = 0.6;
	ctx.fillRect(0, (height-heightMenuBlock)/2, width, heightMenuBlock);
	var basePosY = (height-heightMenuBlock)/2;

	//Draw text
	ctx.globalAlpha = 1;
	ctx.font = 'bold 60px "Lato", sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = UI_GameOver_TextColor;
    ctx.fillText("GAME OVER", width/2, basePosY+25);

	//Draw desc
	ctx.font = '400 20px Lato, sans-serif';
		ctx.fillStyle = UI_TextColor;
    ctx.fillText("Press <ENTER> to play again!", width/2, basePosY+100);
	ctx = tmpCTX;
}

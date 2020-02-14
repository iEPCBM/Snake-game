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

var lastDownTarget;

var isMainMenu = true;
var gameOver = false;
var mainSnakeGameLoop;
var canPress = true;

var gameWidth = 58;
var gameHeight = 43;

var roundedRectRadius = 75;

var cellSize = 10;
var cellMarginSize = 1;
var gridSegmentSize = 10;
var gridStrokeWidth = 1;
var rows;
var columns;
var backgroundColor = "#DFF0FE";
var appleColor = "#FFF0A9";
var appleDangerColor = "#FFE35A";
var wallColor = "#BABABA";
var snakeColor = "#FFA9A9";
var appleDangerThreshold = 175;
var appleMaxHealth = 300;
var appleBadThreshold = 150
var stepTimeout = 75; //ms
var UI_BG_Color = "#CCC";
var UI_TextColor = "#777";
var UI_GameOver_TextColor = "#FF5A5A";

//Init game vars
var snakeWidth;
var appleCreateFrequency;
var appleCreateFrequencyMax = 15;
var maxApples;
var walls = [];
var snakes = [];
var stepsPlayed = 0;
var snakeCells = [];

var isDebug = false;
var debugSnakeIndex = 0;
var isDebugC = false;

var isIterationFitness = true;

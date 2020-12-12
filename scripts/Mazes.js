async function randomMaze(isWall,isWeight){
	inProgress = true;
	clearBoard(false, false);
		t=1;
	if(isWall){
		var visited = createDistancesPrevWalls(false,false,false,false,true,false);
		var walls = createDistancesPrevWalls(false,false,true,false,false,false);
		var weights = createDistancesPrevWalls(false,false,false,false,false,false);
		walls [ startCell[0] ][ startCell[1] ] = false;
	    walls [ endCell[0] ][ endCell[1] ] = false;
	}
	else if(isWeight){
	
	
		
		var visited = createDistancesPrevWalls(false,false,false,false,false,true)//createVisited1();
		var weights = createDistancesPrevWalls(false,false,false,true,false,false)//makeWeights();
		var walls = createDistancesPrevWalls(false,false,false,false,false,false);
		weights [ startCell[0] ][ startCell[1] ] = false;
	    weights [ endCell[0] ][ endCell[1] ] = false;
	}

	var cells = [ startCell, endCell ];
	visited[ startCell[0] ][ startCell[1] ] = true;
	visited[ endCell[0] ][ endCell[1] ] = true;

	while ( cells.length > 0 ){
		var random = Math.floor(Math.random() * cells.length);
		var randomCell = cells[random];
		cells[random] = cells[cells.length - 1];
		cells.pop();
		var neighbors = getNeighbors(randomCell[0], randomCell[1]);

		if(isWall){
			if (neighborsThatAreWallsAndWeights(neighbors, walls ,weights,true,false ) < 2){ continue; }
			walls[ randomCell[0] ][ randomCell[1] ] = false;
		}else if(isWeight) {
			if (neighborsThatAreWallsAndWeights(neighbors,walls, weights,false,true) < 2){ continue; }
		    weights[ randomCell[0] ][ randomCell[1] ] = false;
		}

		for (var k = 0; k < neighbors.length; k++){
			var i = neighbors[k][0];
			var j = neighbors[k][1];
			if (visited[i][j]){ continue; }
			visited[i][j] = true;
			cells.push([i, j]);
		}
    }
	var cells = $("#tableContainer").find("td");
	//function createWallOrWeight( isWall, walls, isWeight, weights) {
		for (var i = 0; i < totalRows; i++) {
			for (var j = 0; j < totalCols; j++) {
				if (isWall && (i == 0 || i == (totalRows - 1) || j == 0 || j == (totalCols - 1) || walls[i][j])) {
	
					cellsToAnimate.push([[i, j], "wall"]);
				}
				else if (isWeight && (i == 0 || i == (totalRows - 1) || j == 0 || j == (totalCols - 1) || weights[i][j])) {
					cellsToAnimate.push([[i, j], "weight"]);
				}
			}
		}
	// 	function createWallOrWeight( isWall, walls, isWeight, weights) {
	// 		for (var i = 0; i < totalRows; i++) {
	// 			for (var j = 0; j < totalCols; j++) {
	// 				if (isWall && (i == 0 || i == (totalRows - 1) || j == 0 || j == (totalCols - 1) || walls[i][j])) {
		
	// 					cellsToAnimate.push([[i, j], "wall"]);
	// 				}
	// 				else if (isWeight && (i == 0 || i == (totalRows - 1) || j == 0 || j == (totalCols - 1) || weights[i][j])) {
	// 					cellsToAnimate.push([[i, j], "weight"]);
	// 				}
	// 			}
	// 		}
			
	// 	}
		
	// //}
	
createWallOrWeight( isWall, walls, isWeight, weights);


	await animateCells();
	inProgress = false;
	return;
}



function createWallOrWeight( isWall, walls, isWeight, weights) {
	for (var i = 0; i < totalRows; i++) {
		for (var j = 0; j < totalCols; j++) {
			if (isWall && (i == 0 || i == (totalRows - 1) || j == 0 || j == (totalCols - 1) || walls[i][j])) {

				cellsToAnimate.push([[i, j], "wall"]);
			}
			else if (isWeight && (i == 0 || i == (totalRows - 1) || j == 0 || j == (totalCols - 1) || weights[i][j])) {
				cellsToAnimate.push([[i, j], "weight"]);
			}
		}
	}
	
}

async function spiralMaze(){
	inProgress = true;
	clearBoard(false, false);
	t=1;

	var length = 1;
	var direction = {
		"0": [-1, 1],  //northeast
		"1": [1, 1],   //southeast
		"2": [1, -1],  //southwest
		"3": [-1, -1], //northwest
	};
	var cell = [Math.floor(totalRows / 2), Math.floor(totalCols / 2)];
	while (inBounds(cell)){
		var i_increment = direction[length % 4][0];
		var j_increment = direction[length % 4][1];
		for (var count = 0; count < length; count++){
			var i = cell[0];
			var j = cell[1];
			cellsToAnimate.push( [[i, j], "wall"] );
			cell[0] += i_increment;
			cell[1] += j_increment;
			if (!inBounds(cell)){ break; }
		}
		length += 1;
	}
	await animateCells();
	inProgress = false;
	return;
}

function inBounds(cell){
	return (cell[0] >= 0 && cell[1] >= 0 && cell[0] < totalRows && cell[1] < totalCols);
}

async function recursiveDivMaze(bias){
	inProgress = true;
	clearBoard(false,false);
	t=1;

	//Animate edge walls
	createEdgeWalls();
	
	var walls = createDistancesPrevWalls(false,false,false,false,true,false)//createVisited();
	var passages = createDistancesPrevWalls(false,false,false,false,true,false)//createVisited();
	recursiveDivMazeHelper(1, (totalRows - 2), 1, (totalCols - 2), 2, (totalRows - 3), 2, (totalCols - 3), walls, passages, bias);
	await animateCells();
	inProgress = false;
	return;
}


function recursiveDivMazeHelper(iStart, iEnd, jStart, jEnd, horzStart, horzEnd, vertStart, vertEnd, walls, passages, bias){
	var height = iEnd - iStart + 1;
	var width = jEnd - jStart + 1;
	var canMakeVertWall = (vertEnd - vertStart) >= 0;
	var canMakeHorzWall = (horzEnd - horzStart) >= 0;
 	if (height < 3 || width < 3 || !canMakeVertWall | !canMakeHorzWall) { 
		return; 
	}
	// Choose line orientation
	var x = Math.floor(Math.random() * 10);
	if (bias == "VERTICAL"){
		var lineOrientation = x < 8 ? "VERTICAL" : "HORIZONTAL"; // weighting: 90/10 (V/H)
	} else if (bias == "HORIZONTAL"){
		var lineOrientation = x < 1 ? "VERTICAL" : "HORIZONTAL"; // weighting: 10/90 (V/H)
	} else { 
		var lineOrientation = x < 5 ? "VERTICAL" : "HORIZONTAL"; // weighting: 50/50 (V/H)
	}

	// Draw line and create random passage
	if (lineOrientation == "VERTICAL"){
		var vertWidth = vertEnd - vertStart + 1;
		var randCol = Math.floor(Math.random() * vertWidth) + vertStart;
		if (passages[iStart][randCol]){
			var randRow = iStart;
		} else if (passages[iEnd][randCol]){
			var randRow = iEnd;
		} else {
			var randRow = (Math.floor(Math.random() * 2) == 0) ? iStart: iEnd; // random end assignment
			//var randRow = Math.floor(Math.random() * height) + iStart; // random parition
		}
	
		createVerticalOrHorizontal(iStart, iEnd,  randRow , randCol, walls , passages, true );
		recursiveDivMazeHelper(iStart, iEnd, jStart, (randCol - 1), horzStart, horzEnd, vertStart, (randCol - 2), walls, passages); //left
		recursiveDivMazeHelper(iStart, iEnd, (randCol + 1), jEnd, horzStart, horzEnd, (randCol + 2), vertEnd, walls, passages); //right
	} else {
		var horzHeight = horzEnd - horzStart + 1;
		var randRow = Math.floor(Math.random() * horzHeight) + horzStart;
		if (passages[randRow][jStart]){
			var randCol = jStart;
		} else if (passages[randRow][jEnd]){
			var randCol = jEnd;
		} else {
			var randCol = (Math.floor(Math.random() * 2) == 0) ? jStart: jEnd; // random end assignment
			//var randCol = Math.floor(Math.random() * width) + jStart; // random parition
		}
		
		createVerticalOrHorizontal(jStart, jEnd,  randRow , randCol, walls , passages, false );
		recursiveDivMazeHelper(iStart, (randRow - 1), jStart, jEnd, horzStart, (randRow - 2), vertStart, vertEnd, walls, passages); //up
		recursiveDivMazeHelper((randRow + 1), iEnd, jStart, jEnd, (randRow + 2), horzEnd, vertStart, vertEnd, walls, passages); //down
	}
	return;
}

function createEdgeWalls() {
	for (var i = 0; i < totalRows; i++) {
		for (var j = 0; j < totalCols; j++) {
			if (i == 0 || j == 0 || i == (totalRows - 1) || j == (totalCols - 1)) {
				cellsToAnimate.push([[i, j], "wall"]);
			}
		}
	}
}

function createVerticalOrHorizontal( iStart, iEnd,  randRow , randCol, walls , passages, isVerOrHor){


	if( isVerOrHor){

		for (var i = iStart; i <= iEnd; i++){
			if ( passages[i][randCol] ){ continue; }
			if (i == randRow){
				// Make passages
				for (var j = randCol - 1; j <= randCol + 1; j++){
					passages[i][j] = true;}
			} else { 
				walls[i][randCol] = true;
				cellsToAnimate.push([ [i, randCol], "wall"]); }
		}
	}
	else{
          for (var j = iStart; j <= iEnd; j++){
			if ( passages[randRow][j] ){ continue; }
			if (j == randCol){
				// Make passages
				for (var i = randRow - 1; i <= randRow + 1; i++){
					passages[i][j] = true;}
			} else { 
				walls[randRow][j] = true; 
				cellsToAnimate.push([ [randRow, j], "wall"]);}
		}
	}
}
var objectCellsToAnimate = [];

function AStar(start, end , object) {

	if(algorithm == "Travelling SalesMan")  objectCellsToAnimate=[]
	var { myHeap, visited, pathFound, distances, prev, costs,cells } = initialise(start);
    pushToAnimateCells(start[0],start[1],"searching",object);
		
	while (!myHeap.isEmpty()){
		var cell = myHeap.getMin();
		var i = cell[1][0];
		var j = cell[1][1];
		if (visited[i][j]){ continue; }
		visited[i][j] = true;
		
		pushToAnimateCells(i,j,"visited",object);
		if(checkEnd(i,j,object,end)){pathFound=true; break;}  // checks ending condition (sensor)
		
		var neighbors = getNeighbors(i, j);
		for (var k = 0; k < neighbors.length; k++){
			var m = neighbors[k][0];
			var n = neighbors[k][1];
			if (visited[m][n]){ continue; }
			
			var newDistance = distances[i][j] + 1;
			if(cellIsAWallAndWeight(m,n,cells,false,true)) newDistance= distances[i][j] + 4;
		
			if (newDistance < distances[m][n]){
				distances[m][n] = newDistance;
				prev[m][n] = [i, j];
				pushToAnimateCells(m,n,"searching",object);
			}
			
			if(!object){ var newCost = distances[i][j] + Math.abs(end[0] - m) + Math.abs(end[1] - n);}
			else var newCost = distances[i][j] + Math.abs(object[0] - m) + Math.abs(object[1] - n);
		
			if (newCost < costs[m][n]){
				costs[m][n] = newCost;
				myHeap.push([newCost, [m, n]]);
			}
		}
	}
	nodesStillInHeap(myHeap,object, visited ); // Make any nodes still in the heap "visited"
	
	if (pathFound) {                                // If a path was found, illuminate it
		if(object) objectCellsToAnimate = fetchPath(objectCellsToAnimate,object,end,prev);
		else objectCellsToAnimate = fetchPath(objectCellsToAnimate,null,end,prev);
	}
	
    if(object) { AStar(object, end, null);}
	if(algorithm == "Travelling SalesMan") return objectCellsToAnimate;
	showPath();
	pathFound=true;
	return pathFound;
	
}

function DFS(i, j, visited){
	
	if (i == endCell[0] && j == endCell[1]){
		cellsToAnimate.push( [[i, j], "success"] );
		return true;
	}
	visited[i][j] = true;
	cellsToAnimate.push( [[i, j], "searching"] );
	var neighbors = getNeighbors(i, j);
	for(var k = 0; k < neighbors.length; k++){
		var m = neighbors[k][0];
		var n = neighbors[k][1]; 
		if ( !visited[m][n] ){
			var pathFound = DFS(m, n, visited);
			if ( pathFound ){
				cellsToAnimate.push( [[i, j], "success"] );
				return true;
			} 
		}
	}
	cellsToAnimate.push( [[i, j], "visited"] );
	return false;
}

// NEED TO REFACTOR AND MAKE LESS LONG
function BFS(start, end ,object){
	var pathFound = false;
	var myQueue = new Queue();
	var prev = createDistancesPrevWalls(false,true,false,false,false,false);
	var visited =  createDistancesPrevWalls(false,false,false,false,true,false);
	myQueue.enqueue( start );
	if(!object)  cellsToAnimate.push(start, "searching");
	else          cellsToAnimate.push(start, "searching2");

	visited[ start[0] ][ start[1] ] = true;
	while ( !myQueue.empty() ){
		var cell = myQueue.dequeue();
		var r = cell[0];
		var c = cell[1];
		if(object){
		cellsToAnimate.push( [cell, "visited"] );}
		else{
			cellsToAnimate.push( [cell, "visited2"] );
		}
		if(checkEnd(r,c,object,end)){pathFound=true; break;} 
		// Put neighboring cells in queue
		var neighbors = getNeighbors(r, c);
		for (var k = 0; k < neighbors.length; k++){
			var m = neighbors[k][0];
			var n = neighbors[k][1];
			if ( visited[m][n] ) { continue ;}
			visited[m][n] = true;
			prev[m][n] = [r, c];
			if(!object){
			cellsToAnimate.push( [neighbors[k], "searching"] );}
			else{ 
				cellsToAnimate.push( [neighbors[k], "searching2"] );
			}
			myQueue.enqueue(neighbors[k]);
		}
	}
	// Make any nodes still in the queue "visited"
	while ( !myQueue.empty() ){
		var cell = myQueue.dequeue();
		var r = cell[0];
		var c = cell[1];
		if(object){
			cellsToAnimate.push( [cell, "visited"] );}
			else{
				cellsToAnimate.push( [cell, "visited2"] );
			}
	}
	
	// If a path was found, illuminate it
	if (pathFound) {
		if(object)
		objectCellsToAnimate = fetchPath(objectCellsToAnimate,object,end,prev);
		else
		objectCellsToAnimate = fetchPath(objectCellsToAnimate,null,end,prev);
	}
	
	if(object) { BFS (object, end, null); }
	// objectCellsToAnimate.map(([r,c]) => cellsToAnimate.push( [[r, c], "success"] ));
	// objectCellsToAnimate= [];
	showPath();
	return pathFound;
}


function BidirectionalBFS(){
    var pathFound = false;
    var startQueue = new Queue();
    var endQueue = new Queue();

   // let visitArray = [];
   var visitedS =  createDistancesPrevWalls(false,false,false,false,true,false);
   var visitedE =  createDistancesPrevWalls(false,false,false,false,true,false);

   var prevS = createDistancesPrevWalls(false,true,false,false,false,false);
	var prevE = createDistancesPrevWalls(false,true,false,false,false,false);

    startQueue.enqueue(startCell);
    endQueue.enqueue(endCell);

    cellsToAnimate.push(startCell, "searching");
    cellsToAnimate.push(endCell,"searching");

    visitedS[ startCell[0] ][ startCell[1] ] = true;
    visitedE[ endCell[0] ][ endCell[1] ] = true;
    
    var intersectNode = [];
    while ( !startQueue.empty()   || !endQueue.empty() ){
			   
	        	var cellS = startQueue.dequeue();
                var a = cellS[0];
		        var b = cellS[1];
                cellsToAnimate.push( [[a,b], "visited" ]);
                var  neighborNodes = getNeighbors(a, b);
                for (var k=0; k<neighborNodes.length; k++){
                        var m = neighborNodes[k][0];
                        var n = neighborNodes[k][1];
                    if ( visitedS[m][n] ) { continue ;}
                    visitedS[m][n] = true;
                    prevS[m][n] = [a, b];
                 
					if(visitedE[m][n]) {intersectNode = [m,n];
						console.log(prevE[m][n]);
						pathFound= true;
                        break;}
                    cellsToAnimate.push( [neighborNodes[k], "searching"] );
                    startQueue.enqueue(neighborNodes[k])
					}
			  
                var  cell = endQueue.dequeue();
                var r = cell[0];
		        var c = cell[1];
                cellsToAnimate.push( [[r,c], "visited"] );
                
                var neighborNodes2 = getNeighbors(r, c);
                for(var k =0; k<neighborNodes2.length; k++){
                    
                    var m = neighborNodes2[k][0];
                        var n = neighborNodes2[k][1];
                    if ( visitedE[m][n] ) { continue ;}
                    visitedE[m][n] = true;

                    prevE[m][n] = [r, c];
                  
					if(visitedS[m][n]) {intersectNode = [m,n]; pathFound=true;
                        console.log("inter found i end"); 
                        break;}
                    cellsToAnimate.push( [neighborNodes2[k], "searching"] );
                    endQueue.enqueue(neighborNodes2[k]);
					}
                    if(pathFound) 
                    {   break;}
                }
               
                while ( !startQueue.empty() ){
                    var cell = startQueue.dequeue();
                    var l= cell[0];
                    var y = cell[1];
                    cellsToAnimate.push( [[l,y], "visited"] );
                }
                while ( !endQueue.empty() ){
                    var cell = endQueue.dequeue();
                    var l = cell[0];
                    var y = cell[1];
                    cellsToAnimate.push( [[l,y], "visited"] );
                }
           if(intersectNode != null){
           shortestPathBidirectional(startCell, endCell, intersectNode,prevS, prevE);  
                      }
                      		   return pathFound;
		   
           
        }
   
function shortestPathBidirectional(startNode, endNode, intersectNode, prevS, prevE){
  
    var nodeS = intersectNode;
    var nodeE = intersectNode;
        var r = intersectNode[0];
		var c = intersectNode[1];
		cellsToAnimate.push( [[r, c], "success"] );
	
    while( prevS[r][c] != null ){
        if(nodeS != startNode && prevS[r][c]!= null){
            var prevCell = prevS[r][c];
			r = prevCell[0];
			c = prevCell[1];
			cellsToAnimate.push( [[r, c], "success"] );

            nodeS = prevCell ;
		}
	}

	var r = intersectNode[0];
	var c = intersectNode[1];
     while(prevE[r][c]!= null){
        if(nodeE != endNode && prevE[r][c] != null){
            console.log("yahan");
            var prevCell = prevE[r][c];
			var r = prevCell[0];
            var c = prevCell[1];
            cellsToAnimate.push( [[r, c], "success"] );
            nodeE = prevCell;
        }
	 }
}



function dijkstra(start,end,object) {
	var { myHeap, visited, pathFound, distances, prev, costs,cells } = initialise(start);
	pushToAnimateCells(start[0],start[1],"searching",object);
		
	while (!myHeap.isEmpty()){
		var cell = myHeap.getMin();
		//console.log("Min was just popped from the heap! Heap is now: " + JSON.stringify(myHeap.heap));
		var i = cell[1][0];
		var j = cell[1][1];
		if (visited[i][j]){ continue; }
		visited[i][j] = true;
	
		pushToAnimateCells(i,j,"visited",object);
		//end cell defined above
		if(checkEnd(i,j,object,end)){pathFound=true; break;} 

		//get neighbour is a fnctn above
		var neighbors = getNeighbors(i, j);
		for (var k = 0; k < neighbors.length; k++){
			var m = neighbors[k][0];
			var n = neighbors[k][1];
			if (visited[m][n]){ continue; }
			var newDistance = distances[i][j] + 1;
			if(cellIsAWallAndWeight(m,n,cells,false,true)){
                newDistance= distances[i][j] + 4;
			}
			if (newDistance < distances[m][n]){
				distances[m][n] = newDistance;
				prev[m][n] = [i, j];
				myHeap.push([newDistance, [m, n]]);
				//console.log("New cell was added to the heap! It has distance = " + newDistance + ". Heap = " + JSON.stringify(myHeap.heap));
			  //		cellsToAnimate.push( [[m, n], "searching"] );
			  pushToAnimateCells(m,n,"searching",object);
			}
		}
		//console.log("Cell [" + i + ", " + j + "] was just evaluated! myHeap is now: " + JSON.stringify(myHeap.heap));
	}
	//console.log(JSON.stringify(myHeap.heap));
	// Make any nodes still in the heap "visited"
	nodesStillInHeap (myHeap,object,visited);
	if (pathFound) {
		if(object) objectCellsToAnimate = fetchPath(objectCellsToAnimate,object,end,prev);
		else objectCellsToAnimate = fetchPath(objectCellsToAnimate,null,end,prev);
	}
	if(object){dijkstra(object,end, null)}
	if(algorithm == "Travelling SalesMan"){
		return objectCellsToAnimate;
	}
	showPath();
	return pathFound;
}

function jumpPointSearch() {
	var { myHeap, visited, pathFound, distances, prev, costs,cells } = initialise(startCell);
	var walls = createDistancesPrevWalls(false,false,false,false,true,false);
	cellsToAnimate.push([[startCell[0], startCell[1]], "searching"]);
	while (!myHeap.isEmpty()){
		var cell = myHeap.getMin();
		var i = cell[1][0];
		var j = cell[1][1];
		if (visited[i][j]){ continue; }
		visited[i][j] = true;
		cellsToAnimate.push([[i, j], "visited"]);
		if (i == endCell[0] && j == endCell[1]){
			pathFound = true;
			break;
		}
		var neighbors = pruneNeighbors(i, j, visited, walls);
		for (var k = 0; k < neighbors.length; k++){
			var m = neighbors[k][0];
			var n = neighbors[k][1];
			if (visited[m][n]){ continue; }
			var newDistance = distances[i][j] + Math.abs(i - m) + Math.abs(j - n);
			
			if (newDistance < distances[m][n]){
				distances[m][n] = newDistance;
				prev[m][n] = [i, j];
				cellsToAnimate.push( [[m, n], "searching"] );
			}
			var newCost = distances[i][j] + Math.abs(endCell[0] - m) + Math.abs(endCell[1] - n);
			if (newCost < costs[m][n]){
				costs[m][n] = newCost;
				myHeap.push([newCost, [m, n]]);
			}
		}
	}
	// Make any nodes still in the heap "visited"
	while ( !myHeap.isEmpty() ){
		var cell = myHeap.getMin();
		var i = cell[1][0];
		var j = cell[1][1];

		if (visited[i][j]){ continue; }
		visited[i][j] = true;
		
		cellsToAnimate.push( [[i, j], "visited"] );
	}
	// If a path was found, illuminate it:
	if (pathFound) {
		var i = endCell[0];
		var j = endCell[1];
		cellsToAnimate.push( [endCell, "success"] );
	
		while (prev[i][j] != null){
			var prevCell = prev[i][j];
			x = prevCell[0];
			y = prevCell[1];
			// Loop through and illuminate each cell in between [i, j] and [x, y]
			// Horizontal
			if ((i - x) == 0){
				// Move right
				if (j < y){
					for (var k = j; k < y; k++){
						cellsToAnimate.push( [[i, k], "success"] );
					}
				// Move left
				} else {
					for (var k = j; k > y; k--){
						cellsToAnimate.push( [[i, k], "success"] );
					}
				}
			// Vertical
			} else {
				// Move down
				if (i < x){
					for (var k = i; k < x; k++){
						cellsToAnimate.push( [[k, j], "success"] );
					}
				// Move up
				} else {
					for (var k = i; k > x; k--){
						cellsToAnimate.push( [[k, j], "success"] );
					}
				}
			}
			i = prevCell[0];
			j = prevCell[1];
			cellsToAnimate.push( [[i, j], "success"] );
		}
	}
	return pathFound;
}

function pruneNeighbors(i, j, visited, walls){
	var neighbors = [];
	var stored = {};
	// Scan horizontally
	for (var num = 0; num < 2; num++){
		if (!num){
			var direction = "right";
			var increment = 1;
		} else {
			var direction = "left";
			var increment = -1;
		}
		for (var c = j + increment; (c < totalCols) && (c >= 0); c += increment){
			var xy = i + "-" + c;
			if (visited[i][c]){	break; }
			//Check if same row or column as end cell
			if ((endCell[0] == i || endCell[1] == c) && !stored[xy]){
				neighbors.push([i, c]);
				stored[xy] = true;
				continue;
			}
			// Check if dead end
			var deadEnd = !(xy in stored) && ((direction == "left" && (c > 0) && walls[i][c - 1]) || (direction == "right" && c < (totalCols - 1) && walls[i][c + 1]) || (c == totalCols - 1) || (c == 0));  
			if (deadEnd){
				neighbors.push([i, c]);
				stored[xy] = true;
				break;
			}
			//Check for forced neighbors
			var validForcedNeighbor = (direction == "right" && c < (totalCols - 1) && (!walls[i][c + 1])) || (direction == "left" && (c > 0) && (!walls[i][c - 1]));
			if (validForcedNeighbor){
				checkForcedNeighbor(i, c, direction, neighbors, walls, stored);
			}
		}
	}
	// Scan vertically
	for (var num = 0; num < 2; num++){
		if (!num){
			var direction = "down";
			var increment = 1;
		} else {
			var direction = "up";
			var increment = -1;
		}
		for (var r = i + increment; (r < totalRows) && (r >= 0); r += increment){
			var xy = r + "-" + j;
			if (visited[r][j]){	break; }
			if ((endCell[0] == r || endCell[1] == j) && !stored[xy]){
				neighbors.push([r, j]);
				stored[xy] = true;
				continue;
			}
			// Check if dead end
			var deadEnd = !(xy in stored) && ((direction == "up" && (r > 0) && walls[r - 1][j]) || (direction == "down" && r < (totalRows - 1) && walls[r + 1][j]) || (r == totalRows - 1) || (r == 0));  
			if (deadEnd){
				neighbors.push([r, j]);
				stored[xy] = true;
				break;
			}
			//Check for forced neighbors
			var validForcedNeighbor = (direction == "down" && (r < (totalRows - 1)) && (!walls[r + 1][j])) || (direction == "up" && (r > 0) && (!walls[r - 1][j]));
			if (validForcedNeighbor){
				checkForcedNeighbor(r, j, direction, neighbors, walls, stored);
			}
		}
	}
	return neighbors;
}


function checkForcedNeighbor(i, j, direction, neighbors, walls, stored){
	//console.log(JSON.stringify(walls));
	if (direction == "right"){
		var isForcedNeighbor = ((i > 0) && walls[i - 1][j] && (!walls[i - 1][j + 1])) || ((i < (totalRows - 1)) &&  walls[i + 1][j] && (!walls[i + 1][j + 1]));
		var neighbor = [i, j + 1];
	} else if (direction == "left"){
		var isForcedNeighbor = ((i > 0) && walls[i - 1][j] && !walls[i - 1][j - 1]) || ((i < (totalRows - 1)) && walls[i + 1][j] && !walls[i + 1][j - 1]);
		var neighbor = [i, j - 1];
	} else if (direction == "up"){
		var isForcedNeighbor = ((j < (totalCols - 1)) && walls[i][j + 1] && !walls[i - 1][j + 1]) || ((j > 0) && walls[i][j - 1] && !walls[i - 1][j - 1]);
		var neighbor = [i - 1, j];
	} else {
		var isForcedNeighbor = ((j < (totalCols - 1)) && walls[i][j + 1] && !walls[i + 1][j + 1]) || ((j > 0) && walls[i][j - 1] && !walls[i + 1][j - 1]);
		var neighbor = [i + 1, j];
	}
	var xy = neighbor[0] + "-" + neighbor[1];
	if (isForcedNeighbor && !stored[xy]){
		//console.log("Neighbor " + JSON.stringify(neighbor) + " is forced! Adding to neighbors and stored.")
		neighbors.push(neighbor);
		stored[xy] = true;
	} else {
		//console.log("Is not a forced neighbor..");
	}
	//return;
}

function greedyBestFirstSearch(start, end, object) {
	var { myHeap, visited, pathFound, distances, prev, costs,cells } = initialise(start);
    pushToAnimateCells(start[0],start[1],"searching",object);
		
	while (!myHeap.isEmpty()){
		var cell = myHeap.getMin();
		var i = cell[1][0];
		var j = cell[1][1];
		if (visited[i][j]){ continue; }
		visited[i][j] = true;

		pushToAnimateCells(i,j,"visited",object);
		if(checkEnd(i,j,object,end)){pathFound=true; break;} 
			
		var neighbors = getNeighbors(i, j);
		for (var k = 0; k < neighbors.length; k++){
			var m = neighbors[k][0];
			var n = neighbors[k][1];
			if (visited[m][n]){ continue; }
			if(object){
			var newCost = Math.abs(object[0] - m) + Math.abs(object[1] - n);
			if(cellIsAWallAndWeight(m,n,cells,false,true)){
				var newCost = Math.abs(object[0] - m) + Math.abs(object[1] - n)+4;
			}
		}
			else{
				var newCost = Math.abs(end[0] - m) + Math.abs(end[1] - n);
				if(cellIsAWallAndWeight(m,n,cells,false,true)){
					var newCost = Math.abs(end[0] - m) + Math.abs(end[1] - n)+4;
				}
			}			
			if (newCost < costs[m][n]){
				prev[m][n] = [i, j];
				costs[m][n] = newCost;
				myHeap.push([newCost, [m, n]]);
				pushToAnimateCells(m,n,"searching",object);
			}
		}
	}
	// Make any nodes still in the heap "visited"
	nodesStillInHeap (myHeap, object, visited);
	
	if (pathFound) {
		if(object) objectCellsToAnimate = fetchPath(objectCellsToAnimate,object,end,prev);
		else   objectCellsToAnimate = fetchPath(objectCellsToAnimate,null,end,prev);
   }
	if(object) greedyBestFirstSearch(object, end, null)
    showPath();
	 return pathFound;		
 }

 function pushToAnimateCells(i,j,searchOrvisited,object){
	if(!object) cellsToAnimate.push( [[i, j], searchOrvisited] );    // shows the visited cells
	else         cellsToAnimate.push( [[i, j], searchOrvisited] );
}

 function showPath(){
	 	objectCellsToAnimate.map(([r,c]) => cellsToAnimate.push( [[r,c], "success"] )); 
	     objectCellsToAnimate= [];
 }
 function fetchPath(objectCellsToAnimate,object,end, prev){
	if(object){
		var r = object[0];
		var c = object[1];}
		else{
		 var r =  end[0];
		 var c = end[1];
			}
		objectCellsToAnimate.push([r,c]);
		
		while (prev[r][c] != null){
			var prevCell = prev[r][c];
			r = prevCell[0];
			c = prevCell[1];
			objectCellsToAnimate.push([r,c]);
		}
		return objectCellsToAnimate;
}
function nodesStillInHeap (myHeap, object, visited){
	while ( !myHeap.isEmpty() ){
		var cell = myHeap.getMin();
		var i = cell[1][0];
		var j = cell[1][1];
		if (visited[i][j]){ continue; }
		visited[i][j] = true;
		if(object)
			cellsToAnimate.push([[i, j], "visited"]);
		else
			cellsToAnimate.push([[i, j], "visited2"]);
	}
 }
 function checkEnd (i,j,object,end){
	if(object) {if (i == object[0] && j == object[1]) return true;}
	else if (i == end[0] && j == end[1])  return true;
	  
	return false;	
}
function initialise(start) {
	var pathFound = false;
	var myHeap = new minHeap();
	var prev = createDistancesPrevWalls(false, true, false, false, false, false);
	var distances = createDistancesPrevWalls(true, false, false, false, false, false);
	var costs = createDistancesPrevWalls(true, false, false, false, false, false);
	var visited = createDistancesPrevWalls(false, false, false, false, true, false);
	var cells = $("#tableContainer").find("td");
	distances[start[0]][start[1]] = 0;
	costs[start[0]][start[1]] = 0;
	myHeap.push([0, [start[0], start[1]]]);
	return { myHeap, visited, pathFound, distances, prev, costs,cells};
}
 





var totalRows = 25;
var totalCols = 65;
var t=0;
var inProgress = false;
var cellsToAnimate = [];
var algorithm = null;
var justFinished = false;
var animationSpeed = "Fast";
var animationState = null;
var startCell = [11, 15];
var endCell = [11, 25];
var objectCell = [11, 20];
var createObject = false;
var del =0;
var movingPoint = [];
var point1 = [((startCell[0]+endCell[0])/2)+5,((startCell[1]+endCell[1])/2)+5];
var point2 = [((startCell[0]+endCell[0])/2)+1,((startCell[1]+endCell[1])/2)+1];
var point3 = [((startCell[0]+endCell[0])/2)+2,((startCell[1]+endCell[1])/2)+2];
var point4 = [((startCell[0]+endCell[0])/2)+3,((startCell[1]+endCell[1])/2)+3];

//grid creation
 function generateGrid( rows, cols ) {
    var grid = "<table>";
    for ( row = 1; row <= rows; row++ ) {
        grid += "<tr>"; 
        for ( col = 1; col <= cols; col++ ) {      
            grid += "<td></td>";
        }
        grid += "</tr>"; 
    }
    grid += "</table>"
    return grid;
}
const makeGrid = $("#tableContainer").append(generateGrid(totalRows, totalCols));
const hidesInst = $("#hide_instructions").click(function () { $('#instructions_panel').hide();});

//buttons

const showsIns = $("#show_instructions").click(function () { $('#instructions_panel').show();});

const startB = $("#startBtn").click(function () {
	if (algorithm == null) { return; }
	if (inProgress) { update("wait"); return; }
	traverseGraph(algorithm);
});
const showWaterCell = $("#showWater").click(function () {
	objectCell =  [((startCell[0]+endCell[0])/2),((startCell[1]+endCell[1])/2)];
	clearBoard(true , true);
});
const clearB = $("#clearBtn").click(function () {
	if (inProgress) { update("wait"); return; }
	clearBoard(false,false);
});

const skip = document.getElementById("skipButton").onclick = () => document.getElementById("tutorial").style.display = "none"; 

//NavBar Menus
const algorithms = $("#algorithms .dropdown-item").click(function () {
	if (inProgress) { update("wait"); return; }
	algorithm = $(this).text();
	if (algorithm == "Travelling SalesMan") {
		if (t == 1) {
			alert("Travelling salesman does not work with mazes");
			algorithm = null;
		}
		else clearBoard(true,false);
	}
	else  clearBoard(true,true);
	updateStartBtnText();
	console.log("Algorithm has been changd to: " + algorithm);
});

const speed = $("#speed .dropdown-item").click(function () {
	if (inProgress) { update("wait"); return; }
	animationSpeed = $(this).text();
	updateSpeedDisplay();
	console.log("Speed has been changd to: " + animationSpeed);
});

const mazes = $("#mazes .dropdown-item").click(function () {
	if (inProgress) { update("wait"); return; }
	if (algorithm == "Travelling SalesMan")
		alert("Travelling salesman does not work for mazes");
	let maze = $(this).text();
	if (maze == "Random" && algorithm != "Travelling SalesMan") {
		if (del == 1) {
			clearBoard(false, false);
			randomMaze(true, false);
		}
		else randomMaze(true, false);
	}
	else if (maze == "Recursive Division" && algorithm != "Travelling SalesMan") {
		if (del == 1) {
			clearBoard(false, false);
			recursiveDivMaze(null);
		}
		else recursiveDivMaze(null);
	}
	else if (maze == "Recursive Division (Vertical Skew)" && algorithm != "Travelling SalesMan") {
		if (del == 1) {
			clearBoard(false, false);
			recursiveDivMaze("VERTICAL");
		}
		else recursiveDivMaze("VERTICAL");
	}
	else if (maze == "Recursive Division (Horizontal Skew)" && algorithm != "Travelling SalesMan") {
		if (del == 1) {
			clearBoard(false, false);
			recursiveDivMaze("HORIZONTAL");
		}
		else recursiveDivMaze("HORIZONTAL");
	}
	else if (maze == "Simple Spiral" && algorithm != "Travelling SalesMan") {
		if (del == 1) {
			clearBoard(false, false);
			spiralMaze();
		}
		else spiralMaze();
	}
	else if (maze == "High Meteorite Hit Region" && algorithm != "Travelling SalesMan") {
		randomMaze(false, true);
	}
	console.log("Maze has been changd to: " + maze);
});
			 
//FUNCTIONS OF NAVBAR
//speed change in navbar
function updateSpeedDisplay(){
	if (animationSpeed == "Slow")        $(".speedDisplay").text("Speed: Slow");
	else if (animationSpeed == "Normal") $(".speedDisplay").text("Speed: Normal");
	else if (animationSpeed == "Fast")   $(".speedDisplay").text("Speed: Fast");
	return;
}

//selects the algo
function updateStartBtnText(){
	let strikethrough = ["bfs", "dfs"];
	let name = "";
	if (algorithm == "Depth-First Search (DFS)")         $("#startBtn").html("Start DFS");
	else if (algorithm == "Breadth-First Search (BFS)")  $("#startBtn").html("Start BFS");
    else if (algorithm == "Dijkstra")                    $("#startBtn").html("Start Dijkstra");
	else if (algorithm == "A*")                          $("#startBtn").html("Start A*");
	else if (algorithm == "Greedy Best-First Search")	 $("#startBtn").html("Start Greedy BFS");
	else if (algorithm == "Jump Point Search")           $("#startBtn").html("Start JPS");
	else if (algorithm == "Bidirectional BFS")           $("#startBtn").html("Start Bidirectional BFS");
	else if (algorithm == "Travelling SalesMan")         $("#startBtn").html("Start Travelling SalesMan");
	return;
}

// Used to display error messages
function update(message){
	$("#resultsIcon").removeClass();
	$("#resultsIcon").addClass("fas fa-exclamation");
	$('#results').css("background-color", "#ffc107");
	$("#length").text("");
	if (message == "wait") $("#duration").text("Please wait for the algorithm to finish.");
}

async function traverseGraph(algorithm){
    inProgress = true;
	clearBoard( true,true);
	var startTime = Date.now();
	var pathFound = executeAlgo();
	var endTime = Date.now();
	await animateCells();
	if ( pathFound ) updateResults((endTime - startTime), true, countLength());
   else updateResults((endTime - startTime), false, countLength());
	inProgress = false;
	justFinished = true;
}
function countLength(){
	var cells = $("td");
	return cells.filter( cel => $(cells[cel]).hasClass("success")).length;
}
// Used to display results
function updateResults(duration, pathFound, length){
	var firstAnimation = "swashOut";
	var secondAnimation = "swashIn";
	$("#results").removeClass();
    $("#results").addClass("magictime " + firstAnimation); 
    setTimeout(function(){ 
    	$("#resultsIcon").removeClass();
    	if (pathFound){
    		$('#results').css("background-color", "#77dd77");
    		$("#resultsIcon").addClass("fas fa-check");
    	} else {
    		$('#results').css("background-color", "#ff6961");
    		$("#resultsIcon").addClass("fas fa-times");
    	}
    	$("#duration").text("Duration: " + duration + " ms");
    	$("#length").text("Length: " + length);
    	$('#results').removeClass(firstAnimation);
    	$('#results').addClass(secondAnimation); 
    }, 1100);
}
function executeAlgo(){
	if (algorithm == "Depth-First Search (DFS)" ){
		if(createObject && del==0){ alert("Kindly choose one of BFS,DIJKSTRA,A*,GREEDY-BEST-FIRST")}
		else if( del ==1) alert("Kindly choose one of DIJKSTRA,A*,GREEDY-BEST-FIRST")
		else{
		var visited = createDistancesPrevWalls(false,false,false,false,true,false);
		var pathFound = DFS(startCell[0], startCell[1], visited, objectCell);}

	}else if (algorithm == "Breadth-First Search (BFS)"){
		if(createObject && del==0) var pathFound = BFS(startCell,endCell, objectCell);
		else if( del ==1)  alert("Kindly choose one of DIJKSTRA,A*,GREEDY-BEST-FIRST")
		else               var pathFound = BFS(startCell,endCell, null);
	
	}else if (algorithm == "Dijkstra"){
		if(createObject) var pathFound = dijkstra(startCell,endCell, objectCell);
		else             var pathFound = dijkstra(startCell,endCell, null);
	
	} else if (algorithm == "A*"){
		if(createObject) var pathFound = AStar(startCell,endCell, objectCell);
		else   var pathFound = AStar(startCell,endCell, null);
	
	} else if (algorithm == "Greedy Best-First Search"){
		if(createObject) var pathFound = greedyBestFirstSearch(startCell,endCell,objectCell);
		else var pathFound = greedyBestFirstSearch(startCell,endCell,null);
	
	} else if (algorithm == "Jump Point Search"){
		if(createObject && del==0){ alert("Kindly choose one of BFS,DIJKSTRA,A*,GREEDY-BEST-FIRST")}
		else if( del ==1)  alert("Kindly choose one of DIJKSTRA,A*,GREEDY-BEST-FIRST")
		else{var pathFound = jumpPointSearch(startCell,endCell,objectCell);}
	}

	else if (algorithm == "Bidirectional BFS"){
		if(createObject && del==0){ alert("Kindly choose one of BFS,DIJKSTRA,A*,GREEDY-BEST-FIRST")}
		else if( del ==1 )          alert("Kindly choose one of DIJKSTRA,A*,GREEDY-BEST-FIRST")
		else{var pathFound = BidirectionalBFS()};
	}

	else if (algorithm == "Travelling SalesMan")  var pathFound = draw();

	return pathFound;
}

// function makeWallAndWeight(cell,isWall,isWeight){
//     if (!createWeight){return;}
// 	var index = $( "td" ).index( cell );
// 	var row = Math.floor( ( index ) / totalRows) + 1;
// 	var col = ( index % totalCols ) + 1;
// 	console.log([row, col]);
// 	if ((inProgress == false) && !(row == 1 && col == 1) && !(row == totalRows && col == totalCols)){
// 		if(isWeight)$(cell).toggleClass("weight");
// 		else if(isWall)$(cell).toggleClass("wall");
//   }
// }
function clearBoard(keepWalls, keepWeight){	
	var cells = $("#tableContainer").find("td");
	var { point1index, point2index, point3index, point4index,startCellIndex,endCellIndex,objectCellIndex} = getIndexes();
	for (var i = 0; i < cells.length; i++){
			isWall = $( cells[i] ).hasClass("wall");
			isWeight = $( cells[i] ).hasClass("weight");
			isObject = $( cells[i] ).hasClass("object");
			
			$( cells[i] ).removeClass();
			
			if (i == startCellIndex)            $(cells[i]).addClass("start"); 
			else if (i == endCellIndex)         $(cells[i]).addClass("end"); 
			else if( isWeight && keepWeight)	$(cells[i]).addClass("weight"); 
			
			else if(i == objectCellIndex ) {
				if(((objectCell[1] < startCell[1]) && (objectCell[1] > endCell[1])) ||
				((objectCell[1] > startCell[1]) && (objectCell[1] < endCell[1]))) {$(cells[i]).addClass("object");  createObject = true;}
				else  createObject= false;}
				
			 else if(algorithm == "Travelling SalesMan"){
               if(i == point1index)   {$(cells[i]).addClass("end"); }
			   if(i == point2index)    {$(cells[i]).addClass("end"); }
			   if(i == point3index)    {$(cells[i]).addClass("end"); }
			   if(i == point4index)    {$(cells[i]).addClass("end"); }
	        }
			 else if ( keepWalls && isWall )  $(cells[i]).addClass("wall"); 
	}
	t=0;
}
function getIndexes() {
	var point1index = (point1[0] * (totalCols)) + point1[1];
	var point2index = (point2[0] * (totalCols)) + point2[1];
	var point3index = (point3[0] * (totalCols)) + point3[1];
	var point4index = (point4[0] * (totalCols)) + point4[1];
	var startCellIndex = (startCell[0] * (totalCols)) + startCell[1];
	var endCellIndex = (endCell[0] * (totalCols)) + endCell[1];
	var objectCellIndex = (objectCell[0] * (totalCols))+ objectCell[1];
	return { point1index, point2index, point3index, point4index,startCellIndex, endCellIndex, objectCellIndex };
}	

// Ending statements

clearBoard(false,false);
$('#myModal').on('shown.bs.modal', function () {$('#myInput').trigger('focus');})
$(window).on('load',function(){ $('#exampleModalLong').modal('show');});



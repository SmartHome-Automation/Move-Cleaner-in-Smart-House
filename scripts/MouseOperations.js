var { movingStart, movingEnd, movingObject, movingPointIndex, createWalls } = initialiseVars();

//walls
$( "td" ).mousedown(function(){
	var index = $( "td" ).index( this );
	var { point1index, point2index, point3index, point4index, startCellIndex, endCellIndex, objectCellIndex } = getIndexes();
	if ( !inProgress ){
		// Clear board if just finished
		if ( justFinished  && !inProgress ){ 
			clearBoard(true,false); 
			justFinished = false;
		}
		if (index == startCellIndex){
			movingStart = true;
			//console.log("Now moving start!");
		} else if (index == endCellIndex){
			movingEnd = true;
			//console.log("Now moving end!");
		}else if(index == objectCellIndex) {
			movingObject= true;

		}else if (algorithm == "Travelling SalesMan"){
		
			   if(index == point1index){
					movingPointIndex= true;
					movingPoint = point1;
				}
				if(index == point2index){
					movingPointIndex= true;
					movingPoint = point2;
				}
				if(index == point3index){
					movingPointIndex= true;
					movingPoint = point3;
				}
				if(index == point4index){
					movingPointIndex= true;
					movingPoint = point4;
				}
			}
			else {
				createWalls = true;
			}
	}
		
	
});

$( "td" ).mouseup(function(){
	createWalls = false;
	movingStart = false;
	movingEnd = false;
	movingObject= false;
	movingPointIndex= false;
});

$( "td" ).mouseenter(function() {
	if (!createWalls && !movingStart && !movingEnd && !movingObject && !movingPointIndex){ return; }
    var index = $( "td" ).index( this );
	var movingPointkIndex =  (movingPoint[0] * (totalCols)) + movingPoint[1];
	
	var { point1index, point2index, point3index, point4index,startCellIndex,endCellIndex,objectCellIndex} = getIndexes();

    if (!inProgress){
    	if (justFinished){ 
			clearBoard( true,false);
			
    		justFinished = false;
    	}
    	//console.log("Cell index = " + index);
    	if (movingStart && index != endCellIndex && index != objectCellIndex && index != point1index && index != point2index && index != point3index && index != point4index) {
    		moveStartOrEnd(startCellIndex, index, "start");
    	} else if (movingEnd && index != startCellIndex && index != objectCellIndex && index != point1index && index != point2index && index != point3index && index != point4index) {
    		moveStartOrEnd(endCellIndex, index, "end");
		}else if (movingObject && index != endCellIndex && index != startCellIndex  && index != point1index && index != point2index && index != point3index && index != point4index){
            moveStartOrEnd(objectCellIndex, index, "object");
		} else if(movingPointIndex && index != endCellIndex && index != startCellIndex && index!= objectCellIndex){			moveStartOrEnd(movingPointkIndex, index, "ending");
		    if(checkoverlapping(movingPointkIndex, point1index, index, point2index, point3index, point4index))
		     moveStartOrEnd(movingPointkIndex, index, "ending");
		}else if (index != startCellIndex && index != endCellIndex && index !=objectCellIndex && index != movingPointIndex) {
    		$(this).toggleClass("wall");}
    } 
});

const clickFunction = $("td").click(function () {
	var index = $("td").index(this);
	var {point1index, point2index, point3index, point4index,startCellIndex, endCellIndex, objectCellIndex } = getIndexes();
	var movingPointkIndex = (movingPoint[0] * (totalCols)) + movingPoint[1];
	if ((inProgress == false) && !(index == startCellIndex) && !(index == endCellIndex) && !(index == objectCellIndex) && !(index == movingPointkIndex)) {
		if (justFinished) {
			clearBoard(true,false);

			justFinished = false;
		}
		$(this).toggleClass("wall");
	}
});
// optimise
const mouseUp = $("body").mouseup(function () {
	createWalls = false;
	movingStart = false;
	movingEnd = false;
	movingObject = false;
	movingPointIndex = false;
});

function initialiseVars() {
	var movingStart = false;
	var movingEnd = false;
	var movingObject = false;
	var movingPointIndex = false;
	var createWalls = false;
	return { movingStart, movingEnd, movingObject, movingPointIndex, createWalls };
}

function checkoverlapping(movingPointkIndex, point1index, index, point2index, point3index, point4index) {
	return (movingPointkIndex == point1index && index != point2index && index != point3index && index != point4index)
		|| (movingPointkIndex == point2index && index != point1index && index != point3index && index != point4index)
		|| (movingPointkIndex == point3index && index != point1index && index != point2index && index != point4index)
		|| (movingPointkIndex == point2index && index != point1index && index != point3index && index != point2index);
}

function moveStartOrEnd(prevIndex, newIndex, startOrEnd){
	var newCellY = newIndex % totalCols;
	var newCellX = Math.floor((newIndex - newCellY) / totalCols);
	var { point1index, point2index, point3index, point4index,startCellIndex, endCellIndex, objectCellIndex  } = getIndexes();
	if (startOrEnd == "start"){
    	startCell = [newCellX, newCellY];
    	console.log("Moving start to [" + newCellX + ", " + newCellY + "]")
	} 
	else if(startOrEnd == "end"){
    	endCell = [newCellX, newCellY];
    	//console.log("Moving end to [" + newCellX + ", " + newCellY + "]")
	}
	else if(startOrEnd == "ending" && algorithm ==  "Travelling SalesMan"){

		console.log("3Moving ending to [" + newCellX + ", " + newCellY + "]")
	   
	            if(prevIndex == point1index )
					point1 = [newCellX,newCellY];
					 
				if(prevIndex == point2index )
				    point2 = [newCellX,newCellY];
				
				if(prevIndex == point3index )
				    point3 = [newCellX,newCellY];
				
				if(prevIndex == point4index  )
				    point4 = [newCellX,newCellY];
	}
	else if(startOrEnd == "object"){
	   objectCell= [newCellX, newCellY];
	}

	clearBoard(true,true);
	
    return;
}

	
// to be looked 
function moveEnd(prevIndex, newIndex){
	// Erase last end cell
	$($("td").find(prevIndex)).removeClass();

	var newEnd = $("td").find(newIndex);
	$(newEnd).removeClass();
    $(newEnd).addClass("end");

    var newEndX = Math.floor(newIndex / totalRows);
	var newEndY = Math.floor(newIndex / totalCols);
    startCell = [newStartX, newStartY];
    return;
}

var endPoints = [endCell,point1, point2, point3, point4];

var popSize = 150;
var population = [];
var fitness = [];


var bestEver= [];


function draw() {

  endPoints= [endCell,point1, point2, point3, point4];

  createOrderandPopulation();
  calculateFitness();
  normalizeFitness();
  nextGeneration();

  var CELLS = [];
  console.log(bestEver);
 
  for (var i = 1; i <= bestEver.length; i++) {
    var n = bestEver[i-1];
    CELLS[i]= endPoints[n];
  }
  CELLS[0]=startCell;
  display(CELLS);
  
  
  return true;
}

function createOrderandPopulation(){
  var order = [];
  for(var k=0; k<endPoints.length; k++){
    order[k]= k;
  }
  for (var i = 0; i < popSize; i++) {
         let array = shuffle(order);
         population[i]=[];
         for(var k=0; k<array.length; k++){
           population[i][k]= array[k];
         }
      }
    
}

function shuffle(array) {
  array.sort(() => Math.random(1,array.length-1) - 0.5);
  return array;
}

function display(CELLS){
    var collect = [];
   for(var k=0; k<CELLS.length-1; k++){
          var i = CELLS[k][0];
          var j = CELLS[k][1];

          var x = CELLS[k+1][0];
          var y = CELLS[k+1][1];

          collect.push(AStar([i,j],[x,y],null));
   }
  for(var i=0; i<collect.length; i++){
      collect[i].map(([r,c]) => cellsToAnimate.push( [[r,c], "success"] ));
  }
  
}

function swap(a, i, j) {
  var temp = a[i];
  a[i] = a[j];
  a[j] = temp;
}

function calcDistance(points, order) {
  var sum = 0;
  for (var i = 0; i <=order.length-2; i++) {
    var cityAIndex = order[i];
    var cityA = points[cityAIndex];
   
    var cityBIndex = order[i+1];
    var cityB = points[cityBIndex];
    var d = getDistance(cityA[0], cityA[1], cityB[0], cityB[1]);
   
    sum += d;
  }
 
  return sum;
}

function getDistance(xA, yA, xB, yB) { 
  
  var xDiff = Math.abs (xA - xB); 
	var yDiff = Math.abs (yA - yB); 

	return (xDiff  + yDiff);
}

function calculateFitness() {
    fitness=[];
    
    var recordDistance = Infinity;
    for (var i = 0; i < population.length; i++) {
     
      var d =  calcDistance(endPoints, population[i]);
      if (d < recordDistance) {
        recordDistance = d;
        bestEver = population[i];
      }
      fitness[i] = 1 / (Math.pow(d, 8) + 1);

    }
    console.log(fitness);
  } 
  
function normalizeFitness() {
    var sum = 0;
    for (var i = 0; i < fitness.length; i++) {
      sum += fitness[i];
    }
    for (var i = 0; i < fitness.length; i++) {
      fitness[i] = fitness[i] / sum;
    }
  }
  
 function nextGeneration() {
    var newPopulation = [];
    for (var i = 0; i < population.length; i++) {
      var orderA = pickOne(population, fitness);
      var orderB = pickOne(population, fitness);
      var order = crossOver(orderA, orderB);
      mutate(order, 0.01);
      newPopulation[i] = order;
    }
    population = newPopulation;
}
  
function pickOne(list, prob) {
    var index = 0;
    var r = Math.random(1);
  
    while (r > 0) {
      r = r - prob[index];
      index++;
    }
    index--;
    return list[index].slice();
}
  
function crossOver(orderA, orderB) {
    var start = Math.floor(Math.random(orderA.length));
    var end = Math.floor(Math.random(start + 1, orderA.length));
    var neworder = orderA.slice(start, end);
    for (var i = 0; i < orderB.length; i++) {
      var city = orderB[i];
      if (!neworder.includes(city)) {
        neworder.push(city);
      }
    }
    return neworder;
}
  
function mutate(order, mutationRate) {
    for (var i = 0; i < 6; i++) {
      if (Math.random(1) < mutationRate) {
        var indexA = Math.floor(Math.random(order.length));
        var indexB = (indexA + 1) % 6;
        swap(order, indexA, indexB);
      }
    }
}
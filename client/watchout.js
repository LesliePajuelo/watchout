// start slingin' some d3 here.

//Object with the defaults
var gameOptions = {
  //window size\
  width : 800,
  height : 600
  //number enemies
  //size of enemies
  //mouse location  
  //gameOptions =
  // height: 450
  // width: 700
  // nEnemies: 30
  // padding: 20
};

var gameStats = {
  highScore: 0,
  currentScore: 0,
  collision: 0
};



//game board
var gameBoard = d3.select('.gameboard').append('svg')
                .attr('width', gameOptions.width)
                .attr('height', gameOptions.height)
                .style('border', '1px solid red');


// gameBoard.on('mousemove', function() {
// var loc = d3.mouse(this);
// var mouse = {x: loc[0], y: loc[1]};
// //TODO make dot follow mouse 
// // d3.select('.hero').attr('cx', mouse.x).attr('cy', mouse.y)
// });

 //TODO give window properties


 // create enemy data
 var enemyData = {
  amount : d3.range(10),
  x : function(){return Math.random() * gameOptions.width;},
  y : function(){return Math.random() * gameOptions.height;},
  radius: 10
 };

//draw enemies as svg
var asteroid = gameBoard.selectAll(".asteroid")
                        .data(enemyData.amount)
                        .enter()
                        .append("circle")
                        .attr("cx", enemyData.x)
                        .attr("cy", enemyData.y)
                        .attr("r", enemyData.radius)
                        .style('fill', 'red');

//move the enemies
var move = function(){
  asteroid
  .transition()
  .duration(2000)
  .ease("linear")
  .attr('cx', function(){return (Math.random() * gameOptions.width) - enemyData.radius;})
  .attr('cy', function(){return (Math.random() * gameOptions.height) - enemyData.radius;})
  .each("end", move);
};
move();

 var playerData = {
  amount : d3.range(1), //TODO make this make sense
  x : function(){return gameOptions.width / 2;},
  y : function(){return gameOptions.height / 2;},
  radius: 10
 };


//draw enemies as svg

//drag the player
var drag = d3.behavior.drag()
    //.origin(function(d) { return d; })
    .on("drag", dragmove);

function dragmove(d) {
  d3.select(this)
      .attr("cx", d.x = Math.max(playerData.radius, Math.min(gameOptions.width - playerData.radius, d3.event.x)))
      .attr("cy", d.y = Math.max(playerData.radius, Math.min(gameOptions.height - playerData.radius, d3.event.y)));
}


var player = gameBoard.selectAll(".player")
                        .data(playerData.amount)
                        .enter()
                        .append("circle")
                        .attr("cx", playerData.x)
                        .attr("cy", playerData.y)
                        .attr("r", playerData.radius)
                        .attr('fill', 'black')
                        .call(drag);



//collision detection
var checkCollisions = function(){
  
  d3.select('.gameboard').style('background-color', 'white');
  asteroid.each(function(){
    //get asteroid coords
    var asteroidX = this.cx.animVal.value;
    var asteroidY = this.cy.animVal.value;

    //get player location
    var playerX = player[0][0].cx.animVal.value;
    var playerY = player[0][0].cy.animVal.value;

    
    //if distance is less than enemy radius
     //Math.hypot 
     //then change flag to collide
     if(Math.hypot(asteroidX - playerX, asteroidY - playerY) < (enemyData.radius * 2)){
      gameStats.collision++;
      d3.select('.collisions').text('Collisions: ' + gameStats.collision);
      gameStats.currentScore = 0;
      d3.select('.current').text('Current score: ' + gameStats.currentScore);
      d3.select('.gameboard').style('background-color', 'red');
     }
  });
};

var scoreKeeper = function() {
  gameStats.currentScore++;
  d3.select('.current').text('Current score: ' + gameStats.currentScore);
  gameStats.highScore = Math.max(gameStats.currentScore, gameStats.highScore);
  d3.select('.high').text('High score: ' + gameStats.highScore);
}

d3.timer(checkCollisions);
setInterval(scoreKeeper,500);
// d3.timer(scoreKeeper,1000);
//keep track of score


//update scoreboard

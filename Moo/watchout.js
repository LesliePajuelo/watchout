// start slingin' some d3 here.

//Object with the defaults
//TODO give window properties
//
$('.aloning').hide();


var gameOptions = {
  width : (window.innerWidth - 50),
  height : (window.innerHeight - 100),
  numberOfNicks: 10,
  numberOfCows: 25,
  radius: 25,
  randomX: function(){return (Math.random() * (gameOptions.width - (nickData.radius * 2)));},
  randomY: function(){return (Math.random() * (gameOptions.height - (nickData.radius * 2)));},
  background: 'linear-gradient(45deg, white, #01243B 100%) no-repeat'
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
                .style('background-color', gameOptions.background);

 
 var config = {
    "avatar_size" : 50
};

// definitions pattern for Nick
var nickdefs = gameBoard.append('svg:defs');
 nickdefs.append('svg:pattern')
     .attr('id', 'nick60')
     .attr('width', config.avatar_size)
     .attr('height', config.avatar_size)
     .attr('patternUnits', 'objectBoundingBox') 
     .append('svg:image')
     .attr('xlink:href', 'nick60.png')
     .attr('width', config.avatar_size)
     .attr('height', config.avatar_size)
     .attr('x', 0)
     .attr('y', 0);

// definitions pattern for Bella
 var belladefs = gameBoard.append('svg:defs');
 belladefs.append('svg:pattern')
     .attr('id', 'bella50')
     .attr('width', config.avatar_size)
     .attr('height', config.avatar_size)
     .attr('patternUnits', 'objectBoundingBox')
     .append('svg:image')
     .attr('xlink:href', 'bella50.jpg')
     .attr('width', config.avatar_size)
     .attr('height', config.avatar_size)
     .attr('x', 0)
     .attr('y', 0);




 // create Nick data
 var nickData = {
  amount : d3.range(gameOptions.numberOfNicks),
  x : gameOptions.randomX,
  y : gameOptions.randomY,
  radius: gameOptions.radius
 };

// create nick
var nick = gameBoard.selectAll('.nick')
                        .data(nickData.amount)
                        .enter()
                        .append('circle')
                        .attr('class','nicks')
                        .attr('cx', nickData.x)
                        .attr('cy', nickData.y)
                        .attr('r', nickData.radius)
                        .style('fill', "url(#nick60")
                        .style('stroke', 'black')
                        .style('stroke-width', '2');

//move the enemies
var move = function(){
  nick
  .transition()
  .duration(1000)
  .attr('cx', gameOptions.randomX)
  .attr('cy', gameOptions.randomY)
  .each('end', function(){ move(d3.select(this)); });
};

move();

 var bellaData = {
  amount : d3.range(1),
  x : function(){return gameOptions.width / 2;},
  y : function(){return gameOptions.height / 2;},
  radius: gameOptions.radius
 };

//drag the bella
var drag = d3.behavior.drag()
    .on('drag', dragmove);
    

function dragmove(d) {
  d3.select(this)
      .attr('cx', d.x = Math.max(bellaData.radius, Math.min(gameOptions.width - bellaData.radius, d3.event.x)))
      .attr('cy', d.y = Math.max(bellaData.radius, Math.min(gameOptions.height - bellaData.radius, d3.event.y)));
}

var bella = gameBoard.selectAll('.bella')
                        .data(bellaData.amount)
                        .enter()
                        .append('circle')
                        .attr('cx', bellaData.x)
                        .attr('cy', bellaData.y)
                        .attr('r', bellaData.radius)
                        .attr('fill', "url(#bella50")
                        .style('stroke', 'yellow')
                        .style('stroke-width', '2')
                        .call(drag);



//collision detection
var checkCollisions = function(){
  var collision = false;

  d3.select('svg')
  .style('background', gameOptions.background);

  nick.each(function(){
    //get nick locations
    var nickX = this.cx.animVal.value;
    var nickY = this.cy.animVal.value;

    //get bella location
    var bellaX = bella[0][0].cx.animVal.value;
    var bellaY = bella[0][0].cy.animVal.value;
    
    //if bella distance is less than nick radius
     if(Math.hypot(nickX - bellaX, nickY - bellaY) < (nickData.radius * 2)){
      collision = true;
    }
      
      if(collision){
              if(gameOptions.numberOfNicks > 0){
      gameStats.collision++;
      d3.select('.collisions').text('Collisions: ' + gameStats.collision);
      gameStats.currentScore = 0;
      d3.select('.current').text('Current score: ' + gameStats.currentScore);
      d3.select('svg').style('background', 'linear-gradient(45deg, white, red 100%) no-repeat');
      
      };
     }
  });
};

var scoreKeeper = function() {
  gameStats.currentScore++;
  d3.select('.current').text('Current score: ' + gameStats.currentScore);
  gameStats.highScore = Math.max(gameStats.currentScore, gameStats.highScore);
  d3.select('.high').text('High score: ' + gameStats.highScore);
};

d3.timer(checkCollisions);
setInterval(scoreKeeper,1000);


//On space bar
//fire an svg circle
//if 


 var cowDefs = gameBoard.append('svg:defs');
 cowDefs.append('svg:pattern')
     .attr('id', 'cow30')
     .attr('width', config.avatar_size)
     .attr('height', config.avatar_size)
     .attr('patternUnits', 'objectBoundingBox') 
     .append('svg:image')
     .attr('xlink:href', 'moo30.png')
     .attr('width', config.avatar_size - 30)
     .attr('height', config.avatar_size - 15)
     .attr('x', 0)
     .attr('y', 0);

 var cowData = {
  amount : d3.range(gameOptions.numberOfCows),
  x : gameOptions.width + 20,
  y : gameOptions.height +20,
  radius: gameOptions.radius/2
 };

// create cow
var cow = gameBoard.selectAll('.cow')
                        .data(nickData.amount)
                        .enter()
                        .append('circle')
                        .attr('cx', cowData.x)
                        .attr('cy', cowData.y)
                        .attr('r', cowData.radius)
                        .style('fill', "url(#cow30")
                        




var checkCowlisions = function(){
  
  nick.each(function(){
    //get nick locations
    var cowlision = false;
    var nickX = this.cx.animVal.value;
    var nickY = this.cy.animVal.value;

    //get bella location
    var cowX = cow[0][0].cx.animVal.value;
    var cowY = cow[0][0].cy.animVal.value;
    
    //if bella distance is less than nick radius
     if(Math.hypot(nickX - cowX, nickY - cowY) < (nickData.radius * 2)){
      d3.select('.current').text('Current score: ' + gameStats.currentScore);
      cowlision = true;
    }
      
      if(cowlision){
        d3.select(this)
          .remove();
        gameOptions.numberOfNicks--;
        console.log(gameOptions.numberOfNicks)

      };

      if(gameOptions.numberOfNicks < - 20){
       $('.aloning').show();
     }

      
     });
  };


d3.timer(checkCowlisions);

d3.select(window)
  .on("keydown", function(){
    var moove = function(){
  cow
  .transition()
  .duration(1000)
  .attr('cx', gameOptions.randomX)
  .attr('cy', gameOptions.randomY)
  .each('end', function(){ moove(d3.select(this)); });
};

moove();


});




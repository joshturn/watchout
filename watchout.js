
var gameOptions = {
  height: 450,
  width: 700,
  nEnemies: 3,
  padding: 20
};

var gameStats = {
  score: 0,
  bestScore: 0
};

var axes = {
  x: d3.scale.linear().domain([0, 100]).range([0,gameOptions.width]),
  y: d3.scale.linear().domain([0,100]).range([0,gameOptions.height])
};

var gameBoard = d3.select('.game').append('svg:svg')
                  .attr('width', gameOptions.width)
                  .attr('height', gameOptions.height);

// d3.select("body").append("p").text("New paragraph!");
// gameBoard;

var createEnemies = function () {
  // debugger;
  return _.range(0, gameOptions.nEnemies).map(function(i){
    return {
      id: i,
      x: (Math.random() * 100),
      y: (Math.random() * 100)
    };
  });
};

var Playa = function() {
  var playaObj = {};

  playaObj.path = 'm-7.5,1.62413c0,-5.04095 4.08318,-9.12413 9.12414,-9.12413c5.04096,0 9.70345,5.53145 11.87586,9.12413c-2.02759,2.72372 -6.8349,9.12415 -11.87586,9.12415c-5.04096,0 -9.12414,-4.08318 -9.12414,-9.12415z';
  playaObj.fill = 'yellow';
  playaObj.x = 0;
  playaObj.y = 0;
  playaObj.angle = 0;
  playaObj.r = 5;

  playaObj.setOptions = function(gameOptions) {
    playaObj.gameOptions = gameOptions;
  };


  playaObj.render = function(destination) {
    playaObj.setOptions(gameOptions);

    playaObj.playaElement = destination.append('svg:path')
                     .attr('d', playaObj.path)
                     .attr('fill', playaObj.fill);

    playaObj.move({
      x: playaObj.gameOptions.width * 0.5,
      y: playaObj.gameOptions.width * 0.5
    });

    playaObj.setupDragging();
  };

  playaObj.getX = function() {
    return playaObj.x;
  };
  playaObj.setX = function(newX) {
    var minX = playaObj.gameOptions.padding;
    var maxX = playaObj.gameOptions.width - playaObj.gameOptions.padding;
    if (newX <= minX) {
      newX = minX;
    }
    if (newX >= maxX) {
      newX = maxX;
    }
    playaObj.x = newX;
  };

  playaObj.getY = function() {
    return playaObj.y;
  };
  playaObj.setY = function(newY) {
    var minY = playaObj.gameOptions.padding;
    var maxY = playaObj.gameOptions.height - playaObj.gameOptions.padding;
    if (newY <= minY) {
      newY = minY;
    }
    if (newY >= maxY) {
      newY = maxY;
    }
    playaObj.y = newY;
  };

  playaObj.move = function(locationObject) {
    playaObj.angle = locationObject.angle || playaObj.angle;

    if (!locationObject.x) {
      playaObj.setX(playaObj.x);
    } else {
      playaObj.setX(locationObject.x);
    }

    if (!locationObject.y) {
      playaObj.setY(playaObj.y)
    } else {
      playaObj.setY(locationObject.y);
    }

  // rotates player egg
    playaObj.playaElement.attr('transform',
      // "rotate(#{@angle},#{@getX()},#{@getY()}) " +

      "translate(" + playaObj.getX() + ", " + playaObj.getY() +")");
  };

  playaObj.moveAbsolute = function (x, y) {
    playaObj.move({x: x, y: y});
  };

  playaObj.moveRelative = function (dx, dy) {
    playaObj.move(
      {
        x: playaObj.getX()+dx,
        y: playaObj.getY()+dy,
        angle: 360 * (Math.atan2(dy, dx)/(Math.PI*2))
      }
    );
  };

  playaObj.setupDragging = function() {
    var dragMove = function () {
      playaObj.moveRelative(d3.event.dx, d3.event.dy);
    };
    var drag = d3.behavior.drag()
                  .on('drag', dragMove);
    playaObj.playaElement.call(drag);
  };

  return playaObj;
};

var render = function(enemy_data) {
  var enemies = gameBoard.selectAll('circle.enemy')
                .data(enemy_data, function(d){return d.id});

  enemies.enter()
    .append('svg:circle')
    .attr('class', 'enemy')
    .attr('cx', function(enemy) {return axes.x(enemy.x);})
    .attr('cy', function(enemy) {return axes.y(enemy.y);})
    // .attr('cx', 50)
    .attr('color', "red")
    .attr('r', 5);

};

var play = function (){

  var gameTurn = function() {
    var newEnemyPositions = createEnemies();
    // console.log(newEnemyPositions);
    render(newEnemyPositions);

  };

  var increaseScore = function() {
    gameStats.score += 1;
    // updateScore();
  };

  gameTurn();

  // call setInterval with gameTurn
  setInterval(gameTurn, 2000);

  setInterval(increaseScore, 50);


};

var players = [];
var myPlayer = Playa();
players.push(myPlayer.render(gameBoard));
play();


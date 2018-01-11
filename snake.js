function SnakeGame(container) {
  this.container = container;
  this.width     = this.container.offsetWidth;
  this.height     = this.container.offsetHeight;

  this.canvas = document.createElement("canvas");
  this.canvas.width = this.width;
  this.canvas.height = this.height;
  this.container.appendChild(this.canvas);
  this.ctx = this.canvas.getContext('2d');

  this.reset();

  var sg = this;
  this.container.onkeypress = function(e){
    e = e || window.event;
    sg.redirect(e);
  }
  this.container.onkeyup   = function(e){
    e = e || window.event;
    sg.redirect(e);
  }

  window.requestAnimationFrame(function(){sg.draw()});
}

SnakeGame.prototype.reset = function() {
  var sg = this;

  this.food_x = this.width/4;
  this.food_y = this.height / 2;

  this.snake = {
    body: [{
      x: this.width/4 * 3,
      y: this.height/2
    }],
    velocity: 4,
    rotation: 0,
    radius: 10,
    direction: Math.PI,
    ctx: sg.ctx,
    draw: function() {
      var snake = this;
      var ctx   = this.ctx;
      this.body.forEach(function(element, index){
        ctx.beginPath();
        ctx.arc(element.x, element.y, snake.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = 'rgba(0, '+(155-index*20)+', 0, 1)';
        ctx.fill();
      });
    },
    move: function() {
      this.direction += this.rotation;
      this.body[0].x += Math.cos(this.direction) * this.velocity;
      this.body[0].y += Math.sin(this.direction) * this.velocity;
      for(var i = 1; i < this.body.length; i++) {
        var dx       = this.body[i-1].x - this.body[i].x,
            dy       = this.body[i-1].y - this.body[i].y,
            angle    = Math.atan2(dy, dx),
            distance = Math.abs(Math.sqrt(dx*dx + dy*dy)),
            velocity = Math.max(distance - this.velocity - 1.5 * this.radius, 0);

        this.body[i].x += Math.cos(angle) * velocity;
        this.body[i].y += Math.sin(angle) * velocity;
      }
    },
    feed: function() {
      tail = this.body[this.body.length - 1];
      this.body.push({
        x: tail.x,
        y: tail.y
      });
    }
  }
}

SnakeGame.prototype.distance = function(p1, p2) {
  var x = (p1[0] - p2[0]);
  var y = (p1[1] - p2[1]);
  return Math.abs(Math.sqrt(x*x + y*y));
}

SnakeGame.prototype.draw = function() {

  // Move the snake
  this.snake.move();

  // Check to see if we've moved out of bounds
  if(this.snake.body[0].x < 0 ||
      this.snake.body[0].x > this.width ||
      this.snake.body[0].y < 0 ||
      this.snake.body[0].y > this.height)
    this.reset();

  // Check for feeding
  if(this.distance(
      [this.food_x, this.food_y],
      [this.snake.body[0].x, this.snake.body[0].y]) < 15) {
    this.food_x = Math.random() * this.width;
    this.food_y = Math.random() * this.height;
    this.snake.feed();
  }

  // Save/restore calls are for buffering purposes
  this.ctx.save();

  // Clear the game board
  this.ctx.clearRect(0, 0, this.width, this.height);

  // Draw the food
  this.ctx.beginPath();
  this.ctx.arc(this.food_x, this.food_y, 5, 0, Math.PI * 2, true);
  this.ctx.closePath();
  this.ctx.fillStyle = 'blue';
  this.ctx.fill();
  
  // Draw/move the snake
  this.snake.draw();

  

  this.ctx.restore();
  
  var sg = this;
  window.requestAnimationFrame(function(){sg.draw()});
}

SnakeGame.prototype.redirect = function(e) {
  var key = "";
  if(e.keyCode == 0)
    key = e.key.toLowerCase();
  else {
    switch(e.keyCode) {
      case 37:
        key = "a";
        break;
      case 39:
        key = "d";
        break;
    }
  }

  var turning_speed = 0.1;

  if(e.type == "keypress") {
    if(key == "a")
      this.snake.rotation = -turning_speed;
    else if(key == "d")
      this.snake.rotation = turning_speed;
  }
  else if(e.type == "keyup") {
    this.snake.rotation = 0;
  }
}

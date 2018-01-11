/**
 * Canvas Snake Game.
 *
 * A challenge project (week 2 of 2018).
 *
 * @author Adam Handen (ahanden@github)
 */

/**
 * Create a new game of snake.
 *
 * This snake game uses vanilla JS compatable as far back as IE9. The game does
 * require use of either the arrow keys or WASD, so it is not compatible with
 * mobile devices. When providing an element as the container, make sure the
 * element is focusable in order for key pressed to be detected (tabindex="0").
 *
 * @constructor
 * @param {Node}  container               The Dom node to put the game in.
 * @param {float} [options.speed=4]       The speed of the snake's movment.
 * @param {int}   [options.snakesize=10]  The radius (in pixels) of the snake's
 *                                        girth.
 * @param {int}   [options.foodsize=5]    The radius (in pixels) of the snake
 *                                        food.
 * @param {float} [options.turnspeed=0.1] The turning speed of the snake
 *                                        (larger numbers make tighter turning
 *                                        patterns).
 */
function SnakeGame(container, options) {
  // Define game variables
  this.container = container;
  this.width     = this.container.offsetWidth;
  this.height    = this.container.offsetHeight;
  this.speed     = typeof options.speed      === 'undefined' ?
    4   : options.speed;
  this.snakesize = typeof options.snakesize  === 'undefined' ?
    10  : options.snakesize;
  this.foodsize  = typeof options.foodsize   === 'undefined' ?
    5   : options.foodsize;
  this.turnspeed = typeof options.turnradius === 'undefined' ?
    0.1 : options.turnspeed;

  // Setup the canvas for drawing
  this.canvas = document.createElement("canvas");
  this.canvas.width = this.width;
  this.canvas.height = this.height;
  this.container.appendChild(this.canvas);
  this.ctx = this.canvas.getContext('2d');

  // Add keyboard listners for snake movement
  var sg = this;
  this.container.onkeypress = function(e){
    e = e || window.event;
    sg.redirect(e);
  }
  this.container.onkeyup   = function(e){
    e = e || window.event;
    sg.redirect(e);
  }

  // Initialize the game
  this.reset();

  // Begin animation sequence
  window.requestAnimationFrame(function(){sg.draw()});
}

/**
 * Restart the snake game.
 *
 */
SnakeGame.prototype.reset = function() {
  // Game self-reference for later
  var sg = this;

  // Define initial food position
  this.food_x = this.width/4;
  this.food_y = this.height / 2;

  // Create the snake
  this.snake = {
    body: [{
      x     : this.width/4 * 3,
      y     : this.height/2,
      color : 'rgba(0, 125, 0, 1)'
    }],                  // The snake's body segments
    game: sg,            // The snake game object
    rotation: 0,         // Amount of turn (supplied by keyboard input)
    direction: Math.PI,  // The current direction the snake is moving
    draw: function() {   // Draws the snake
      var sg = this.game;
      // Drawing the segments in reverse order for desired overlap appearance
      for(var i = this.body.length - 1; i >= 0; i--) {
        sg.ctx.beginPath();
        sg.ctx.arc(
          this.body[i].x,
          this.body[i].y,
          sg.snakesize,
          0,
          Math.PI * 2,
          true
        );
        sg.ctx.closePath();
        sg.ctx.fillStyle = this.body[i].color;
        sg.ctx.fill();
      }
    },
    move: function() {   // Updates the position of each segment of the snake
      // Update the head's position first
      this.direction += this.rotation;
      this.body[0].x += Math.cos(this.direction) * this.game.speed;
      this.body[0].y += Math.sin(this.direction) * this.game.speed;

      // Update the rest of the body segments
      for(var i = 1; i < this.body.length; i++) {
        // Compute the direction and velocity for each segment
        var dx       = this.body[i-1].x - this.body[i].x,
            dy       = this.body[i-1].y - this.body[i].y,
            angle    = Math.atan2(dy, dx),
            distance = Math.abs(Math.sqrt(dx*dx + dy*dy)),
            velocity = Math.max(
              distance - this.game.speed - 1.5 * this.game.snakesize,
              0
            );

        // Update their positions
        this.body[i].x += Math.cos(angle) * velocity;
        this.body[i].y += Math.sin(angle) * velocity;
      }
    },
    feed: function() {   // Add a segment to the snake's body
      // Compute the segment's color using a sine wave (extra pretty!)
      var green = Math.floor(
        (Math.sin((this.body.length + 1) * Math.PI / 10) + 1) / 2 * 150 + 50
      );
      // Append the new segment at the position of the tail.
      // The new segment will appear to simply bud out.
      this.body.push({
        x     : this.body[this.body.length - 1].x,
        y     : this.body[this.body.length - 1].y,
        color : 'rgba(0, ' + green + ', 0, 1)'
      });
    },
    isDead: function() { // Determines whether the snake has died
      // Check to see if the head has moved out of bounds first
      if(this.body[0].x < 0 ||
          this.body[0].x > this.game.ctx.canvas.clientWidth ||
          this.body[0].y < 0 ||
          this.body[0].y > this.game.ctx.canvas.clientHeight)
        return true;

      // Check to see if the head is overlapping later segments.
      // Note that the second segment is skipped. It should be impossible for
      // the snake to accidentally overlap here.
      for(var i = 2; i < this.body.length; i++) {
        var dx       = this.body[0].x - this.body[i].x,
            dy       = this.body[0].y - this.body[i].y,
            distance = Math.abs(Math.sqrt(dx*dx + dy*dy));
        if(distance < this.game.snakesize * 1.5)
          return true;
      }

      return false;
    }
  }
}

/**
 * Draws a frame of the snake game (and requests the next frame too)
 *
 */
SnakeGame.prototype.draw = function() {

  // Move the snake
  this.snake.move();

  // Check to see if we've moved out of bounds
  if(this.snake.isDead())
    this.reset();

  // Check for feeding
  if(this.distance(
      [this.food_x, this.food_y],
      [this.snake.body[0].x, this.snake.body[0].y]) < this.foodsize + this.snakesize) {
    this.food_x = Math.random() * (this.width * 0.8) + this.width * 0.1;
    this.food_y = Math.random() * (this.height * 0.8) + this.width * 0.1;
    this.snake.feed();
  }

  // Save/restore calls are for buffering purposes
  this.ctx.save();

  // Clear the game board
  this.ctx.clearRect(0, 0, this.width, this.height);

  // Draw the food
  this.ctx.beginPath();
  this.ctx.arc(this.food_x, this.food_y, this.foodsize, 0, Math.PI * 2, true);
  this.ctx.closePath();
  this.ctx.fillStyle = 'blue';
  this.ctx.fill();
  
  // Draw/move the snake
  this.snake.draw();

  this.ctx.restore();
  
  var sg = this;
  window.requestAnimationFrame(function(){sg.draw()});
}

/**
 * Redirects the snake's head according to keyboard input. This method is setup
 * to accept either the left and right arrow keys or the "A" and "D" keys.
 *
 * @param {keypress|keyup} e  A keypress or keyup event to handle as direction.
 *
 */
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

  if(e.type == "keypress") {
    if(key == "a")
      this.snake.rotation = -this.turnspeed;
    else if(key == "d")
      this.snake.rotation = this.turnspeed;
  }
  else if(e.type == "keyup") {
    this.snake.rotation = 0;
  }
}

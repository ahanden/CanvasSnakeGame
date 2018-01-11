# Canvas Snake Game
This is a slightly modified take on the classic game of Snake. Instead of an
n x m grid, the game makes use of HTML's Canvas element. The snake body is
made of circular segments, and movement is fluid.

## Setup
You will need the `snake.js` file included in your HTML code.

```HTML
<script type="text/javascript" src="snake.js"></script>
```

To create a snake game, call the game constructor with the DOM element that
should contain the game.

The easieset way to do this is via the `onload` attribute of the body element.

```HTML
<body onload="new SnakeGame(document.getElementById('snake-game'));">
```

*Note:* If you choose an element for the game that is not focusable, the game
will not work. You can make an element focusable by adding the attribute
`tabindex="0"`.


## Configuration
You can further customize the game using various options of the constructor.

* `speed` - The movement speed of the snake (default=4)
* `snakesize` - The radius of the snake's segments (default=10)
* `foodsize` - The radius of snake food (default=5)
* `turnspeed` - The turning speed of the snake (larger numbers make tighter
                turns) (default=0.1)

Here's an example of a highly customized game of snake.
```HTML
<body onload="new SnakeGame(
	document.getElementById('snake-game'),
	{
		speed:     6,
		snakesize: 7,
		foodsize:  7,
		turnspeed: 0.2
	});">
```

## Demo
Feel free to checkout the `demo.html` file to see how everything fits together.

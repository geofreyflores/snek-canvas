//# sourceURL=canvas.js
(function() {
	"use strict"

	/* CONFIG start ---------------------------------------------------- */

	const dir = Object.freeze({ 
		up: Symbol('U'), down: Symbol('D'), right: Symbol('R'), left: Symbol('L'),
		opposite(d1, d2) {
			switch(d1) {
				case this.up: return d2 === this.down
				case this.down: return d2 === this.up
				case this.left: return d2 === this.right
				case this.right: return d2 === this.left
			}
		}
	})

	let config = {
		container: {
			w: 600, h: 600, /** canvas dimensions */
			fill: '#9BC327', stroke: '#d5f37e'
		},

		snake: {
			len: 5,
			fill: '#333333', stroke: '#d5f37e',
		},

		food: {
			fill: 'red', stroke: '#d5f37e',
		},

		game: {
			score: 0, highscore: 0,
			speed: 100, 
			size: 10,
			direction: dir.up,
		},
	}

	/* CONFIG end ------------------------------------------------------- */

	class Util {

		/** get random position as { x, y } */
		static rpos() {
			let { w, h } = config.container;
			let size = config.snake.size;
			const rand = (max) => Math.round(Math.random() * max / size) * size
			return { x: rand(w-size), y: rand(h-size) }
		}

		/** move { x, y } in direction */
		static move({x, y}, direction, size) {
			switch(direction) {
				case dir.up: return { x: x, y: y-size }
				case dir.down: return { x: x, y: y+size }
				case dir.right:  return { x: x+size, y: y }
				case dir.left:  return { x: x-size, y: y }
			}
		}

		static outOfBounds({x, y}) {
			let { w, h } = config.container;
			return (x < 0 || x > w) || (y < 0 || y > h)
		}

		static equals(pos1, pos2) {
			return pos1.x === pos2.x && pos1.y === pos2.y
		}
	}

	class Food {
		constructor(config, ctx) {
			this.pos = Util.rpos()
			this.ctx = ctx
			
			this.size = config.size
			this.fill = config.fill
			this.stroke = config.stroke
		}

		draw({ x, y } = this.pos) {
			let { size, fill, stroke } = this
			let valid = !Util.outOfBounds({x: x, y: y})

			if (valid) {
				// food square
				this.ctx.fillStyle = fill;
				this.ctx.fillRect(x, y, size, size);

				// food border
				this.ctx.strokeStyle = stroke
				this.ctx.strokeRect(x, y, size, size);
			}
			return valid
		}

		clear({x, y} = this.pos) {
			let size = this.size
			this.ctx.fillStyle = config.container.fill
			this.ctx.fillRect(x, y, size, size);
			this.ctx.strokeStyle = config.container.stroke
			this.ctx.strokeRect(x, y, size, size);
		}

		next() {
			this.pos = Util.rpos()
			this.draw()
		}
	}

	class Snake {
		constructor(config, ctx) {
			this.body = [Util.rpos()] // body[0]=tail body[len-1]=head
			
			this.size = config.size
			this.fill = config.fill
			this.config = config
			this.ctx = ctx
		}

		get head() {
			return this.body[this.body.length-1]
		}

		set head(pos) {
			this.body.push(pos)
		}

		get tail() {
			return this.body[0]
		}

		set tail(pos) {
			this.body.unshift(pos)
		}

		get length() {
			return this.body.length
		}

		removeTail() {
			return this.body.shift()
		}

		drawSquare({ x, y } = this.head) {
			let { size, fill, stroke } = this
			let valid = !Util.outOfBounds({x: x, y: y})

			if (valid) {
				// snake square
				this.ctx.fillStyle = fill;
				this.ctx.fillRect(x, y, size, size);

				// snake border
				this.ctx.strokeStyle = config.container.stroke
				this.ctx.strokeRect(x, y, size, size);
			}
			return valid
		}

		draw() {
			this.drawSquare()
			this.drawBody()
		}

		drawBody() {
			let { x, y } = this.head;

			for (let i = 0; i < this.config.len-1; i++) {
				this.tail = { x: x, y: y=y+this.size }
				this.drawSquare(this.tail)
			}
		}

		move(dir, keepTail) {
			this.head = Util.move(this.head, dir, this.size);
			if (!keepTail) {
				this.clear(this.tail)
				this.removeTail() // update tail
			}
			return this.drawSquare()
		}

		clear({x, y}) {
			let size = this.config.size
			this.ctx.fillStyle = config.container.fill
			this.ctx.fillRect(x, y, size, size);
			this.ctx.strokeStyle = config.container.stroke
			this.ctx.strokeRect(x, y, size, size);
		}
		
		equals(pos) {
			return Util.equals(this.head, pos)
		}
 	}

	
	function addKeyListeners() {
		let game = config.game.inst
		document.onkeydown = (e) => {
			let k = e.which || e.keyCode
			let orig = game.direction
			const update = (d) => {
				if (!dir.opposite(d, game.direction)) game.direction = d;
			}
			switch (k) {
				case 38: update(dir.up); break;			// up
				case 40: update(dir.down); break;		// down
				case 37: update(dir.left); break;		// left
				case 39: update(dir.right); break;	// right
			}

		}
	}

	function drawContainer(ctx) {
		let { w, h, fill, stroke } = config.container
		let size = config.game.size

		// draw container
		ctx.fillStyle = fill
		ctx.fillRect(0, 0, w, h);

		// draw grid
		let x = 0, y = 0
		for (let x = 0; x < w; x += size) {
			for (let y = 0; y < h; y += size) {
				ctx.strokeStyle = stroke
				ctx.strokeRect(x, y, size, size)
			}
		}
	}

	;(function init() {
		config.game.inst = Object.assign({}, config.game)
		config.snake.size = config.food.size = config.game.size
		startGame()
	})()

	function startGame() {
		let canvas = document.getElementById('snek');
		let ctx = canvas.getContext('2d')

		config.game.inst = {}
		let game = config.game.inst = Object.assign({}, config.game)
		let snake = new Snake(config.snake, ctx)
		let food = new Food(config.food, ctx)

		document.getElementById("highscore").innerHTML = config.game.highscore
		document.getElementById("score").innerHTML = game.score

		// init draw
		drawContainer(ctx)
		snake.draw()
		food.draw()

		addKeyListeners()

		let collision, stopDraw

		stopDraw = setTimeout(moveSnake, game.speed)
		function moveSnake() {
			if (!snake.move(game.direction, collision) ) {
				clearTimeout(stopDraw)
				return startGame()
			}

			if (collision = snake.equals(food.pos)) {
				food.next() // generate next food
				game.score++
				if (game.score > config.game.highscore) config.game.highscore = game.score
				document.getElementById("score").innerHTML = game.score
				if (game.score % 5 === 0) game.speed -= 10
			}
			stopDraw = setTimeout(moveSnake, game.speed)
		}
	}

})()
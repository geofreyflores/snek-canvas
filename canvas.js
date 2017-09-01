(function() {
	"use strict"

	/* CONFIG start ---------------------------------------------------- */

	let config = {
		container: {
			w: 600, h: 600, /** canvas dimensions */
			fill: 'aliceblue'
		},

		snake: {
			size: 10, 
			fill: 'green', stroke: 'darkgreen'
		},

		food: {
			size: 50, /** needs to be the same size */
			fill: 'red', stroke: 'yellow',
		},

		game: {
			score: 0
		},
	}

	/* CONFIG end ------------------------------------------------------- */

	class Util {
		static xyRand() {
			let { w, h } = config.container;
			let offset = config.snake.size;
			const rand = (x) => Math.round(Math.random() * x)
			return {x:rand(w-offset), y:rand(h-offset)}
		}
	}

	class Draw {
		constructor(ctx, config) {
			this.ctx = ctx
			this.config = config
		}

		container() {
			let { w, h, fill } = this.config.container
			this.ctx.fillStyle = fill
			this.ctx.fillRect(0, 0, w, h);
		}

		snake({x, y}) {
			let { size, stroke, fill } = this.config.snake
			// snake square
			this.ctx.fillStyle = fill;
			this.ctx.fillRect(x, y, size, size);

			// snake stroke
			// this.ctx.strokeStyle = stroke;
			// this.ctx.strokeRect(x*size, y*size, size, size);
		}

		food({x, y}) {
			let { size, stroke, fill } = this.config.food;

			// food border
			ctx.fillStyle = stroke;
			ctx.fillRect(x* size, y*size, size, size);

			// food square
			ctx.fillStyle = fill;
			ctx.fillRect(x*size+1, y*size+1, size-2, size-2);
		}
	}

	;(function init() {
		let canvas = document.getElementById('snek');
		let ctx = canvas.getContext('2d')

		let draw = new Draw(ctx, config)
		const { xyRand } = Util; // import

		draw.container();
		draw.snake(xyRand())
	})()

})()
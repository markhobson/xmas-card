function main()
{
	var canvas = document.getElementById("canvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	new Snow(canvas);
}

function Snow(canvas) {
	var context = canvas.getContext("2d");
	context.fillStyle = "#000000";
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	context.font = "bold 20px Georgia, serif";
	centerText(canvas, "Merry Christmas!", "#ff0000", "#400000");
	
	var delay = 20;
	var buffer = new Buffer(canvas);
	
	this.createFlakes = function(n, buffer) {
		var flakes = new Array();
		
		for (var i = 0; i < n; i++) {
			var x;
			var y;
			
			do {
				x = Math.floor(Math.random() * buffer.width);
				y = Math.floor(Math.random() * buffer.height);
			}
			while (buffer.getPixel(x, y) == 1);
			
			flakes[i] = new Flake(x, y);
		}

		return flakes;
	};
	
	this.flakes = this.createFlakes(1000, buffer);
	
	var self = this;
	
	this.animate = function() {
		for (var i in self.flakes) {
			var flake = self.flakes[i];
			
			flake.clear(context);
			flake.move(buffer);
			flake.paint(context);
			
			if (flake.stuck || flake.y == canvas.height - 1) {
				buffer.setPixel(flake.x, flake.y, 1);
				
				flake.reset(Math.floor(Math.random() * canvas.width), 0);
			}
		}
	};
	
	setInterval(this.animate, delay);
}

function centerText(canvas, text, startColor, endColor) {
	var context = canvas.getContext("2d");
	var metrics = context.measureText(text);
	
	var width = canvas.width * 3 / 4;
	var scale = width / metrics.width;
	
	var x = (canvas.width - width) / 2;
	var y = canvas.height / 2;
	
	var fontSize = 20;
	var y1 = y / scale;
	var y0 = y1 - fontSize * 3 / 4;
	var gradient = context.createLinearGradient(0, y0, 0, y1);
	gradient.addColorStop("0", startColor);
	gradient.addColorStop("1", endColor);
	context.fillStyle = gradient;

	context.scale(scale, scale);
	context.fillText(text, x / scale, y / scale);
	context.setTransform(1, 0, 0, 1, 0, 0);
}

function Buffer(canvas) {
	this.width = canvas.width;
	this.height = canvas.height;
	this.pixels = new Array();
	
	var context = canvas.getContext("2d");
	var imageData = context.getImageData(0, 0, this.width, this.height);
	var n = this.width * this.height;
	
	for (var i = 0; i < n; i++) {
		var empty = imageData.data[i * 4] == 0
			&& imageData.data[i * 4 + 1] == 0
			&& imageData.data[i * 4 + 2] == 0;
		
		this.pixels[i] = empty ? 0 : 1;
	}
	
	this.getPixel = function(x, y) {
		return this.pixels[this.width * y + x];
	};
	
	this.setPixel = function(x, y, p) {
		this.pixels[this.width * y + x] = p;
	};
}

function Flake(x, y) {
	this.reset = function(x, y) {
		this.x = x;
		this.y = y;
		this.stuck = false;
	};
	
	this.reset(x, y);
	
	this.clear = function(context) {
		this.paint(context, "#000000");
	};
	
	this.paint = function(context, color) {
		if (color === undefined) {
			color = "#ffffff";
		}
		
		context.fillStyle = color;
		context.fillRect(this.x, this.y, 1, 1);
	};
	
	this.move = function(buffer) {
		if (buffer.getPixel(this.x, this.y + 1) == 0) {
			this.y++;
		}
		else if (buffer.getPixel(this.x - 1, this.y + 1) == 0) {
			this.x--;
			this.y++;
		}
		else if (buffer.getPixel(this.x + 1, this.y + 1) == 0) {
			this.x++;
			this.y++;
		}
		else {
			this.stuck = true;
		}
	};
}

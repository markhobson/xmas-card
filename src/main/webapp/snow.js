function main()
{
	var canvas = document.getElementById("canvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	var snow = new Snow(canvas);
	snow.start();
}

function Snow(canvas) {
	var paintBackground = function(canvas) {
		var context = canvas.getContext("2d");
		
		context.fillStyle = "#000000";
		context.fillRect(0, 0, canvas.width, canvas.height);
		
		context.font = "bold 20px Georgia, serif";
		centerText(canvas, "Merry Christmas!", "#ff0000", "#400000");
	};
	
	var centerText = function(canvas, text, startColor, endColor) {
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
	};

	var createFlakes = function(n, buffer) {
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
	
	paintBackground(canvas);
	var buffer = new Buffer(canvas);
	var flakes = createFlakes(1000, buffer);
	
	var animate = function() {
		var context = canvas.getContext("2d");
		
		for (var i in flakes) {
			var flake = flakes[i];
			
			flake.clear(context);
			flake.move(buffer);
			flake.paint(context);
			
			if (flake.stuck || flake.y == canvas.height - 1) {
				buffer.setPixel(flake.x, flake.y, 1);
				
				flake.reset(Math.floor(Math.random() * canvas.width), 0);
			}
		}
	};
	
	this.start = function() {
		setInterval(animate, 20);
	};
}

function Buffer(canvas) {
	var self = this;
	
	var createPixels = function(canvas) {
		var context = canvas.getContext("2d");
		var imageData = context.getImageData(0, 0, self.width, self.height);
		
		var n = self.width * self.height;
		var pixels = new Array();
		
		for (var i = 0; i < n; i++) {
			pixels[i] = isEmpty(imageData, i) ? 0 : 1;
		}

		return pixels;
	};
	
	var isEmpty = function(imageData, pixelIndex) {
		var dataIndex = pixelIndex * 4;
		
		return imageData.data[dataIndex] == 0
			&& imageData.data[dataIndex + 1] == 0
			&& imageData.data[dataIndex + 2] == 0;
	};
	
	self.width = canvas.width;
	self.height = canvas.height;
	var pixels = createPixels(canvas);
	
	self.getPixel = function(x, y) {
		return pixels[self.width * y + x];
	};
	
	self.setPixel = function(x, y, p) {
		pixels[self.width * y + x] = p;
	};
}

function Flake(x, y) {
	var self = this;
	
	self.reset = function(x, y) {
		self.x = x;
		self.y = y;
		self.stuck = false;
	};
	
	self.reset(x, y);
	
	var paint = function(context, color) {
		context.fillStyle = color;
		context.fillRect(self.x, self.y, 1, 1);
	};
	
	self.clear = function(context) {
		paint(context, "#000000");
	};
	
	self.paint = function(context, color) {
		paint(context, "#ffffff");
	};
	
	var isEmpty = function(buffer, dx, dy) {
		return buffer.getPixel(self.x + dx, self.y + dy) == 0;
	};
	
	self.move = function(buffer) {
		if (isEmpty(buffer, 0, 1)) {
			self.y++;
		}
		else if (isEmpty(buffer, -1, 1)) {
			self.x--;
			self.y++;
		}
		else if (isEmpty(buffer, 1, 1)) {
			self.x++;
			self.y++;
		}
		else {
			self.stuck = true;
		}
	};
}

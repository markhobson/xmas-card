function main()
{
	var canvas = document.getElementById("canvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	var context = canvas.getContext("2d");
	context.fillStyle = '#000000';
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	var n = 100;
	var delay = 20;
	
	var flakes = new Array();
	
	for (var i = 0; i < n; i++) {
		var x = Math.floor(Math.random() * canvas.width);
		var y = Math.floor(Math.random() * canvas.height);
		
		flakes[i] = new Flake(x, y);
	}
	
	setInterval(function() {
		for (var i in flakes) {
			flakes[i].clear(context);
			flakes[i].move(canvas, context);
			flakes[i].paint(context);
			
			if (flakes[i].y == canvas.height - 1) {
				flakes[i].y = 0;
			}
		}
	}, delay);
}

function Flake(x, y) {
	this.x = x;
	this.y = y;
	
	this.clear = function(context) {
		context.fillStyle = '#000000';
		context.fillRect(this.x, this.y, 1, 1);
	};
	
	this.paint = function(context) {
		context.fillStyle = '#ffffff';
		context.fillRect(this.x, this.y, 1, 1);
	};
	
	this.move = function(canvas, context) {
		var random = Math.random();
		
		if (random < 0.1) {
			this.x--;
		}
		else if (random > 0.9) {
			this.x++;
		}
		
		this.y++;
	};
}

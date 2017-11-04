
//once the html is ready, excecute everything inside the block
$(document).ready(function(){
//setting up the game
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var gameOver = true;

//setting up the constants
const PI = Math.PI;
const HEIGHT = canvas.height;
const WIDTH =canvas.width;
const upKey = 38, downKey = 40;


//User inputs, set the defualt key pressed to null so the pad dosent move
var keyPressed = null;

//setting up game objects (player, ai and ball)
var player = {
	x: null,
	y: null,
	width: 20,
	height: 100,
	update: function(){
		if(keyPressed == upKey) this.y -= 10;
		if(keyPressed == downKey) this.y += 10;
	},
	draw: function(){
	//draw the rectangle/paddle
		ctx.fillRect(this.x, this.y, this.width, this.height)

	}
}
var ai = {
	x: null,
	y: null,
	width: 20,
	height: 100,
	update: function(){
		//moves around the paddle(AI)
		let target = ball.y - (this.height - ball.size) / 2;
		this.y += (target - this.y) * 0.1;
	},
	draw: function(){
		ctx.fillRect(this.x, this.y, this.width, this.height)

	}
}
var ball = {
	x: null,
	y: null,
	size: 20,
	speedx: null,
	speedy: null,
	speed: 10,
	update: function(){
		this.x += this.speedx;
		this.y += this.speedy;

		//bounce of top and bottom edge
		if(this.y + this.size >= HEIGHT || this.y <= 0){
			this.speedy *= -1;

		}

		function checkCollision(a,b){
			//return true if objects are colliding
			return (a.x <b.x + b.width && a.y<b.y+b.height&&b.x<a.x+a.size&&b.y<a.y + a.size);
		}

		//movement direction determines which object the ball collide with
		//let is only in the block(block scope)
		let other;
		if (this.speedx<0){
			other = player;
		}else{
			other = ai;

		}
		//check for collision using the check collison function
		let collided = checkCollision(ball, other);
		
		//an equation to bounce ball
		if (collided){
			let n = (this.y + this.size - other.y)/(other.height + this.size);
			let phi = 0.25 * PI * (2*n-1);
			this.speedx=this.speed * Math.cos(phi);
			this.speedy = this.speed * Math.sin(phi);
			if (other == ai) this.speedx *= -1;
		}
		//check collide with the sides
		if (this.x + this.size < 0 || this.x > WIDTH){
			gameOver = true;
			$("button").fadeIn();
			if(this.x + this.size < 0){
				$("h1").html("You Lose!");
			}else{
				$("h1").html("You Win!");
			}		
		}

	},
	draw: function(){
	ctx.fillRect(this.x, this.y, this.size, this.size)
	}
}
//functions
function main(){

	//initialize game
	init();
	//create function called loop
	var loop = function(){
		//update and draw
		update();
		draw();
		//calls the loop func inside the loop func
		window.requestAnimationFrame(loop,canvas);
	}
	//this is better than set interval as it wont lag as much.
	window.requestAnimationFrame(loop,canvas);
}

function init(){
	gameOver = false;
	//reset title
	$('h1').html("Pong");
	//move the player and AI to position
	player.x = 20;
	player.y = (HEIGHT - player.height)/2;
	ai.x = (WIDTH - 20 - ai.width);
	ai.y = (HEIGHT - ai.height)/2;

	//put ball in center
	ball.x = (WIDTH-ball.size)/2;
	ball.y = (HEIGHT-ball.size)/2;
	//serve the ball
	ball.speedx = ball.speed;
	//serve randomly to left.right
	if(Math.round(Math.random())) 
		ball.speedx*= 1;
	ball.speedy = 0;
}


function update(){
	//if game is not over, then run this
	if (!gameOver){
		ball.update();
	}
	ai.update();
	player.update();



}
function draw(){
//fill the background colour
	ctx.fillRect(0,0,WIDTH,HEIGHT);

	ctx.save(); //saves the current settings of drawing

	//draw the game object
	ctx.fillStyle = "white";
	//draw the game objects
	player.draw();
	ai.draw();
	ball.draw();

	//draw the middle white stripes
	//the width of the line
	let w = 4;
	//x cord of line
	let x = (WIDTH - w)/2;
	//the y cord of the line
	let y = 0;
	//step is the number of space before drawing the next line
	let step = HEIGHT/15;
	//draw line until it hits the edge
	while(y<HEIGHT){
		//draw the rectangle line(y offset it by a bit for asthetic puropuses)
		ctx.fillRect(x, y + step * 0.25, w, step/2);
		//increase the y
		y = y+step;

	}

	ctx.restore(); //restore the saved settings
}
// sense the user's unputs
//key is released
$(document).on("keyup", function(){
	keyPressed = null;
})
//key is pressed
$(document).on("keydown", function(e){
	keyPressed = e.which;
})
//start the game
main();

});
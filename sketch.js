//var font;
//var points = [];
var arr = [];

var zoomLevel = 1000
var smoothMicLevel = 0;
var n = 0;
var c = 55;
var size
var an = 169.5;
var zoom = 1000;
var song;

function preload() {
  song = loadSound("audio/zemfira.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  colorMode(HSB);
  angleMode(DEGREES);
  slider = createSlider(0, 1, 0.5, 0.01);
  button = createButton("Play");
  button.mousePressed(togglePlay);

  for (let n = 0; n < 4000; n++) {
    var a = n * an;

    var r = c * sqrt(n) * n / zoom
    var col = a % 256;    // n* sin(n)*2/200;
    size = cos(n) * 1.5 + 2.5;
    var x = r * sin(a) + width / 2;
    var y = r * cos(a) + height / 2;

    arr.push(new Character(x, y, col, size));

  }
}

function draw() {
  background(0);
  song.setVolume(slider.value());

  // if (song.setVolume > 0.02) {
  //   zoom += 300;
  //   drawZoom();

  // } else if (song.setVolume < 20000) {
  //   zoom -= 300;
  //   drawZoom();
  //   console.log(song.setVolume);
    
  // }

  for (var i = 0; i < arr.length; i++) {
    var v = arr[i];
    v.behaviors();
    v.update();
    v.show();
  }

  if (mouseIsPressed) {
    for (var i = 0; i < arr.length; i++) {
      var v = arr[i];
      v.pos = createVector(random(width) * 0.1, random(height) * 0.1)
    }
  }


  if (keyIsPressed) {
    drawZoom();
    if (key == '-') zoom -= 150;
    else if (key == '+') zoom += 150;
    else if (key == 'r') zoom *= -1;
    else if (key == 'o') zoom *= 20;
    // console.log(zoom)
  }

}


function Character(x, y, col, z) {
  this.pos = createVector(random(width) * 1, random(height) * 1);
  this.acc = createVector();
  this.vel = createVector();
  this.target = createVector(x, y)
  this.maxspeed = 13;
  this.maxforce = 20.5;
  // this.r= random(20,255);
  //  this.g= random(20,255);
  //   this.b= random(20,255);
  this.col = col;
  this.z = z;
}

Character.prototype.behaviors = function () {
  var arrive = this.arrive(this.target);

  var mouse = createVector(mouseX, mouseY);
  var flee = this.flee(mouse);

  flee.mult(5);
  this.applyForce(flee);
  this.applyForce(arrive)

}

Character.prototype.flee = function (target) {
  var desired = p5.Vector.sub(target, this.pos);
  var d = desired.mag();

  if (d < 60) {
    desired.setMag(this.maxspeed);
    desired.mult(-1);
    var steer = p5.Vector.sub(desired, this.vel)
    steer.limit(this.maxforce)

    return steer;
  }

  else return createVector(0, 0)
}

Character.prototype.arrive = function (target) {
  var desired = p5.Vector.sub(target, this.pos);
  var d = desired.mag(); //dist(this.pos.x,this.pos.y,target.x,target.y)
  var speed = this.maxspeed;
  if (d < 60) {
    speed = map(d, 0, 100, 0.2, this.maxspeed)
  }
  desired.setMag(speed);
  var steer = p5.Vector.sub(desired, this.vel)
  steer.limit(this.maxforce)
  return steer;
}

Character.prototype.applyForce = function (f) {
  this.acc.add(f);
}


Character.prototype.update = function () {
  this.pos.add(this.vel);
  this.vel.add(this.acc);
  this.acc.mult(0);

}

Character.prototype.show = function () {
  fill(this.col, 255, 255);
  //strokeWeight(3)
  noStroke();
  ellipse(this.pos.x, this.pos.y, this.z + 2, this.z + 2)
}

function drawZoom() {
  an = 169.5;

  for (var i = 0; i < arr.length; i++) {
    var v = arr[i];

    an -= 0.001;
    var a = i * an;
    var r = c * sqrt(i) * i / zoom;
    var x = r * sin(a) + width / 2;
    var y = r * cos(a) + height / 2;


    v.target = createVector(x, y);
  }
}
function togglePlay() {
  if (!song.isPlaying()){
      song.play();
      button.html("Pause");
  } else {
      song.stop();
      button.html("Play");
  }
}

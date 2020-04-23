// Children's Drawing for Harlem Renaissance @ Gottesman Libraries
// version 1.00 solo blank canvas mode
// April 2020
// by CARLiE YUTONG ZHANG

//color buttons
var colors = ['#e2af6e', '#d44a2e', '#019daa', '#86c045', '#295799', '#811c17', '#000', '#fff']; //white, red, blue, green, yellow, gray, black
let colorBtn = [];

// Store canvas drawing info
var w, h, scl;

let c;
let force;

// All the paths
let paths = [];

// Are we painting?
let painting = false;

// Where are we now and where were we?
let current;
let previous;

// Record image
// let img;

let sketch = function(p) {

  // p.preload = function() {
  //     img = p.loadImage(imgURL);
  // }

  p.setup = function() {
    /************ user interface ************/
    let btnContainer = document.getElementById('btnHolder');

    // colors
    c = colors[colors.length-2];

    for( let i = 0; i < colors.length; i++) {
      colorBtn[i] = p.createButton('');
      // colorBtn[i].position(15, 160 + 80*i);
      colorBtn[i].parent(btnContainer);
      colorBtn[i].class('colorBtn');
      colorBtn[i].style('background-color', colors[i]);
      colorBtn[i].mousePressed(function(){
        c = colors[i];
        for( let i = 0; i < colors.length; i++) {
          colorBtn[i].removeClass('activeColor');
        }
        this.addClass('activeColor');
      });
    }
    colorBtn[colors.length-2].addClass('activeColor');

    // buttons
    resetBtn = p.createButton('Clear');
    resetBtn.class('resetBtn');
    resetBtn.parent(btnContainer);
    resetBtn.mousePressed(resetCanvas);

    // Only desktop can save
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/iPad|iPhone|iPod|Android|Windows Phone/.test(userAgent) && !window.MSStream) {

    } else{
      submitBtn = p.createButton('Save');
      submitBtn.parent(btnContainer);
      submitBtn.mousePressed(saveImg);
    }


    /************ canvas ************/
    let cnvContainer = document.getElementById('cnvHolder');

    w = 580;
    h = 580;
    scl = w/768;

    let cnv = p.createCanvas(w, h);
    cnv.parent(cnvContainer);

    //attach listener for canvas click only
    cnv.mousePressed(cnvPressed);
    cnv.mouseReleased(cnvReleased);

    //touch screen
    cnv.touchStarted(cnvPressed);
    cnv.touchEnded(cnvReleased);
    cnv.touchMoved(cnvDragged);

    p.background(255);
    // p.image(img, 0, 0, w, h);

    //drawing set up
    current = p.createVector(0,0);
    previous = p.createVector(0,0);


  }

  p.draw = function() {
    // nothing happening here
    if((p.mouseX<0)||(p.mouseX>w)||(p.mouseY<0)||(p.mouseY>h)){
      cnvReleased();
    }
  }

  p.mouseDragged = function() {
    cnvDragged();
  }
}

let myp5 = new p5(sketch);

// Start it up
function cnvPressed() {
  painting = true;
  previous.x = myp5.mouseX;
  previous.y = myp5.mouseY;
  paths.push(new Path());
}

function cnvDragged() {
  if (painting) {
    if (c == '#fff'){
      myp5.fill(255);
      myp5.noStroke();
      myp5.ellipse(myp5.mouseX, myp5.mouseY, 15, 15);
    }
    else{
      paint(myp5.mouseX, myp5.mouseY, c);
    }
  }
}

// Stop
function cnvReleased() {
  // Remove my path from array
  for( let i = 0; i < paths.length; i++) {
    paths.splice(i,1);
  }
  painting = false;
}

function resetCanvas() {
  paths.splice(0);
  myp5.background (255);
  // myp5.image(img, 0, 0, w, h);
}


function saveImg() {

  let y = myp5.year();
  let mt = myp5.month();
  let d = myp5.day();
  let h = myp5.hour();
  let m = myp5.minute();
  let s = myp5.second();
  var ImgName = myp5.str(y) + myp5.str(mt) + myp5.str(d) + myp5.str(h) + myp5.str(m) + myp5.str(s);
  console.log(ImgName);
  myp5.saveCanvas(ImgName,"png");

  // resetCanvas();
  // window.location.reload(true);
}


function paint(x, y, color){
  // Grab mouse position      
  current.x = x;
  current.y = y;

  // New particle's force is based on mouse movement
  force = p5.Vector.dist(current, previous);
  force = 5 - force*0.2;
  if (force < 1){
    force = 1;
  }

  // Select path
  for( let i = 0; i < paths.length; i++) {
      // Add new particle
      paths[i].add(current, force*scl, color);
      paths[i].display();
  }

  // Store mouse values
  previous.x = current.x;
  previous.y = current.y;
}



// A Path is a list of particles
class Path {
  constructor() {
    this.particles = [];
  }

  add(position, force, color) {
    // Add a new particle with a position and force
    this.particles.push(new Particle(position, force, color));
  }
  
  // Display path
  display() {    
    // Loop through backwards
    for (let i = this.particles.length - 1; i >= 0; i--) {
      myp5.stroke(this.particles[i].c);
      this.particles[i].display(this.particles[i+1]);
    }
  }  
}

// Particles along the path
class Particle {
  constructor(position, force, color) {
    this.position = myp5.createVector(position.x, position.y);
    this.fat = force;
    this.c = color;
  }
  // Draw a line to another
  display(other) {  
    // draw a line
    if (other) {
      myp5.strokeWeight(other.fat + this.fat*0.5);
      myp5.line(this.position.x, this.position.y, other.position.x, other.position.y);
    }
  }
}


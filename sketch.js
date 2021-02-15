// VIDEO EXPORT
const fps = 30;
let frame = 1;
let capturer;
let btn;

function record() {
  capturer = new CCapture({
    format: 'png',
    framerate: fps
  });
  
  capturer.start();
  
  btn.textContent = "stop recording";
  
  btn.onclick = e => {
    capturer.stop();
    capturer.save();
    capturer = null;
    
    btn.textContent = "start recording";
    btn.onclick = record;
  };
}

let FORM_SIZE = 60;

// COLORS
let theme1 = [];
let theme2 = [];
let theme3 = [];
let theme4 = [];

let PALETTE = [];

// LAYOUT
const ROWS = 30;
const COLS = 30;

const MARGIN = FORM_SIZE * 4;
const PADDING = FORM_SIZE * 0.5;

const GRIDBOX = FORM_SIZE + PADDING;
const START = FORM_SIZE + MARGIN;
const START2 = -(GRIDBOX * COLS / 2) + FORM_SIZE;

// FORMS
const forms = [];
let angle = 0;

function setup() {
  const totalX = START + MARGIN + GRIDBOX * COLS;
  const totalY = START + MARGIN + GRIDBOX * ROWS;
  console.log(totalX);
  createCanvas(totalX, totalY, WEBGL);

  // MODES
  rectMode(CENTER);
  angleMode(DEGREES);
  colorMode(HSB);

  // COLOR
  theme1 = [
    color(0, 0, 10), // dark gray
    color(0, 0, 40), // light gray
    color(0, 0, 70) // very light gray
  ];

  theme2 = [
    color(180, 100, 30), // dark cyan
    color(180, 100, 60), // light cyan
    color(180, 100, 90) // very light cyan
  ];

  theme3 = [
    color(300, 100, 30), // dark magenta
    color(300, 100, 60), // light magenta
    color(300, 100, 90) // very light magenta
  ];
  
  theme4 = [
    color(60, 100, 30), // dark yellow
    color(60, 100, 60), // light yellow
    color(60, 100, 90) // very light yellow
  ];

  PALETTE = theme3;

  // FORMS
  for (let x = 0; x < ROWS; x++) {
    for (let y = 0; y < COLS; y++) {
      const posX = START2 + (x * GRIDBOX);
      const posY = START2 + (y * GRIDBOX);

      forms.push(new Form(posX, posY))
    }
  }
  
  // VIDEO EXPORT
  frameRate(fps);
  btn = document.createElement("button");
  btn.textContent = "start recording";
  document.body.appendChild(btn);
  btn.onclick = record;
  // btn.click(); // starts recording immediately
}

function draw() {
  let dx = sin(angle) * width / 2;
  let dy = cos(angle) * height / 2;

  let v = createVector(dx, dy, 0);
  v.normalize();

  // LIGHTS
  ambientLight(120);
  pointLight(0, 0, 100, dx, 0, 0);
  // pointLight(getRandomFromPalette(), 0, dy, 0);
  // directionalLight(0, 0, 0, v);

  angle += 0.001;

  background(PALETTE[2]);
  noStroke();

  // FORM GRID
  for (let i = 0; i < forms.length; i++) {
    const currForm = forms[i];
    push();
    translate(currForm.x, currForm.y);
    applyTransformation(currForm.transform, currForm.counter);
    currForm.render();
    currForm.counter += currForm.inc;
    pop();
  }

  // BORDER
  push();
  noFill();
  stroke(PALETTE[0]);
  rect(0, 0, START + (GRIDBOX * COLS), START + (GRIDBOX * ROWS))
  pop();

  // noLoop();
  
  // console.log(frame++);
  
  // Trigger video capture
  if (capturer) {
    capturer.capture(document.getElementById("defaultCanvas0"));
  }
}





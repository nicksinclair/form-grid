p5.disableFriendlyErrors = true;

let ROWS = 10;
let COLS = 10;
let FORM_SIZE = 40;

let prev_rows = ROWS;
let prev_cols = COLS;
// let prevFormSize = FORM_SIZE;

// UI DOM ELEMENTS
let primaryColorPicker;
let secondaryColorPicker;
let backgroundColorPicker;

let rowSlider;
let columnSlider;
// let formSizeSlider;

// VIDEO EXPORT
const fps = 30;
let frame = 1;
let capturer = new CCapture({
  format: "png",
  framerate: fps,
});
let recording = false;
let recordButton;

// THEMES
let dynamicTheme = [];
// let theme1 = [];
// let theme2 = [];
// let theme3 = [];
// let theme4 = [];
let PALETTE = [];

// LAYOUT
let MARGIN = FORM_SIZE * 4;
let PADDING = FORM_SIZE * 0.5;

let GRIDBOX = FORM_SIZE + PADDING;
let START = FORM_SIZE + MARGIN;
let ROW_START = -((GRIDBOX * ROWS) / 2) + FORM_SIZE * 0.75;
let COL_START = -((GRIDBOX * COLS) / 2) + FORM_SIZE * 0.75;

let totalX = START + MARGIN + GRIDBOX * COLS;
let totalY = START + MARGIN + GRIDBOX * ROWS;

// FORMS
const forms = [];
let angle = 0;

function setup() {
  pixelDensity(1);
  colorMode(HSB);

  let maxRows = ceil((windowHeight - (START + MARGIN)) / GRIDBOX);
  let maxCols = floor((windowWidth - (START + MARGIN + 350)) / GRIDBOX);

  // UI DOM ELEMENTS
  // parent ui element
  const ui = createDiv().class("control-panel");

  // labels
  const primaryLabel = createDiv("PRIMARY COLOR").class("label").parent(ui);
  const secondaryLabel = createDiv("SECONDARY COLOR").class("label").parent(ui);
  const backgroundLabel = createDiv("BACKGROUND COLOR")
    .class("label")
    .parent(ui);

  const rowLabel = createDiv("ROWS").class("label").parent(ui);
  const colLabel = createDiv("COLUMNS").class("label").parent(ui);

  // color pickers
  primaryColorPicker = createColorPicker(color(180, 100, 30))
    .class("color-picker")
    .parent(primaryLabel);
  secondaryColorPicker = createColorPicker(color(180, 100, 60))
    .class("color-picker")
    .parent(secondaryLabel);
  backgroundColorPicker = createColorPicker(color(180, 100, 90))
    .class("color-picker")
    .parent(backgroundLabel);

  // sliders
  rowSlider = createSlider(2, maxRows, 10, 1).class("slider").parent(rowLabel);
  colSlider = createSlider(2, maxCols, 10, 1).class("slider").parent(colLabel);
  // formSizeSlider = createSlider(10, 30, 10, 1).class("slider").parent(ui);

  // VIDEO EXPORT
  // frameRate(fps);
  recordButton = document.createElement("button");
  recordButton.textContent = "START RECORDING";
  document.getElementsByClassName("control-panel")[0].appendChild(recordButton);
  recordButton.onclick = record;
  // recordButton.click(); // starts recording immediately

  // LAYOUT
  createCanvas(totalX, totalY, WEBGL);

  // MODES
  rectMode(CENTER);
  angleMode(DEGREES);

  // COLOR
  // theme1 = [
  //   color(0, 0, 10), // dark gray
  //   color(0, 0, 40), // light gray
  //   color(0, 0, 70), // very light gray
  // ];

  // theme2 = [
  //   color(180, 100, 30), // dark cyan
  //   color(180, 100, 60), // light cyan
  //   color(180, 100, 90), // very light cyan
  // ];

  // theme3 = [
  //   color(300, 100, 30), // dark magenta
  //   color(300, 100, 60), // light magenta
  //   color(300, 100, 90), // very light magenta
  // ];

  // theme4 = [
  //   color(60, 100, 30), // dark yellow
  //   color(60, 100, 60), // light yellow
  //   color(60, 100, 90), // very light yellow
  // ];
  calculatePalette();

  // FORMS
  generateForms();
}

function draw() {
  let dx = (sin(angle) * width) / 2;
  // let dy = (cos(angle) * height) / 2;

  // let v = createVector(dx, dy, 0);
  // v.normalize();

  // LAYOUT
  calculateLayout();

  // COLOR
  calculatePalette();

  // LIGHTS
  ambientLight(120);
  pointLight(0, 0, 100, dx, 0, 0);

  angle += 0.001;

  background(PALETTE[2]);
  noStroke();

  // FORM GRID
  renderForms();

  // BORDER
  push();
  noFill();
  stroke(PALETTE[0]);
  rect(0, 0, START + GRIDBOX * COLS, START + GRIDBOX * ROWS);
  pop();

  // console.log(frameRate());

  // Uncomment to stop interactivity
  // noLoop();

  // Trigger video capture
  if (recording) {
    capturer.capture(document.getElementById("defaultCanvas0"));
  }
}

function generateForms() {
  forms.splice(0, forms.length);

  for (let x = 0; x < COLS; x++) {
    for (let y = 0; y < ROWS; y++) {
      const posX = COL_START + x * GRIDBOX;
      const posY = ROW_START + y * GRIDBOX;

      forms.push(new Form(posX, posY));
    }
  }
}

function renderForms() {
  forms.forEach((form) => {
    push();
    translate(form.x, form.y);
    applyTransformation(form.transform, form.counter);
    form.update();
    form.render();
    form.counter += form.inc;
    pop();
  });
}

function calculateLayout() {
  ROWS = rowSlider.value();
  COLS = colSlider.value();

  MARGIN = FORM_SIZE * 4;
  PADDING = FORM_SIZE * 0.5;

  GRIDBOX = FORM_SIZE + PADDING;
  START = FORM_SIZE + MARGIN;
  COL_START = -((GRIDBOX * COLS) / 2) + FORM_SIZE * 0.75;
  ROW_START = -((GRIDBOX * ROWS) / 2) + FORM_SIZE * 0.75;
  // console.log(START2);

  totalX = START + MARGIN + GRIDBOX * COLS;
  totalY = START + MARGIN + GRIDBOX * ROWS;

  if (evaluateResize()) {
    generateForms();
  }

  prev_rows = ROWS;
  prev_cols = COLS;

  resizeCanvas(totalX, totalY);
}

function calculatePalette() {
  dynamicTheme = [
    primaryColorPicker.color(),
    secondaryColorPicker.color(),
    backgroundColorPicker.color(),
  ];

  PALETTE = dynamicTheme;
}

function evaluateResize() {
  if (prev_rows != ROWS) {
    return true;
  }
  if (prev_cols != COLS) {
    return true;
  }
}

function record() {
  recording = true;
  capturer.start();

  recordButton.textContent = "STOP RECORDING";

  recordButton.onclick = (e) => {
    capturer.stop();
    capturer.save();
    recording = false;

    recordButton.textContent = "START RECORDING";
    recordButton.onclick = record;
  };
}

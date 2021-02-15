// Select a form to render based on random value
function renderForm(form, size) {
  if (form === 1) {
    box(size);
  } else if (form === 2) {
    torus(size / 2, size / 8);
  } else if (form === 3) {
    cone(size / 2, size / 2);
  }
}

function applyTransformation(transform, angle) {
  if (transform === 1) {
    rotateForm(angle);
  } else if (transform === 2) {
    scaleForm(angle);
  } else if (transform === 3) {
    rotateForm(angle);
    scaleForm(angle);
  }
}

function rotateForm(angle) {
  rotateX(angle);
  rotateY(angle);
  rotateZ(angle);
}

function scaleForm(angle) {
  scale(abs(sin(angle)));
}

// Randomly selects boolean value
function randomSelectTwo() {
  // Number of Lines
  const rand = random(1);

  if (rand < 0.5) {
    return true
  } else {
    return false;
  }
}

// Selects a color from PALETTE randomly
function getRandomFromPalette() {
  const rand = floor(random(0, PALETTE.length - 1));
  return PALETTE[rand];
}

function applyRotation() {
  const angle = floor(random(4));
  rotate(angle * 90);
}
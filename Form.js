// colorMode(HSB);

class Form {
  constructor(posX, posY) {
    this.x = posX;
    this.y = posY;
    this.form = floor(random(3)) + 1;
    this.materialColor = getRandomFromPalette();
    this.formSize = FORM_SIZE;
    this.transform = floor(random(4));
    this.inc = floor(random(3)) + 1;
    this.counter = 0;
  }

  render() {
    // translate(this.x, this.y);
    
    noStroke();
    specularMaterial(this.materialColor);

    renderForm(this.form, this.formSize);
  }
}
class Form {
  constructor(posX, posY) {
    this.x = posX;
    this.y = posY;
    this.form = floor(random(3)) + 1;
    this.paletteIndex = floor(random(0, PALETTE.length - 1));
    this.materialColor = PALETTE[this.paletteIndex];
    this.formSize = FORM_SIZE;
    this.transform = floor(random(4));
    this.inc = floor(random(3)) + 1;
    this.counter = 0;
  }

  render() {
    noStroke();
    specularMaterial(this.materialColor);

    renderForm(this.form, this.formSize);
  }

  update() {
    this.formSize = FORM_SIZE;
    this.materialColor = PALETTE[this.paletteIndex];
  }
}

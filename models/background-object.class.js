class BackgroundObject extends MovableObject {
  width = 720;
  height = 480;
  constructor(imagePath, x, y) {
    super().loadImage(imagePath);
    this.x = x;
    // Difference between object canvas und object height is equal to the object's y-coordidinate.
    this.y = 480 - this.height;
  }
}

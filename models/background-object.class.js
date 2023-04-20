class BackgroundObject extends MovableObject {
  width = 720;
  height = 480;
  constructor(imagePath, x) {
    super().loadImageFromImageCache(imagePath);
    this.x = x;
    // Difference between object canvas und object height is equal to the object's y-coordidinate.
    this.y = 480 - this.height;
  }
}
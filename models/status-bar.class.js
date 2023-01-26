class StatusBar extends DrawableObject {
  //#region Properties
  // Storage of paths of images.
  IMAGES = [
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png',
  ];

  // Current percentage of status bar, initially 100.
  percentage = 100;
  //#endregion Properties

  //#region Methods
  constructor() {
    // Call the constructor of the super class DrawbleObject.
    super();
    // Load images in the array property 'IMAGES.
    this.loadImages(this.IMAGES);
    // Set status bar position and dimensions in the canvas.
    this.x = 30;
    this.y = 0;
    this.width = 200;
    this.height = 60;
    // Set initially the 'pecentage' property to 100.
    this.setPercentage(100);
  }

  /**
   * Sets the percentage of the status bar and the image that corresponds to the percentage.
   * @param {number} percentage - The percentage of the status bar.
   */
  setPercentage(percentage) {
    // Set the 'percentage' to the 'precentage' argument.
    this.percentage = percentage;
    // Set the local 'path' variable with the image file path from 'IMAGES' array with resolved index.
    let path = this.IMAGES[this.resolveImageIndex()];
    // Set the 'img' property with the image object from 'imageCache' array with the key 'path'.
    this.img = this.imageCache[path];
  }

  /**
   * Returns the index of the status bar image that should be displayed.
   * @returns {number} The index of the  status bar image to be displayed.
   */
  resolveImageIndex() {
    /**
     * Calculate and return only the integer part of the division 100 / 20, i.e. 5, 4, 3, 2, 1, 0, one of the possible
     * six indices 'IMAGES' array.
     */
    return Math.trunc(this.percentage / 20);
  }
  //#endregion Methods
}

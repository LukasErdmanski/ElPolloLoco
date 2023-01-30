class StatusBar extends DrawableObject {
  // Storage of paths of status bar images.
  IMAGES_PATHS_BAR = [];
  // Current percentage of status bar.
  percentage;

  /**
   * Initializes the one of the possible status bars, character's health, bottles or coins amount and endboss' health.
   * @param {number} x - The x coordinate of the bar.
   * @param {number} y - The y coordinate of the bar.
   * @param {[String]} imagePathsArr - The array of status bar image paths.
   * @param {number} percentage - The initial percentage of the bar status to be presented.
   */
  constructor(x, y, imagePathsArr, percentage) {
    // Call the constructor of the super class DrawbleObject.
    super();
    this.x = x;
    this.y = y;
    this.width = 200;
    this.height = 60;
    this.IMAGES_PATHS_BAR = imagePathsArr;
    // Load images in the array property 'IMAGES.
    this.loadImages(this.IMAGES_PATHS_BAR);
    // Set initially the 'pecentage' property to 100.
    this.setPercentage(percentage);
  }

  /**
   * Sets the percentage of the status bar and the image that corresponds to the percentage.
   * @param {number} percentage - The percentage of the status bar.
   */
  setPercentage(percentage) {
    // Set the 'percentage' to the 'precentage' argument.
    this.percentage = percentage;
    // Set the local 'path' variable with the image file path from 'IMAGES' array with resolved index.
    let path = this.IMAGES_PATHS_BAR[this.resolveImageIndex()];
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
}

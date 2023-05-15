/**
 * Represents a status bar.
 * @extends DrawableObject
 */
class StatusBar extends DrawableObject {
  /**
   * The array of paths of status bar images.
   * @type {string[]}
   */
  IMAGES_PATHS_BAR = [];

  /**
   * The current percentage of the status bar.
   * @type {number}
   */
  percentage;

  /**
   * Creates a new StatusBar object.
   * @param {number} x - The x coordinate of the status bar.
   * @param {number} y - The y coordinate of the status bar.
   * @param {string[]} imagePathsArr - The array of status bar image paths.
   * @param {number} percentage - The initial percentage of the status bar to be presented.
   */
  constructor(x, y, imagePathsArr, percentage) {
    super();

    /**
     * The x coordinate of the status bar.
     * @type {number}
     */
    this.x = x;

    /**
     * The y coordinate of the status bar.
     * @type {number}
     */
    this.y = y;

    /**
     * The width of the status bar.
     * @type {number}
     */
    this.width = 200;

    /**
     * The height of the status bar.
     * @type {number}
     */
    this.height = 60;

    /**
     * The array of status bar image paths.
     * @type {string[]}
     */
    this.IMAGES_PATHS_BAR = imagePathsArr;

    // Set the initial percentage of the status bar.
    this.setPercentage(percentage);
  }

  /**
   * Sets the percentage of the status bar and the image that corresponds to the percentage.
   * @param {number} percentage - The percentage of the status bar.
   */
  setPercentage(percentage) {
    /**
     * The percentage of the status bar.
     * @type {number}
     */
    this.percentage = percentage;

    // Set the local 'path' variable with the image file path from 'IMAGES_PATHS_BAR' array with resolved index.
    let path = this.IMAGES_PATHS_BAR[this.resolveImageIndex()];

    // Set the 'img' property with the image object from 'imageCache' array with the key 'path'.
    this.img = DrawableObject.imageCache[path];
  }

  /**
   * Returns the index of the status bar image that should be displayed.
   * @returns {number} The index of the status bar image to be displayed.
   */
  resolveImageIndex() {
    let roundedPercentage = Math.round(this.percentage);
    if (roundedPercentage == 0) return 0;
    if (roundedPercentage > 0 && roundedPercentage <= 30) return 1;
    if (roundedPercentage > 31 && roundedPercentage <= 50) return 2;
    if (roundedPercentage > 51 && roundedPercentage <= 70) return 3;
    if (roundedPercentage > 71 && roundedPercentage <= 99) return 4;
    if (roundedPercentage == 100) return 5;
  }
}

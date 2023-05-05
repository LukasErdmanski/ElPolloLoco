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
    /**
     * Calculate and return only the integer part of the division 100 / 20, i.e. 5, 4, 3, 2, 1, 0, one of the possible
     * six indices 'IMAGES' array.
     * @type {number}
     */
    return Math.ceil(this.percentage / 20);
  }
}

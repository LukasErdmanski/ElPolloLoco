/**
 * Represents a movable background object.
 * @class
 * @extends MovableObject
 */
class BackgroundObject extends MovableObject {
  /**
   * The width of the background object.
   * @type {number}
   */
  width = 720;

  /**
   * The height of the background object.
   * @type {number}
   */
  height = 480;

  /**
   * Creates a new BackgroundObject.
   * @constructor
   * @param {string} imagePath - The path to the image file of the background object.
   * @param {number} x - The x-coordinate of the background object.
   */
  constructor(imagePath, x) {
    super().loadImageFromImageCache(imagePath);

    /**
     * The x-coordinate of the background object.
     * @type {number}
     */
    this.x = x;

    /**
     * The y-coordinate of the background object. It is set based on the height of the canvas and the height of the object.
     * @type {number}
     */
    this.y = 480 - this.height;
  }
}
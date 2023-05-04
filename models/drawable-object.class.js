/**
 * DrawableObject class for handling the drawing of objects to the canvas.
 * It also includes functionalities for drawing a frame around the object and
 * placing the object on the ground level of the canvas.
 */
class DrawableObject {
  /**
   * The x-coordinate of the top-left corner of the drawable object on the canvas.
   * @type {number}
   */
  x;

  /**
   * The y-coordinate of the top-left corner of the drawable object on the canvas.
   * @type {number}
   */
  y;

  /**
   * The width of the drawable object on the canvas.
   * @type {number}
   */
  width;

  /**
   * The height of the drawable object on the canvas.
   * @type {number}
   */
  height;

  /**
   * An object containing the offset distances of the drawable object.
   * Expected keys are "top", "left", "right", "bottom".
   * @type {Object}
   */
  offset = {};

  /**
   * Offset distance from the ground line.
   * @type {number}
   */
  yOffsetToGroundLevel = 40;

  /**
   * The y-coordinate of the ground line on the canvas.
   * @type {number}
   */
  yOfGroundLevel = 480 - this.yOffsetToGroundLevel;

  /**
   * The current image of the drawable object.
   * @type {HTMLImageElement}
   */
  img;

  /**
   * A static cache of images that have been loaded, for efficient re-use.
   * The cache is a key-value store where the keys are image paths and the values are HTMLImageElement objects.
   * @type {Object.<string, HTMLImageElement>}
   */
  static imageCache = {};

  /**
   * Loads the image object from the static imageCache object.
   * @param {string} path - The path of the image.
   */
  loadImageFromImageCache(path) {
    // Assing the current image to the img from 'imageCache' saved under the given image path as the key.
    this.img = DrawableObject.imageCache[path];
  }

  /**
   * Loads the image object from the static imageCache object.
   * @param {string} path - The path of the image.
   */
  draw(ctx) {
    /**
     * This function is executed many times per second for many drawable objects.
     * To avoid the following error 'Uncaught propertyError: Failed to execute 'drawImage' on 'CanvasRenderingContext2D'',
     * to catch the error caused by the specific image file and has the possibility to get this error at the set break
     * point in the error handling, this function is to execute in the try-catch-block.
     */
    try {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    } catch (error) {
      debugger;
      console.warn('Error loading image', error);
      console.log('Could not load image', this.img.src);
    }
  }

  /**
   * Draws a frame around the object on the given canvas context.
   * @param {object} ctx - The canvas context where the object will be drawn.
   */
  drawFrame(ctx) {
    ctx.beginPath();
    ctx.lineWidth = '5';
    ctx.strokeStyle = 'blue';
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.stroke();
  }

  /**
   * Draws a frame around the object reduced by its offset distances on the given canvas context.
   * @param {object} ctx - The canvas context where the object will be drawn.
   */
  draw_Offset_Frame(ctx) {
    ctx.beginPath();
    ctx.lineWidth = '1';
    ctx.strokeStyle = 'yellow';
    ctx.rect(
      this.x + this.offset.left,
      this.y + this.offset.top,
      this.width - this.offset.left - this.offset.right,
      this.height - this.offset.top - this.offset.bottom
    );
    ctx.stroke();
  }

  /**
   * Positions the object on the ground level of the canvas.
   */
  positionOnGround() {
    this.y = 480 - (this.height - this.offset.bottom) - this.yOffsetToGroundLevel;
  }
}

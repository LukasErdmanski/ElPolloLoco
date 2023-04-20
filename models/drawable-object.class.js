class DrawableObject {
  x;
  y;
  width;
  height;
  offset = {};

  yOffsetToGroundLine = 40;
  yOfGround = 480 - this.yOffsetToGroundLine;

  // The current drawing img / parameter of the functions drawImage of the canvas context.
  img;
  // JSON for key-value pair (key [image PATH], value [IMAGE OBJECT itself]) --> Accessing the image object via its path / src.
  static imageCache = {};

  // loadImageToImageCache('img/test.png')

  /**
   * Loads the first image object into the variable 'img' used in the function 'draw(ctx)' at the beginning, so that
   * the variable 'img' is not undefined when the function 'draw(ctx)' is executed, resulting in an error.
   * @param {string} path - The path of the first image to be stored in the variable 'img' and used in the 'draw(ctx)'
   * function at the beginning.
   */
  loadImageFromImageCache(path) {
    // Assing the current image to the img from 'imageCache' saved under the given image path as the key.
    this.img =  DrawableObject.imageCache[path]
  }

  /**
   * Draws the drawable object (its image) to the given the canvas.
   * @param {object} ctx - The canvas context, in which the drawable object is drawn.
   */
  draw(ctx) {
    /**
     * This function is executed very much per second for many drawable objects.
     * To avoid the following error 'Uncaught TypeError: Failed to execute 'drawImage' on 'CanvasRenderingContext2D'',
     * to catch the error caused by the specific file/images and has the possibility to get this error at the set break
     * point in the error handling, this function is to execute in the try-catch-block.
     */
    try {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    } catch (error) {
      debugger
      console.warn('Error loading image', error);
      console.log('Could not load image', this.img.src);
    }
  }

  /**
   * Draws a frame around the drawable object (its image) to the given the canvas.
   * @param {object} ctx - The canvas context, in which the drawable object is drawn.
   */
  drawFrame(ctx) {
    // Check, if the instace is a character or chicken or endboss.
    if (
      this instanceof Character ||
      this instanceof ChickenNormal ||
      this instanceof Endboss ||
      this instanceof Coin ||
      this instanceof Bottle
    ) {
      // Yes, draw a frame around it.
      ctx.beginPath();
      ctx.lineWidth = '5';
      ctx.strokeStyle = 'blue';
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();
    }
  }

  /**
   * Draws a frame around the drawable object (its image) reduced by its offset distances to the given the canvas.
   * @param {object} ctx - The canvas context, in which the drawable object is drawn.
   */
  draw_Offset_Frame(ctx) {
    // Check, if the instace is a character or chicken or endboss.
    // if (this instanceof Character || this instanceof Chicken || this instanceof Endboss) {
    // Yes, draw a frame around it reduced by its offset distances.
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

  positionOnGround() {
    this.y = 480 - (this.height - this.offset.bottom) - this.yOffsetToGroundLine;
  }
}

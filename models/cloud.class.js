/**
 * Represents a cloud object that moves across the game level.
 * @class
 * @extends MovableObject
 */
class Cloud extends MovableObject {
  /**
   * The vertical position of the cloud object.
   * @type {number}
   */
  y = 20;

  /**
   * The width of the cloud object.
   * @type {number}
   */
  width = 500;

  /**
   * The height of the cloud object.
   * @type {number}
   */
  height = 250;

  /**
   * The paths to the images for the cloud object.
   * @type {string[]}
   */
  IMAGES_PATHS = ['img/5_background/layers/4_clouds/1.png', 'img/5_background/layers/4_clouds/2.png'];

  /**
   * Constructs a new cloud object.
   * @constructor
   */
  constructor() {
    let randomIdxZeroOrOne = Math.round(Math.random());
    super().loadImageFromImageCache(this.IMAGES_PATHS[randomIdxZeroOrOne]);
  }

  /**
   * Sets the initial horizontal position of the cloud object randomly within the level boundaries.
   * @override
   */
  setStartX() {
    this.x = 0 + Math.random() * this.level.end_x;
  }

  /**
   * Handles the movement of the cloud object based on its current state.
   * @override
   */
  checkMakeMovementIntervalHandler() {
    if (this.isDead()) {
      this.deadAnimation_Part_MakeMovement_IsOver = true;
    } else if (this.isBeyondLevelStartX()) {
      this.moveToLevelEndX();
    } else {
      this.moveLeft();
    }
  }

  /**
   * Checks if the cloud object is beyond the start position of the level.
   * @returns {boolean} True if the cloud object is beyond the start position of the level, otherwise false.
   */
  isBeyondLevelStartX() {
    return this.x + this.width <= this.level.start_x;
  }

  /**
   * Moves the cloud object to the end position of the level.
   */
  moveToLevelEndX() {
    this.x = this.level.end_x;
  }
}

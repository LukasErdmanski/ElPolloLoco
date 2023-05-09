/**
 * Represents a normal chicken object.
 * @class
 * @extends MovableObject
 */
class ChickenNormal extends MovableObject {
  /**
   * The width of the chicken.
   * @type {number}
   */
  width = 100;

  /**
   * The height of the chicken.
   * @type {number}
   */
  height = 80;

  /**
   * The offset of the chicken.
   * @type {{top: number, left: number, right: number, bottom: number}}
   */
  offset = {
    top: 3,
    left: 3,
    right: 2,
    bottom: 4,
  };

  /**
   * The health of the chicken.
   * @type {number}
   */
  health = 2;

  /**
   * Whether or not the chicken can turn around.
   * @type {boolean}
   */
  canTurnAround = true;

  /**
   * The image paths for the walking animation of the chicken.
   * @type {string[]}
   */
  IMAGES_PATHS_WALKING = [
    'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
  ];

  /**
   * The image path for the dead state of the chicken.
   * @type {string[]}
   */
  IMG_PATH_DEAD = ['img/3_enemies_chicken/chicken_normal/2_dead/dead.png'];

  /**
   * Creates a new instance of the ChickenNormal class.
   * @constructor
   * @param {number} x - The horizontal coordinate of the object.
   * @param {number} y - The vertical coordinate of the object.
   */
  constructor(x, y) {
    super().loadImageFromImageCache(this.IMAGES_PATHS_WALKING[0]);
    this.positionOnGround();
  }

  /**
   * Sets the starting x position and speed of the chicken.
   */
  setStartXAndSpeedX() {
    this.x = this.level.endX * 0.15 + Math.random() * this.level.endX * 0.5;
    // Set random motion speed for instance of chicken class after the initialization.
    this.speedX = 0.15 + Math.random() * 0.25;
  }

  /**
   * Checks which movement the normal chicken can do and make it if valid.
   * @override
   */
  checkMakeMovementIntervalHandler() {
    if (this.isDead()) {
      this.deadAnimationPartMakeMovementIsOver = true;
    } else {
      this.moveInXDirection();
    }
  }

  /**
   * Checks in which state is the normal chicken and sets the images for the chicken state.
   * @override
   */
  checkSetImagesIntervalHandler() {
    if (this.isDead()) {
      this.changeImagesSetAndCurrentImg(this.IMG_PATH_DEAD);
      this.deadAnimationPartSetLastImgIsOver = true;
    } else if (this.isHurt()) {
      this.changeImagesSetAndCurrentImg(this.IMG_PATH_DEAD);
    } else {
      this.changeImagesSetAndCurrentImg(this.IMAGES_PATHS_WALKING);
    }
  }
}

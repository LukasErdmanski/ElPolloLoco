/**
 * Represents a small chicken object.
 * @class
 * @extends MovableObject
 */
class ChickenSmall extends MovableObject {
  /**
   * The width of the small chicken.
   * @type {number}
   */
  width = 80;

  /**
   * The height of the small chicken.
   * @type {number}
   */
  height = 70;

  /**
   * The offset of the small chicken.
   * @type {{top: number, left: number, right: number, bottom: number}}
   */
  offset = {
    top: 3,
    left: 9,
    right: 8,
    bottom: 4,
  };

  /**
   * The health of the small chicken.
   * @type {number}
   */
  health = 1;

  /**
   * Whether or not the small chicken can turn around.
   * @type {boolean}
   */
  canTurnAround = true;

  /**
   * The last time the small chicken desired to jump.
   * @type {Date}
   */
  lastDesireJump = new Date().getTime();

  /**
   * The image paths for the walking animation of the small chicken.
   * @type {string[]}
   */
  IMAGES_PATHS_WALKING = [
    'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
    'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
    'img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
  ];

  /**
   * The image path for the dead state of the small chicken.
   * @type {string[]}
   */
  IMG_PATH_DEAD = ['img/3_enemies_chicken/chicken_small/2_dead/dead.png'];

  /**
   * Creates a new instance of the ChickenSmall class.
   * @constructor
   */
  constructor() {
    super().loadImageFromImageCache(this.IMAGES_PATHS_WALKING[0]);
    this.positionOnGround();
  }

  /**
   * Sets the starting x position and speed of the small chicken.
   */
  setStartXAndSpeedX() {
    this.x = this.level.end_x * 0.15 + Math.random() * this.level.end_x * 0.5;
    this.speedX = 0.5 + Math.random() * 0.25;
  }

  /**
   * Checks which movement the small chicken can do and make it if valid.
   * @override
   * @see {@link MovableObject.checkMakeMovementIntervalHandler} for the default implementation in the parent class.
   */
  checkMakeMovementIntervalHandler() {
    if (this.isDead()) this.deadAnimation_Part_MakeMovement_IsOver = true;
    else if (this.hasDesireToJump() && !this.isAboveGround()) this.jump();
    else this.moveInXDirection();
  }

  /**
   * Determines if the small chicken has the desire to jump.
   * @returns {boolean} True if the small chicken wants to jump, false otherwise.
   */
  hasDesireToJump() {
    let timePassed = (new Date().getTime() - this.lastDesireJump) / 1000;
    if (timePassed > 3) {
      this.lastDesireJump = new Date().getTime();
      let zeroOrOne;
      zeroOrOne = Math.random();
      if (zeroOrOne > 0.5) return true;
    }
  }

  /**
   * Makes the small chicken jump.
   */
  jump() {
    super.jump(16);
  }

  /**
   * Checks in which state is the small chicken and sets the images for the chicken state.
   * @override
   * @see {@link MovableObject.checkSetImagesIntervalHandler} for the default implementation in the parent class.
   */
  checkSetImagesIntervalHandler() {
    if (this.isDead()) {
      this.changeImagesSetAndCurrentImg(this.IMG_PATH_DEAD);
      this.deadAnimation_Part_SetLastImg_IsOver = true;
    } else if (this.isHurt()) {
      this.changeImagesSetAndCurrentImg(this.IMG_PATH_DEAD);
    } else {
      this.changeImagesSetAndCurrentImg(this.IMAGES_PATHS_WALKING);
    }
  }
}

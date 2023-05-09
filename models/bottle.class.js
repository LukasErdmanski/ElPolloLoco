/**
 * Class representing a throwable bottle object in the game.
 * @extends MovableObject
 */
class Bottle extends MovableObject {
  /**
   * The height of the bottle object on the canvas.
   * @type {number}
   */
  height = 80;

  /**
   * The width of the bottle object on the canvas.
   * @type {number}
   */
  width = 70;

  /**
   * The offset for the bottle image's actual content inside its png file.
   * @type {Object}
   */
  offset = {
    top: 15,
    left: 23,
    right: 15,
    bottom: 10,
  };

  /**
   * The height of the bottle object on the canvas.
   * @type {number}
   */
  height = 80;

  /**
   * The width of the bottle object on the canvas.
   * @type {number}
   */
  width = 70;

  /**
   * The index of this bottle in the group of bottles it belongs to.
   * @type {number}
   */
  idxInBottlesGroup = 0;

  /**
   * The total number of bottles in the group this bottle belongs to.
   * @type {number}
   */
  amountInBottlesInGroup;

  /**
   * The health of this bottle. It is used to check if this bottle is dead.
   * @type {number}
   */
  health = 1;

  /**
   * A flag to check if this bottle has been thrown.
   * @type {boolean}
   */
  isThrown = false;

  /**
   * Array of paths for the bottle images when it is on the ground.
   * @type {string[]}
   */
  IMAGES_PATHS_ON_GROUND = [
    'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
    'img/6_salsa_bottle/2_salsa_bottle_on_ground.png',
  ];

  /**
   * Array of paths for the bottle images during its rotation (in flight).
   * @type {string[]}
   */
  IMAGES_PATHS_ROTATION = [
    'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
    'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
    'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
    'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
  ];

  /**
   * Array of paths for the bottle images during its splash (on impact).
   * @type {string[]}
   */
  IMAGES_PATHS_SPLASH = [
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
  ];

  /**
   * Array of paths for the bottle images when it is being destroyed.
   * @type {string[]}
   */
  IMAGES_PATHS_DESTROYING = this.IMAGES_PATHS_SPLASH;

  /**
   * Creates a new Bottle object and initializes its position and properties.
   * @param {Bottle[]} allBottlesArr - An array containing all the bottle objects.
   * @param {number} x - The initial x position of the bottle.
   * @param {number} y - The initial y position of the bottle.
   */
  constructor(allBottlesArr, x, y) {
    let randomIdxInImagesPaths = Math.round(Math.random());
    super().loadImageFromImageCache(this.IMAGES_PATHS_ON_GROUND[randomIdxInImagesPaths]);
    this.setXY(allBottlesArr, x, y);
  }

  /**
   * Sets the x and y positions of the bottle object.
   * @param {Bottle[]} allBottlesArr - An array containing all the bottle objects.
   * @param {number} x - The initial x position of the bottle.
   * @param {number} y - The initial y position of the bottle.
   */
  setXY(allBottlesArr, x, y) {
    if (allBottlesArr) {
      this.x = this.getX(allBottlesArr);
      this.positionOnGround();
    } else {
      this.x = x;
      this.y = y;
    }
  }

  /**
   * Calculates the x-position for the bottle.
   * @param {Bottle[]} allBottlesArr - An array containing all the bottle objects.
   * @returns {number} The calculated x position.
   */
  getX(allBottlesArr) {
    let maxAmoutInBottlesGroup = 5;
    let lastBottleObj = allBottlesArr[allBottlesArr.length - 1];
    if (lastBottleObj == undefined || lastBottleObj.idxInBottlesGroup == lastBottleObj.amountInBottlesInGroup) {
      this.idxInBottlesGroup = 0;
      this.amountInBottlesInGroup = Math.ceil(Math.random() * (maxAmoutInBottlesGroup - 1));
    } else {
      this.idxInBottlesGroup = (lastBottleObj.idxInBottlesGroup + 1) % (lastBottleObj.amountInBottlesInGroup + 1);
      this.amountInBottlesInGroup = lastBottleObj.amountInBottlesInGroup;
    }
    return this.setX(lastBottleObj);
  }

  /**
   * Sets the x-position for the bottle.
   * @param {Bottle} lastBottleObj - The last Bottle object in the allBottlesArr array.
   * @returns {number} The calculated x position.
   */
  setX(lastBottleObj) {
    let [x, distanceToNextBottle] = [500, 35];
    if (lastBottleObj != undefined && this.idxInBottlesGroup == 0) x = lastBottleObj.x + 300;
    else if (lastBottleObj != undefined) x = lastBottleObj.x + distanceToNextBottle;
    return x;
  }

  /**
   * Checks if the bottle has landed on the ground after being thrown.
   * @returns {boolean} True if the bottle has landed, false otherwise.
   */
  isOnGroundAfterFlight() {
    return !this.isAboveGround();
  }

  /**
   * Checks the state of the bottle and performs appropriate actions.
   * If the bottle has been thrown, it makes it fall down.
   * If the bottle is moving, it continues its movement to the left or right.
   * If the bottle is dead, it stops its flight.
   * @override
   */
  checkMakeMovementIntervalHandler() {
    if (this.isThrown) this.fallDown();
    if (this.speedX > 0 && this.otherDirection) this.moveLeft();
    if (this.speedX > 0 && !this.otherDirection) this.moveRight();
    if (this.isDead()) this.stopFlight();
  }

  /**
   * Makes the bottle fall down by setting its thrown status to false and adjusting its speed.
   */
  fallDown() {
    this.isThrown = false;
    this.speedX = 9 + Math.random() * 4;
    this.accelerationX = 0.1;
    this.speedY = 10;
  }

  /**
   * Makes the bottle move to the right by calling the superclass's moveRight method and decreasing the speed.
   */
  moveLeft() {
    super.moveLeft();
    this.speedX -= this.accelerationX;
  }

  /**
   * Makes the bottle move to the right by calling the superclass's moveRight method and decreasing the speed.
   */
  moveRight() {
    super.moveRight();
    this.speedX -= this.accelerationX;
  }

  /**
   * Stops the bottle's flight by setting the deadAnimationPartMakeMovementIsOver property to true.
   */
  stopFlight() {
    this.deadAnimationPartMakeMovementIsOver = true;
  }

  /**
   * Checks the bottle's status and changes its image set accordingly.
   * If the bottle is dead, it changes to the splash images.
   * If the bottle is above ground (in flight), it changes to the rotation images.
   * @override
   */
  checkSetImagesIntervalHandler() {
    if (this.isDead()) this.changeImagesSetAndCurrentImg(this.IMAGES_PATHS_SPLASH);
    else if (this.isAboveGround()) this.changeImagesSetAndCurrentImg(this.IMAGES_PATHS_ROTATION);
  }
}

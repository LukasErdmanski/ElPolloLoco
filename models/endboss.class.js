/**
 * Class representing the end boss character.
 * @extends MovableObject
 */
class Endboss extends MovableObject {
  /**
   * The width of the end boss.
   * @type {number}
   */
  width = 250;

  /**
   * The height of the end boss.
   * @type {number}
   */
  height = 400;

  /**
   * The offset object that contains the top, left, right, and bottom offsets of the end boss.
   * @type {{top: number, left: number, right: number, bottom: number}}
   */
  offset = {
    top: 65,
    left: 7,
    right: 3,
    bottom: 13,
  };

  /**
   * The distance in pixels between the end boss and the end of the level.
   * @type {number}
   */
  xDistanceEndbossToLevelEnd = 500;

  /**
   * The initial speed of the end boss.
   * @type {number}
   */
  speedXInitial;

  /**
   * The acceleration of the end boss in the x direction.
   * @type {number}
   */
  accelerationX = 1;

  /**
   * Whether the end boss can turn around or not.
   * @type {boolean}
   */
  canTurnAround = true;

  /**
   * Whether the character has been detected nearby or not.
   * @type {boolean}
   */
  wasCharacterOnceDeteckedNearby = false;

  /**
   * Whether the end boss is prepared to attack or not.
   * @type {boolean}
   */
  preparedToAttack = false;

  /**
   * Whether the end boss is in attack mode or not.
   * @type {boolean}
   */
  inAtack = false;

  /**
   * Whether the end boss is in run back mode or not.
   * @type {boolean}
   */
  inRunBack = false;

  /**
   * Whether the end boss is turned around for run back mode or not.
   * @type {boolean}
   */
  isTurnedAroundForRunBack = false;

  /**
   * The maximum x distance of the end boss during run back mode.
   * @type {number}
   */
  maxXDistanceOfRunBack;

  /**
   * The current x distance of the end boss during run back mode.
   * @type {number}
   */
  currentXDistanceOfRunBack = 0;

  /**
   * The paths of the images used for the walking animation of the end boss.
   * @type {string[]}
   */
  IMAGES_PATHS_WALKING = [
    'img/4_enemie_boss_chicken/1_walk/G1.png',
    'img/4_enemie_boss_chicken/1_walk/G2.png',
    'img/4_enemie_boss_chicken/1_walk/G3.png',
    'img/4_enemie_boss_chicken/1_walk/G4.png',
  ];

  /**
   * The paths of the images used for the alert animation of the end boss.
   * @type {string[]}
   */
  IMAGES_PATHS_ALERT = [
    'img/4_enemie_boss_chicken/2_alert/G5.png',
    'img/4_enemie_boss_chicken/2_alert/G6.png',
    'img/4_enemie_boss_chicken/2_alert/G7.png',
    'img/4_enemie_boss_chicken/2_alert/G8.png',
    'img/4_enemie_boss_chicken/2_alert/G8.png',
    'img/4_enemie_boss_chicken/2_alert/G10.png',
    'img/4_enemie_boss_chicken/2_alert/G11.png',
    'img/4_enemie_boss_chicken/2_alert/G12.png',
  ];

  /**
   * The paths of the images used for the attack animation of the end boss.
   * @type {string[]}
   */
  IMAGES_PATHS_ATTACK = [
    'img/4_enemie_boss_chicken/3_attack/G13.png',
    'img/4_enemie_boss_chicken/3_attack/G14.png',
    'img/4_enemie_boss_chicken/3_attack/G15.png',
    'img/4_enemie_boss_chicken/3_attack/G16.png',
    'img/4_enemie_boss_chicken/3_attack/G17.png',
    'img/4_enemie_boss_chicken/3_attack/G18.png',
    'img/4_enemie_boss_chicken/3_attack/G19.png',
    'img/4_enemie_boss_chicken/3_attack/G20.png',
  ];

  /**
   * The paths of the images used for the hurt animation of the end boss.
   * @type {string[]}
   */
  IMAGES_PATHS_HURT = [
    'img/4_enemie_boss_chicken/4_hurt/G21.png',
    'img/4_enemie_boss_chicken/4_hurt/G22.png',
    'img/4_enemie_boss_chicken/4_hurt/G23.png',
  ];

  /**
   * The paths of the images used for the dead animation of the end boss.
   * @type {string[]}
   */
  IMAGES_PATHS_DEAD = [
    'img/4_enemie_boss_chicken/5_dead/G24.png',
    'img/4_enemie_boss_chicken/5_dead/G25.png',
    'img/4_enemie_boss_chicken/5_dead/G26.png',
  ];

  /**
   * The instance of the world in which the end boss exists.
   * @type {World}
   */
  world;

  /**
   * Creates an instance of Endboss.
   * @constructor
   */
  constructor() {
    super().loadImageFromImageCache(this.IMAGES_PATHS_ALERT[0]);
    this.positionOnGround();
  }

  /**
   * Set the initial x position and speed for the end boss.
   */
  setStartXAndSpeedX() {
    this.x = this.level.endX - this.xDistanceEndbossToLevelEnd;
    this.speedX = 4 + Math.random() * 0.25;
    this.speedXInitial = this.speedX;
  }

  /**
   * Checks which movement action to make based on the state of the end boss and character.
   * @override
   */
  checkMakeMovementIntervalHandler() {
    sounds.endboss.attack.pause();
    if (this.canMoveAsDead()) this.moveAsDead();
    else if (this.isCharacterAlive()) {
      if (this.isHurtAndNotPreparedToAttack()) this.prepareToAttack();
      else if (this.isPreparedToAttack()) this.startAttack();
      else if (this.isInAtack()) this.attack();
      else if (this.isPreparedToRunBack()) this.startRunBack();
      else if (this.isInRunBack()) this.runBack();
      else if (this.inInWalk()) this.walk();
    }
  }

  /**
   * Checks if the end boss can move as dead.
   * @returns {boolean} Returns true if the end boss is dead and can move as dead, false otherwise.
   */
  canMoveAsDead() {
    return this.isDead();
  }

  /**
   * Moves the end boss when it is dead.
   */
  moveAsDead() {
    super.moveAsDead();
  }

  /**
   * Checks if the character is alive.
   * @returns {boolean} Returns true if the character is alive, false otherwise.
   */
  isCharacterAlive() {
    return this.world && this.world.character != null && !this.world.character.isDead();
  }

  //#region ****************************** ATTACK-RUN BACK ******************************//
  //#region ****************************** PREPARING ATTACK ******************************//

  /**
   * Checks if the end boss is hurt and not yet prepared to attack.
   * @returns {boolean} Returns true if the end boss is hurt and not yet prepared to attack, false otherwise.
   */
  isHurtAndNotPreparedToAttack() {
    return this.isHurt() && !this.preparedToAttack;
  }

  /**
   * Prepares the end boss for the attack.
   */
  prepareToAttack() {
    this.stopCurrentArrack();
    this.preparedToAttack = true;
  }

  /**
   * Stops the current attack of the end boss.
   */
  stopCurrentArrack() {
    this.speedX = this.speedXInitial;
    this.inAtack = false;
  }

  //#endregion *************************** PREPARING ATTACK ******************************//

  //#region ****************************** STARTING ATTACK ******************************//

  /**
   * Checks if the end boss is prepared to attack.
   * @returns {boolean} Returns true if the end boss is prepared to attack, false otherwise.
   */
  isPreparedToAttack() {
    return this.preparedToAttack && !this.isHurt();
  }

  /**
   * Starts the attack of the end boss.
   */
  startAttack() {
    this.preparedToAttack = false;
    this.inAtack = true;
    this.speedXInitial = this.speedX;
    this.speedX = this.speedXInitial * 2.5;
  }

  //#endregion *************************** STARTING ATTACK ******************************//

  //#region ****************************** ATTACKING ******************************//

  /**
   * Checks if the end boss is in attack mode.
   * @returns {boolean} Returns true if the end boss is in attack mode, false otherwise.
   */
  isInAtack() {
    return this.inAtack && !this.world.character.isHurt();
  }

  /**
   * Handles the attack movement of the end boss.
   */
  attack() {
    sounds.endboss.attack.play();
    if (!this.isAboveGround()) this.jump(12);
    this.setDirectionForAttack();
    this.moveInXDirection();
  }

  /**
   * Sets the direction of the end boss for the attack.
   */
  setDirectionForAttack() {
    // Checking in which direction is character
    if (this.checkIfCharacterOnLeftOrRightEndbossHalf()) this.otherDirection = false;
    else this.otherDirection = true;
  }

  /**
   * Checks if the character is on the left or right half of the end boss.
   * @returns {boolean} Returns true if the character is on the left half of the end boss, false otherwise.
   */
  checkIfCharacterOnLeftOrRightEndbossHalf() {
    let xCharacterCenter = this.world.character.x + this.world.character.width / 2;
    let xEndbossCenter = this.x + this.width / 2;
    return xEndbossCenter > xCharacterCenter;
  }

  //#endregion *************************** ATTACKING ******************************//

  //#region ****************************** STARTING RUN BACK ******************************//

  /**
   * Checks if the end boss is prepared to run back.
   * @returns {boolean} Returns true if the end boss is prepared to run back, false otherwise.
   */
  isPreparedToRunBack() {
    return this.inAtack && this.world.character.isHurt() && !this.inRunBack;
  }

  /**
   * Starts the run back of the end boss.
   */
  startRunBack() {
    this.stopCurrentArrack();
    this.inRunBack = true;
  }

  //#endregion *************************** STARTING RUN BACK ******************************//

  //#region ****************************** CHECKING RUN BACK STEP ******************************//

  /**
   * Checks if the end boss is in the run back mode.
   * @returns {boolean} Returns true if the end boss is in the run back mode.
   */
  isInRunBack() {
    return this.inRunBack;
  }

  /**
   * Moves the end boss in the run back mode until it reaches the maximum x distance.
   */
  runBack() {
    if (!this.isAlreadyJumpedSetDirectionCalcucaltedDistance()) {
      this.jumpSetDirectionCalcucalteDistance();
    } else if (!this.hasRunMaxXDistanceOfRunBack()) {
      this.runBackOneXInterval();
    } else {
      this.stopRunBack();
    }
  }

  //#endregion *************************** CHECKING RUN BACK STEP ******************************//

  //#region ****************************** RUNNING BACK - 1. START JUMPING, SETTING DIRECTION AND DISTANCE ******************************//

  /**
   * Checks if the end boss has already jumped, set direction, and calculated the maximum x distance for the run back.
   * @returns {boolean} Returns true if the end boss has already jumped, set direction, and calculated the maximum x distance.
   */
  isAlreadyJumpedSetDirectionCalcucaltedDistance() {
    return this.isTurnedAroundForRunBack;
  }

  /**
   * Makes the end boss jump, set the direction for the run back, and calculates the maximum x distance for the run back.
   */
  jumpSetDirectionCalcucalteDistance() {
    this.jump(15);
    this.setDirectionForRunBack();
    this.isTurnedAroundForRunBack = true;
    this.calcMaxXDistanceOfRunBack();
  }

  /**
   * Sets the direction for the run back.
   */
  setDirectionForRunBack() {
    this.setDirectionAsPerCanvasCenter();
  }

  /**
   * Checks whether the character is on the left or right canvas half. This defines the direction for run back.
   * @returns {boolean} Returns true if the character is on the left half of the canvas, false if on the right half.
   */
  checkIfCharacterOnLeftOrRightCanvasHalf() {
    return this.world.character.checkIfOnLeftOrRightCanvasHalf();
  }

  /**
   * Calculates the maximum x distance for the run back.
   */
  calcMaxXDistanceOfRunBack() {
    let maxXDistanceOfRunBack;
    let canvasWidth = this.world.canvas.width;
    let xCharacter = this.world.character.x;
    let xCanvasLeftBorder = -this.world.cameraX;
    let xDistanceToCanvasLeftBorder = xCharacter - xCanvasLeftBorder;
    let endbossWidth = this.width;
    let xEndboss = this.x;
    let deltaCharacterXEndbossX = xEndboss - xCharacter;
    if (this.checkIfCharacterOnLeftOrRightCanvasHalf()) {
      maxXDistanceOfRunBack = xDistanceToCanvasLeftBorder + deltaCharacterXEndbossX;
    } else {
      maxXDistanceOfRunBack = canvasWidth - xDistanceToCanvasLeftBorder - deltaCharacterXEndbossX - endbossWidth;
    }
    this.maxXDistanceOfRunBack = maxXDistanceOfRunBack;
  }

  //#endregion *************************** RUNNING BACK - 1. START JUMPING, SETTING DIRECTION AND DISTANCE ******************************//

  //#region ****************************** RUNNING BACK - 2. MOVING ******************************//

  /**
   * Checks if the end boss has run the maximum x distance for the run back.
   * @returns {boolean} Returns true if the end boss has run the maximum x distance.
   */
  hasRunMaxXDistanceOfRunBack() {
    return this.currentXDistanceOfRunBack >= this.maxXDistanceOfRunBack;
  }

  /**
   * Moves the end boss in the run back mode one x interval.
   */
  runBackOneXInterval() {
    this.moveInXDirection();
    this.currentXDistanceOfRunBack += this.speedX;
  }

  //#endregion *************************** RUNNING BACK - 2. MOVING ******************************//

  //#region ****************************** RUNNING BACK - 3. STOP AND TOURNING AROUND ******************************//

  /**
   * Stops the run back mode of the end boss and turns it around.
   */
  stopRunBack() {
    this.turnAround();
    this.currentXDistanceOfRunBack = 0;
    this.isTurnedAroundForRunBack = false;
    this.inRunBack = false;
  }

  /**
   * Turns the end boss around.
   */
  turnAround() {
    this.otherDirection = !this.otherDirection;
  }

  //#endregion *************************** RUNNING BACK - 3. STOP AND TOURNING AROUND ******************************//
  //#endregion *************************** ATTACK-RUN BACK ******************************//

  //#region ****************************** WALKING ******************************//

  /**
   * Checks if the end boss is in the walk mode.
   * @returns {boolean} Returns true if the end boss is in the walk mode and false otherwise.
   */
  inInWalk() {
    return this.wasCharacterNearby() && this.isNotInMiddleOfCharacter() && !this.isHurt();
  }

  /**
   * Checks if the end boss is not in the middle of the character.
   * @returns {boolean} Returns true if the end boss is not in the middle of the character and false otherwise.
   */
  isNotInMiddleOfCharacter() {
    let xCharacterCenter = this.world.character.x + this.world.character.width / 2;
    let xEndboss = this.x;
    let xEndbossWidth = this.width;
    if (this.checkIfCharacterOnLeftOrRightEndbossHalf()) return xEndboss >= xCharacterCenter;
    else return xEndboss + xEndbossWidth <= xCharacterCenter;
  }

  /**
   * Makes the end boss walk.
   */
  walk() {
    this.speedX = this.speedXInitial;
    this.setDirectionForAttack();
    this.moveInXDirection();
  }

  //#endregion *************************** WALKING ******************************//

  /**
   * Checks the image set for the end boss at each interval and updates it.
   * @override
   */
  checkSetImagesIntervalHandler() {
    if (this.isCharacterAlive()) {
      if (!this.wasCharacterNearby()) this.changeImagesSetAndCurrentImg(this.IMAGES_PATHS_ALERT);
      else if (this.isDead()) this.changeImagesSetAndCurrentImg(this.IMAGES_PATHS_DEAD);
      else if (this.isHurt()) this.changeImagesSetAndCurrentImg(this.IMAGES_PATHS_HURT);
      else if (this.isFlyingOrCollidingCharacter()) this.changeImagesSetAndCurrentImg(this.IMAGES_PATHS_ATTACK);
      else this.changeImagesSetAndCurrentImg(this.IMAGES_PATHS_WALKING);
    }
  }

  /**
   * Checks if the character was once detected nearby the end boss.
   * @returns {boolean} Returns true if the character was once detected nearby the end boss and false otherwise.
   */
  wasCharacterNearby() {
    if (!this.wasCharacterOnceDeteckedNearby) this.isCharacterNearby();
    return this.wasCharacterOnceDeteckedNearby;
  }

  /**
   * Checks if the character is nearby the end boss.
   * @returns {boolean} Returns true if the character is nearby the end boss and false otherwise.
   */
  isCharacterNearby() {
    let nearXDistanceCharacterToEndboss = this.world.canvas.width - this.width;
    let xRightCharacterImgSide = this.world.character.x + this.world.character.width;
    let checkResult = xRightCharacterImgSide + nearXDistanceCharacterToEndboss >= this.x;
    if (checkResult) {
      this.wasCharacterOnceDeteckedNearby = true;
      sounds.endboss.characterDetected.play();
      changeBgMusic();
    }
    return checkResult;
  }

  /**
   * Checks if the end boss is flying or colliding with the character.
   * @returns {boolean} Returns true if the end boss is flying or colliding with the character and false otherwise.
   */
  isFlyingOrCollidingCharacter() {
    return this.isAboveGround() || this.isColliding(this.world.character);
  }
}

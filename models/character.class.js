/**
 * Represents a character in the game world.
 * @extends MovableObject
 */
class Character extends MovableObject {
  /**
   * @type {number} X-coordinate position of the character
   */
  x = 0;

  /**
   * @type {number} Width of the character
   */
  width = 100;

  /**
   * @type {number} Height of the character
   */
  height = 250;

  /**
   * @typedef {Object} Offset
   * @property {number} top - Top offset
   * @property {number} left - Left offset
   * @property {number} right - Right offset
   * @property {number} bottom - Bottom offset
   */

  /**
   * @type {Offset} Offset values for the character's bounding box
   */
  offset = {
    top: 95,
    left: 15,
    right: 15,
    bottom: 12,
  };

  /**
   * @type {number} Horizontal speed of the character
   */
  speedX = 10;

  /**
   * @type {boolean} Determines if the character can turn around
   */
  canTurnAround = true;

  /**
   * @type {boolean} Determines if the character's movement is possible
   */
  movementPossible = true;

  /**
   * @type {number} Timestamp of the last movement made by the character
   */
  timeStempOflastMovement = new Date().getTime();

  /**
   * @type {number} Timestamp of the last bottle thrown by the character
   */
  lastThrow = 0;

  /**
   * @type {number} Timestamp of the last health purchased by the character
   */
  lastBuyingHealth = 0;

  /**
   * @type {number} Timestamp of the last bottle purchased by the character
   */
  lastBuyingBottle = 0;

  /**
   * @type {Array} Array of bottles collected by the character
   */
  bottles = [];

  /**
   * @type {number} Percentage of bottles collected by the character
   */
  bottlesPercentage = 0;

  /**
   * @type {Array} Array of coins collected by the character
   */
  coins = [];

  /**
   * @type {number} Percentage of coins collected by the character
   */
  coinsPercentage = 0;

  /**
   * @type {Array.<string>} Array of image paths for the short idle state
   * of the character
   */
  IMAGES_PATHS_IDLE_SHORT = [
    'img/2_character_pepe/1_idle/idle/I-1.png',
    'img/2_character_pepe/1_idle/idle/I-2.png',
    'img/2_character_pepe/1_idle/idle/I-3.png',
    'img/2_character_pepe/1_idle/idle/I-4.png',
    'img/2_character_pepe/1_idle/idle/I-5.png',
    'img/2_character_pepe/1_idle/idle/I-6.png',
    'img/2_character_pepe/1_idle/idle/I-7.png',
    'img/2_character_pepe/1_idle/idle/I-8.png',
    'img/2_character_pepe/1_idle/idle/I-9.png',
    'img/2_character_pepe/1_idle/idle/I-10.png',
  ];

  /**
   * @type {Array.<string>} Array of image paths for the long idle state
   * of the character
   */
  IMAGES_PATHS_IDLE_LONG = [
    'img/2_character_pepe/1_idle/long_idle/I-11.png',
    'img/2_character_pepe/1_idle/long_idle/I-12.png',
    'img/2_character_pepe/1_idle/long_idle/I-13.png',
    'img/2_character_pepe/1_idle/long_idle/I-14.png',
    'img/2_character_pepe/1_idle/long_idle/I-15.png',
    'img/2_character_pepe/1_idle/long_idle/I-16.png',
    'img/2_character_pepe/1_idle/long_idle/I-17.png',
    'img/2_character_pepe/1_idle/long_idle/I-18.png',
    'img/2_character_pepe/1_idle/long_idle/I-19.png',
    'img/2_character_pepe/1_idle/long_idle/I-20.png',
  ];

  /**
   * @type {Array.<string>} Array of image paths for the walking state
   * of the character
   */
  IMAGES_PATHS_WALKING = [
    'img/2_character_pepe/2_walk/W-21.png',
    'img/2_character_pepe/2_walk/W-22.png',
    'img/2_character_pepe/2_walk/W-23.png',
    'img/2_character_pepe/2_walk/W-24.png',
    'img/2_character_pepe/2_walk/W-25.png',
    'img/2_character_pepe/2_walk/W-26.png',
  ];

  /**
   * @type {Array.<string>} Array of image paths for the jumping state
   * of the character
   */
  IMAGES_PATHS_JUMPING = [
    'img/2_character_pepe/3_jump/J-31.png',
    'img/2_character_pepe/3_jump/J-32.png',
    'img/2_character_pepe/3_jump/J-33.png',
    'img/2_character_pepe/3_jump/J-34.png',
    'img/2_character_pepe/3_jump/J-35.png',
    'img/2_character_pepe/3_jump/J-36.png',
    'img/2_character_pepe/3_jump/J-37.png',
    'img/2_character_pepe/3_jump/J-38.png',
    'img/2_character_pepe/3_jump/J-39.png',
  ];

  /**
   * @type {Array.<string>} Array of image paths for the throwing state
   * of the character
   */
  IMAGES_PATHS_HURT = [
    'img/2_character_pepe/4_hurt/H-41.png',
    'img/2_character_pepe/4_hurt/H-42.png',
    'img/2_character_pepe/4_hurt/H-43.png',
  ];

  /**
   * @type {Array.<string>} Array of image paths for the purchasing state
   * of the character
   */
  IMAGES_PATHS_DEAD = [
    'img/2_character_pepe/5_dead/D-51.png',
    'img/2_character_pepe/5_dead/D-52.png',
    'img/2_character_pepe/5_dead/D-53.png',
    'img/2_character_pepe/5_dead/D-54.png',
    'img/2_character_pepe/5_dead/D-55.png',
    'img/2_character_pepe/5_dead/D-56.png',
  ];

  /**
   * The world object that the character belongs to.
   * @type {World}
   */
  world;

  /**
   * The constructor function for the character object.
   * @constructor
   */
  constructor() {
    super().loadImageFromImageCache(this.IMAGES_PATHS_WALKING[0]);
    this.positionOnGround();
  }

  /**
   * The interval handler function for checking if the character can make a movement.
   */
  checkMakeMovementIntervalHandler() {
    sounds.character.moveLeftOrRight.pause();

    if (this.canMoveAsDead()) this.moveAsDead();
    else if (this.canStillMove()) {
      // Check if the character can move right. If yes, the character moves right.
      if (this.canMoveRight()) this.moveRight();

      // Check if the character can move left. If yes, the character moves left.
      if (this.canMoveLeft()) this.moveLeft();

      // Check if the character can jump. If yes, the character jumps.
      if (this.canJump()) this.jump(20), sounds.character.jump.play();

      if (this.canThrowBottle()) this.throwBottle();

      if (this.canBuyHealth()) this.buyHealth();

      if (this.canBuyBottle()) this.buyBottle();
    }
  }

  /**
   * Checks if the character can move as dead.
   * @returns {boolean} True if the character is dead, otherwise false.
   */
  canMoveAsDead() {
    return this.isDead();
  }

  /**
   * Checks if the character can still move.
   * @returns {boolean} True if movement is possible, otherwise false.
   */
  canStillMove() {
    return this.movementPossible;
  }

  /**
   * Checks if the character can move right.
   * @returns {boolean} This returns true if character can move right, otherwise false.
   */
  canMoveRight() {
    /**
     *  Check and return true if the right arrow key is pressed on the assigned keyboard object and character is not futher than at the
     *  end x-coordinate of the current world level.
     */
    return this.world.keyboard.RIGHT.isPressed;
  }

  /**
   * Checks if the character can move left.
   * @returns {boolean} This returns true if character can move left, otherwise false.
   */
  canMoveLeft() {
    /**
     * Check and return true if the left arrow key is pressed on the assigned keyboard object and character is futher than at the
     * beginning x-coordinate.
     */
    return this.world.keyboard.LEFT.isPressed;
  }

  /**
   * Checks if the character can jump.
   * @returns {boolean} This returns true if the character can jump, otherwise false.
   */
  canJump() {
    /**
     * Check and return true if the up key is pressed on the assigned keyboard object and character is NOT above the
     * ground.
     */
    return this.world.keyboard.UP.isPressed && !this.isAboveGround();
  }

  /**
   * Checks if the character can throw a bottle.
   * @returns {boolean} This returns true if the character can throw a bottle, otherwise false.
   */
  canThrowBottle() {
    return this.world.keyboard.D.isPressed && !this.isTimePassedOfLastAction(this.lastThrow);
  }

  /**
   * Checks if the character can buy health.
   * @returns {boolean} This returns true if the character can buy health, otherwise false.
   */
  canBuyHealth() {
    return this.world.keyboard.A.isPressed && !this.isTimePassedOfLastAction(this.lastBuyingHealth);
  }

  /**
   * Checks if the character can buy a bottle.
   * @returns {boolean} This returns true if the character can buy a bottle, otherwise false.
   */
  canBuyBottle() {
    return this.world.keyboard.S.isPressed && !this.isTimePassedOfLastAction(this.lastBuyingBottle);
  }

  /**
   * Returns if enough time has passed since the character's last action.
   * @param {number} timestampOfLastAction - The timestamp of the character's last action.
   * @returns {boolean} True if enough time has passed, otherwise false.
   */
  isTimePassedOfLastAction(timestampOfLastAction) {
    let timePassed = new Date().getTime() - timestampOfLastAction; // Difference in ms.
    timePassed = timePassed / 1000; // Difference in s.
    return timePassed < 0.22;
  }

  /**
   * Moves the character as dead.
   */
  moveAsDead() {
    super.moveAsDead();
  }

  /**
   * Moves the character to the right.
   */
  moveRight() {
    // Diese Funktions enthält auch eine Funktionn mit dem gleichen Namen, d.h. z.B. moveRight() führt eine moveRight() aus der vererbenden SuperKlasse movableObject.class.js aus, dann ist diese geerbte Funktion, hier moveRight(), mittels super.moveRight() (zur Differeniezrung / "Kollision" bei gleicher FunktionsNamensGebung / Fehlervermeidung) innnerhalb der Funktion moveRight() auszuführen.
    if (!this.isAboveGround()) sounds.character.moveLeftOrRight.play();
    super.moveRight();
    this.otherDirection = false;
  }

  /**
   * Moves the character to the left.
   */
  moveLeft() {
    if (!this.isAboveGround()) sounds.character.moveLeftOrRight.play();
    super.moveLeft();
    this.otherDirection = true;
  }

  /**
   * Moves the character to the top.
   */
  jump(speedY) {
    super.jump(speedY);
  }

  /**
   * Takes a coin object and adds it to the character's collection.
   * @param {Coin} coinObj - The coin object to take.
   */
  takeCoin(coinObj) {
    sounds.coin.collect.currentTime = 0;
    sounds.coin.collect.play();
    this.world.level.coins = this.world.level.coins.filter((filteredElem) => filteredElem !== coinObj);
    this.coins.push(coinObj);
    this.updateCoinsPercentage();
  }

  /**
   * Updates the character's coin collection percentage.
   */
  updateCoinsPercentage() {
    this.coinsPercentage = (this.coins.length / this.world.level.amountOfAllCoins) * 100;
  }

  /**
   * Adds the given bottle object to the player's collection of bottles and updates the percentage of bottles
   * that the player has collected so far.
   * @param {Object} bottleObj - The bottle object to add to the player's collection.
   */
  takeBottle(bottleObj) {
    sounds.bottle.collect.currentTime = 0;
    sounds.bottle.collect.play();
    this.world.level.bottlesInGround = this.world.level.bottlesInGround.filter(
      (filteredElem) => filteredElem !== bottleObj
    );
    this.bottles.push(bottleObj);
    this.updateBottlesPercentage();
  }

  /**
   * Updates the percentage of bottles that the player has collected so far.
   */
  updateBottlesPercentage() {
    this.bottlesPercentage = (this.bottles.length / this.world.level.amountOfAllBottles) * 100;
  }

  /**
   * Throws the last bottle in the player's collection and updates the percentage of bottles
   * that the player has collected so far.
   */
  throwBottle() {
    this.lastThrow = new Date().getTime();
    let bottle = this.bottles[this.bottles.length - 1];
    if (bottle != undefined) {
      sounds.character.noCoinNoBottle.pause();
      sounds.character.noCoinNoBottle.currentTime = 0;
      sounds.bottle.throw.currentTime = 0;
      sounds.bottle.throw.play();

      bottle.otherDirection = this.otherDirection;
      bottle.x = this.x + this.width - this.offset.right;
      if (bottle.otherDirection) bottle.x = this.x + this.offset.right;
      bottle.y = this.y + 100;

      this.world.level.bottlesInFlight.push(bottle);
      bottle.isThrown = true;
      bottle.applyGravity();
      bottle.animate();

      this.bottles.pop();

      this.updateBottlesPercentage();
      this.world.bootlesBar.setPercentage(this.bottlesPercentage);
    } else sounds.character.noCoinNoBottle.play();
  }

  /**
   * Buys a bottle and adds it to the player's collection of bottles, and updates the percentage of bottles
   * that the player has collected so far.
   */
  buyBottle() {
    this.lastBuyingBottle = new Date().getTime();
    let coinForPayment = this.coins[this.coins.length - 1];
    if (coinForPayment != undefined && this.bottles.length < this.world.level.amountOfAllBottles) {
      sounds.character.noCoinNoBottle.pause();
      sounds.character.noCoinNoBottle.currentTime = 0;
      sounds.coin.buyBottle.currentTime = 0;
      sounds.coin.buyBottle.play();

      this.coins.pop();
      this.updateCoinsPercentage();
      this.world.coinsBar.setPercentage(this.coinsPercentage);

      let x = this.x;
      let y = this.y;
      let boughtBottle = new Bottle(undefined, x, y);
      this.bottles.push(boughtBottle);

      this.updateBottlesPercentage();
      this.world.bootlesBar.setPercentage(this.bottlesPercentage);
    } else sounds.character.noCoinNoBottle.play();
  }

  /**
   * Buys health for the player and updates the percentage of health that the player has left.
   */
  buyHealth() {
    this.lastBuyingHealth = new Date().getTime();
    let coinForPayment = this.coins[this.coins.length - 1];
    if (coinForPayment != undefined && this.health < this.healthInitial) {
      sounds.character.noCoinNoBottle.pause();
      sounds.character.noCoinNoBottle.currentTime = 0;
      sounds.coin.buyHealth.currentTime = 0;
      sounds.coin.buyHealth.play();
      this.coins.pop();
      this.updateCoinsPercentage();
      this.world.coinsBar.setPercentage(this.coinsPercentage);
      this.health++;
      this.updateHealthPercentage();
      this.world.healthBar.setPercentage(this.healthPercentage);
    } else sounds.character.noCoinNoBottle.play();
  }

  /**
   * Handler function for the interval that checks whether the player is in any state that updates
   * the last time stamp of the player's last movement, and updates the player's image set and current image accordingly.
   */
  checkSetImagesIntervalHandler() {
    sounds.character.snooring.pause();
    if (this.isDead()) this.changeImagesSetAndCurrentImg(this.IMAGES_PATHS_DEAD);
    else if (this.isInAnyStateUpdatingLastTimeStempOfLastMovement());
    else if (this.isInLongSleep())
      this.changeImagesSetAndCurrentImg(this.IMAGES_PATHS_IDLE_LONG), sounds.character.snooring.play();
    else this.changeImagesSetAndCurrentImg(this.IMAGES_PATHS_IDLE_SHORT);
  }

  /**
   * Handler function for the interval that checks whether the player is in any state that updates
   * the last time stamp of the player's last movement, and updates the player's image set and current image accordingly.
   */
  isInAnyStateUpdatingLastTimeStempOfLastMovement() {
    if (this.isHurt()) {
      this.changeImagesSetAndCurrentImg(this.IMAGES_PATHS_HURT);
      return this.updateTimeStempOfLastMovement();
    } else if (this.isAboveGround()) {
      sounds.character.moveLeftOrRight.pause();
      this.changeImagesSetAndCurrentImg(this.IMAGES_PATHS_JUMPING);
      return this.updateTimeStempOfLastMovement();
    } else if (this.isMovingLeftOrRight()) {
      this.changeImagesSetAndCurrentImg(this.IMAGES_PATHS_WALKING);
      return this.updateTimeStempOfLastMovement();
    } else if (this.isBuyingOrThrowing()) {
      this.loadImageFromImageCache('img/2_character_pepe/2_walk/W-25.png');
      return this.updateTimeStempOfLastMovement();
    }
    return false;
  }

  /**
   * Updates the time stamp of the player's last movement to the current time stamp.
   * @returns {boolean} - Always returns true.
   */
  updateTimeStempOfLastMovement() {
    this.timeStempOflastMovement = new Date().getTime();
    return true;
  }

  /**
   * Checks if the character is in a long sleep state.
   * @returns {boolean} True if the character is in a long sleep state, otherwise false.
   */
  isInLongSleep() {
    let secondsPassed = (new Date().getTime() - this.timeStempOflastMovement) / 1000;
    return secondsPassed > 5;
  }

  /**
   * Checks if the character is moving left or right.
   * @returns {boolean} True if the character is moving left or right, otherwise false.
   */
  isMovingLeftOrRight() {
    return this.world.keyboard.RIGHT.isPressed || this.world.keyboard.LEFT.isPressed;
  }

  /**
   * Checks if the character is performing a buying or throwing action.
   * @returns {boolean} True if the character is performing a buying or throwing action, otherwise false.
   */
  isBuyingOrThrowing() {
    return this.world.keyboard.A.isPressed || this.world.keyboard.S.isPressed || this.world.keyboard.D.isPressed;
  }

  /**
   * Checks if the character is colliding or pressing another object while jumping or falling.
   * @param {MovableObject} enemy - The enemy object to check for collision or pressing.
   */
  isCollidingOrPressingInJumpFallingDown(enemy) {
    if (!this.isHurt() && !enemy.isHurt()) {
      if (this.isPressing(enemy)) {
        enemy.hit();
        this.jump(15);
      } else this.hit();
    }
  }

  /**
   * Checks if the character is pressing an enemy.
   * @param {MovableObject} enemy - The enemy object to check if it's being pressed by the character.
   * @returns {boolean} True if the character is pressing the enemy, otherwise false.
   */
  isPressing(enemy) {
    return this.isAboveGround() && this.speedY <= 0 && !(enemy instanceof Endboss);
  }
}

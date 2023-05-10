/**
 * Represents a character in the game world.
 * @extends MovableObject
 */
class Character extends MovableObject {
  /**
   * X-coordinate position of the character
   * @type {number}
   */
  x = 0;

  /**
   * Width of the character
   * @type {number}
   */
  width = 100;

  /**
   * Height of the character
   * @type {number}
   */
  height = 250;

  /**
   * Offset values for the character's bounding box
   * @typedef {Object} Offset
   * @property {number} top - Top offset
   * @property {number} left - Left offset
   * @property {number} right - Right offset
   * @property {number} bottom - Bottom offset
   */
  /**
   * @type {Offset}
   */
  offset = {
    top: 95,
    left: 15,
    right: 15,
    bottom: 12,
  };

  /**
   * Horizontal speed of the character
   * @type {number}
   */
  speedX = 10;

  /**
   * Determines if the character can turn around
   * @type {boolean}
   */
  canTurnAround = true;

  /**
   * Determines if the character's movement is possible
   * @type {boolean}
   */
  movementPossible = true;

  /**
   * Timestamp of the last movement made by the character
   * @type {number}
   */
  timeStempOflastMovement = new Date().getTime();

  /**
   * Timestamp of the last bottle thrown by the character
   * @type {number}
   */
  lastThrow = 0;

  /**
   * Timestamp of the last health purchased by the character
   * @type {number}
   */
  lastBuyingHealth = 0;

  /**
   * Timestamp of the last bottle purchased by the character
   * @type {number}
   */
  lastBuyingBottle = 0;

  /**
   * Array of bottles collected by the character
   * @type {Array}
   */
  bottles = [];

  /**
   * Percentage of bottles collected by the character
   * @type {number}
   */
  bottlesPercentage = 0;

  /**
   * Array of coins collected by the character
   * @type {Array}
   */
  coins = [];

  /**
   * Percentage of coins collected by the character
   * @type {number}
   */
  coinsPercentage = 0;

  /**
   * Array of image paths for the short idle state of the character
   * @type {Array.<string>}
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
   * Array von Pfaden zu Bildern für den langen Leerlaufzustand
   * des Charakters
   * @type {Array.<string>}
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
   * Array von Pfaden zu Bildern für den Gehzustand des Charakters
   * @type {Array.<string>}
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
   * Array von Pfaden zu Bildern für den Sprungzustand des Charakters
   * @type {Array.<string>}
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
   * Array von Pfaden zu Bildern für den Verletzungszustand des Charakters
   * @type {Array.<string>}
   */
  IMAGES_PATHS_HURT = [
    'img/2_character_pepe/4_hurt/H-41.png',
    'img/2_character_pepe/4_hurt/H-42.png',
    'img/2_character_pepe/4_hurt/H-43.png',
  ];

  /**
   * Array von Pfaden zu Bildern für den Kaufzustand des Charakters
   * @type {Array.<string>}
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
   * @override
   */
  checkMakeMovementIntervalHandler() {
    sounds.character.moveLeftOrRight.pause();

    if (this.canMoveAsDead()) this.moveAsDead();
    else if (this.canStillMove()) {
      if (this.canMoveRight()) this.moveRight();
      if (this.canMoveLeft()) this.moveLeft();
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
    sounds.coin.collect.stop();
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
   * Adds the given bottle object to the character's collection of bottles and updates the percentage of bottles
   * that the character has collected so far.
   * @param {Object} bottleObj - The bottle object to add to the character's collection.
   */
  takeBottle(bottleObj) {
    sounds.bottle.collect.stop();
    sounds.bottle.collect.play();
    this.world.level.bottlesInGround = this.world.level.bottlesInGround.filter(
      (filteredElem) => filteredElem !== bottleObj
    );
    this.bottles.push(bottleObj);
    this.updateBottlesPercentage();
  }

  /**
   * Updates the percentage of bottles that the character has collected so far.
   */
  updateBottlesPercentage() {
    this.bottlesPercentage = (this.bottles.length / this.world.level.amountOfAllBottles) * 100;
  }

  /**
   * Throws the last bottle in the character's collection and updates the percentage of bottles
   * that the character has collected so far.
   */
  throwBottle() {
    this.lastThrow = new Date().getTime();
    let bottle = this.bottles[this.bottles.length - 1];
    if (bottle != undefined) this.throwBottleIfBottleAvailable(bottle);
    else sounds.character.noCoinNoBottle.play();
  }

  /**
   * Throws the given bottle if it is available, updating the bottle's position, applying gravity, animating it,
   * and updating the bottles percentage.
   * @param {Object} bottle - The bottle object to be thrown.
   */
  throwBottleIfBottleAvailable(bottle) {
    this.playSoundWhileThrowingOrBuying(sounds.bottle.throw);
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
  }

  /**
   * Buys a bottle and adds it to the character's collection of bottles, and updates the percentage of bottles
   * that the character has collected so far.
   */
  buyBottle() {
    this.lastBuyingBottle = new Date().getTime();
    let coinForPayment = this.coins[this.coins.length - 1];
    if (coinForPayment != undefined && this.bottles.length < this.world.level.amountOfAllBottles)
      this.buyBottleIfCoinAvailable();
    else sounds.character.noCoinNoBottle.play();
  }

  /**
   * Buys a bottle if a coin is available, removing a coin from the character's collection, updating the coins
   * percentage, and adding the bought bottle to the character's collection of bottles.
   */
  buyBottleIfCoinAvailable() {
    this.playSoundWhileThrowingOrBuying(sounds.coin.buyBottle);
    this.coins.pop();
    this.updateCoinsPercentage();
    this.world.coinsBar.setPercentage(this.coinsPercentage);
    let x = this.x;
    let y = this.y;
    let boughtBottle = new Bottle(undefined, x, y);
    this.bottles.push(boughtBottle);
    this.updateBottlesPercentage();
    this.world.bootlesBar.setPercentage(this.bottlesPercentage);
  }

  /**
   * Buys health for the character and updates the percentage of health that the character has left.
   */
  buyHealth() {
    this.lastBuyingHealth = new Date().getTime();
    let coinForPayment = this.coins[this.coins.length - 1];
    if (coinForPayment != undefined && this.health < this.healthInitial) this.buyHealthIfCoinAvailable();
    else sounds.character.noCoinNoBottle.play();
  }

  /**
   * Buys health for the character if a coin is available, removing a coin from the character's collection,
   * updating the coins percentage, and increasing the character's health.
   */
  buyHealthIfCoinAvailable() {
    this.playSoundWhileThrowingOrBuying(sounds.coin.buyHealth);
    this.coins.pop();
    this.updateCoinsPercentage();
    this.world.coinsBar.setPercentage(this.coinsPercentage);
    this.health++;
    this.updateHealthPercentage();
    this.world.healthBar.setPercentage(this.healthPercentage);
  }

  /**
   * Plays the given sound while throwing / buying bottle or health..
   * @param {Object} sound - The sound object to be played.
   */
  playSoundWhileThrowingOrBuying(sound) {
    sounds.character.noCoinNoBottle.stop();
    sound.stop();
    sound.play();
  }

  /**
   * Handler function for the interval that checks whether the character is in any state that updates
   * the last time stamp of the character's last movement, and updates the character's image set and current image accordingly.
   * @override
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
   * Handler function for the interval that checks whether the character is in any state that updates
   * the last time stamp of the character's last movement, and updates the character's image set and current image accordingly.
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
   * Updates the time stamp of the character's last movement to the current time stamp.
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

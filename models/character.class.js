class Character extends MovableObject {
  x = 0;
  // y =  - (this.height - this.offset.top - this.offset.bottom) - this.yOfGroundLine;
  width = 100;
  height = 250;
  offset = {
    top: 95,
    left: 15,
    right: 15,
    bottom: 12,
  };

  speedX = 10;
  coins = [];
  bottles = [];
  bottlesPercentage = 0;
  coinsPercentage = 0;
  timeStempOflastMovement = new Date().getTime();

  canTurnAround = true;

  lastThrow = 0;
  lastBuyingHealth = 0;
  lastBuyingBottle = 0;

  // Array of image paths of this class.
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

  IMAGES_PATHS_WALKING = [
    'img/2_character_pepe/2_walk/W-21.png',
    'img/2_character_pepe/2_walk/W-22.png',
    'img/2_character_pepe/2_walk/W-23.png',
    'img/2_character_pepe/2_walk/W-24.png',
    'img/2_character_pepe/2_walk/W-25.png',
    'img/2_character_pepe/2_walk/W-26.png',
  ];

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

  IMAGES_PATHS_HURT = [
    'img/2_character_pepe/4_hurt/H-41.png',
    'img/2_character_pepe/4_hurt/H-42.png',
    'img/2_character_pepe/4_hurt/H-43.png',
  ];

  IMAGES_PATHS_DEAD = [
    'img/2_character_pepe/5_dead/D-51.png',
    'img/2_character_pepe/5_dead/D-52.png',
    'img/2_character_pepe/5_dead/D-53.png',
    'img/2_character_pepe/5_dead/D-54.png',
    'img/2_character_pepe/5_dead/D-55.png',
    'img/2_character_pepe/5_dead/D-56.png',
  ];

  SOUND_DEAD = new Sound('audio/characterDead.mp3', 0.7);
  SOUND_HURT = new Sound('audio/characterHurt.mp3', 0.7);
  SOUND_JUMP = new Sound('audio/characterJump.mp3', 0.7);
  SOUND_MOVE_LEFT_OR_RIGHT = new Sound('audio/characterMoveLeftRight.mp3', 0.7);
  SOUND_SNOORING = new Sound('audio/characterSnooring.mp3', 0.7);
  SOUND_NO_COIN_NO_BOTTLE = new Sound('audio/characterNoCoin.mp3', 0.7);

  // Assigned world instance. --> In this way you can access f.e world.character.world.keyboard. ...
  // world;

  constructor() {
    // Via super() wird auf die Methode, hier z.B. loadImage() der Super Klasse zugegriffen.
    super().loadImage('img/2_character_pepe/2_walk/W-21.png');

    this.loadImages(this.IMAGES_PATHS_IDLE_SHORT);
    this.loadImages(this.IMAGES_PATHS_IDLE_LONG);

    // Loads the 'imageCache' with the image objects for the WALKING animation according to the image path array 'IMAGES_WALKING'.
    this.loadImages(this.IMAGES_PATHS_WALKING);
    // Loads the 'imageCache' with the image objects for the JUMP animation according to the image path array 'IMAGES_JUMP'.
    this.loadImages(this.IMAGES_PATHS_JUMPING);
    // Loads the 'imageCache' with the image objects for the DEAD animation according to the image path array 'IMAGES_DEAD'.
    this.loadImages(this.IMAGES_PATHS_DEAD);
    // Loads the 'imageCache' with the image objects for the HURT animation according to the image path array 'IMAGES_HURT'.
    this.loadImages(this.IMAGES_PATHS_HURT);

    this.positionOnGround();

    this.setAnimateIntervalHandlers();

    // Apply the gravity to the character.
    this.applyGravity();
    // this.y = 0;
    // Start character movement animation after the initialisation.
    // this.animate();
  }

  setAnimateIntervalHandlers() {
    this.check_MakeMovement_Interval_Handler = () => this.checkMakeMovement();
    this.check_SetImages_Interval_Handler = () => this.checkSetImages();
  }

  takeCoin(coinObj) {
    coinObj.SOUND_COLLECT.play();
    this.world.level.coins = this.world.level.coins.filter((filteredElem) => filteredElem !== coinObj);
    this.coins.push(coinObj);

    this.updateCoinsPercentage();
  }

  updateCoinsPercentage() {
    this.coinsPercentage = (this.coins.length / this.world.level.amountOfAllCoins) * 100;
  }

  takeBottle(bottleObj) {
    bottleObj.SOUND_COLLECT.play();
    this.world.level.bottlesInGround = this.world.level.bottlesInGround.filter(
      (filteredElem) => filteredElem !== bottleObj
    );
    this.bottles.push(bottleObj);

    this.updateBottlesPercentage();
  }

  updateBottlesPercentage() {
    this.bottlesPercentage = (this.bottles.length / this.world.level.amountOfAllBottles) * 100;
  }

  lastThrownBottle;

  throwBottle() {
    let bottle = this.bottles[this.bottles.length - 1];
    if (bottle != undefined) {
      bottle.SOUND_THROW.play();

      bottle.otherDirection = this.otherDirection;
      bottle.x = this.x + this.width - this.offset.right;
      if (bottle.otherDirection) bottle.x = this.x + this.offset.right;

      bottle.y = this.y + 100;

      bottle.isThrown = true;
      this.bottles.pop();

      // this.world.level.bottles.push(bottle);
      this.world.level.bottlesInFlight.push(bottle);

      this.lastThrow = new Date().getTime();

      this.lastThrownBottle = bottle;
      this.updateBottlesPercentage();
      this.world.bootlesBar.setPercentage(this.bottlesPercentage);
    } else this.SOUND_NO_COIN_NO_BOTTLE.play();
  }

  /**
   * Changes the character image every set interval. --> Animate a character motion in this way.
   */
  animate2() {
    // CHANGING POSITION, WAY, SPEED, ACCELERATION OF CHARACTEER--> MOVING CHARACTER
    /**
     * Separated changing of x-position with a higher speed than the changing of the animation images below
     * to created more fluent movement.
     */
    setStoppableInterval(() => this.moveCharacter(), 1000 / 60); // 60 fps
    // CHANGING PLAYED IMAGES OF CHARACTER
    setStoppableInterval(() => this.playCharacter(), 50); // 20 fps
  }

  checkMakeMovement() {
    this.SOUND_MOVE_LEFT_OR_RIGHT.pause();

    // if (this.canMoveAsDead()) this.moveAsDead();
    if (this.canMoveAsDead()) this.moveAsDead(); //TODO: DEAD SOLL NUR EINMALL GESPIELT WERDEN NICHT IM LOOP
    else {
      // Check if the character can move right. If yes, the character moves right.
      if (this.canMoveRight()) this.moveRight();

      // Check if the character can move left. If yes, the character moves left.
      if (this.canMoveLeft()) this.moveLeft();

      // Check if the character can jump. If yes, the character jumps.
      if (this.canJump()) this.jump(20), this.SOUND_JUMP.play();

      if (this.canThrowBottle()) this.throwBottle();

      if (this.canBuyHealth()) this.buyHealth();

      if (this.canBuyBottle()) this.buyBottle();
    }
  }

  // this.world.camera_x = -this.x + this.world.camera_x_shift;

  isAlive() {}

  canMoveAsDead() {
    return this.isDead();
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
    // return this.world.keyboard.LEFT && this.x > this.world.level.start_x;
    return this.world.keyboard.LEFT.isPressed;
  }

  /**
   * Checks if the character can jump.
   * @returns {boolean} This returns true if character can jump, otherwise false.
   *
   */
  canJump() {
    /**
     * Check and return true if the up key is pressed on the assigned keyboard object and character is NOT above the
     * ground.
     */
    return this.world.keyboard.UP.isPressed && !this.isAboveGround();
  }

  canThrowBottle() {
    return this.world.keyboard.D.isPressed && !this.isTimePassedOfLastAction(this.lastThrow);
  }

  canBuyHealth() {
    return this.world.keyboard.A.isPressed && !this.isTimePassedOfLastAction(this.lastBuyingHealt);
  }

  canBuyBottle() {
    return this.world.keyboard.S.isPressed && !this.isTimePassedOfLastAction(this.lastBuyingBottle);
  }

  /**
   * Returns if character ended last bottle throw.
   */
  /**
   * Returns if character ended last bottle throw.
   */

  /**
   * Returns if character ended last bottle throw.
   */
  isTimePassedOfLastAction(timestampOfLastAction) {
    let timePassed = new Date().getTime() - timestampOfLastAction; // Difference in ms.
    timePassed = timePassed / 1000; // Difference in s.
    return timePassed < 0.22;
  }

  /**
   * Moves the character to the right.
   */
  moveRight() {
    // Diese Funktions enthält auch eine Funktionn mit dem gleichen Namen, d.h. z.B. moveRight() führt eine moveRight() aus der vererbenden SuperKlasse movableObject.class.js aus, dann ist diese geerbte Funktion, hier moveRight(), mittels super.moveRight() (zur Differeniezrung / "Kollision" bei gleicher FunktionsNamensGebung / Fehlervermeidung) innnerhalb der Funktion moveRight() auszuführen.
    if (!this.isAboveGround()) this.SOUND_MOVE_LEFT_OR_RIGHT.play();
    super.moveRight();
    this.otherDirection = false;
  }

  /**
   * Moves the character to the left.
   */
  moveLeft() {
    if (!this.isAboveGround()) this.SOUND_MOVE_LEFT_OR_RIGHT.play();
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
   * Moves the character as dead.
   */
  moveAsDead() {
    super.moveAsDead();
  }

  buyBottle() {
    let coinForPayment = this.coins[this.coins.length - 1];
    if (coinForPayment != undefined && this.bottles.length < this.world.level.amountOfAllBottles) {
      this.lastBuyingBottle = new Date().getTime();

      coinForPayment.SOUND_BUY_HEALTH.play();

      coinForPayment.canBeRemoved = true;
      this.updateCoinsPercentage();
      this.world.coinsBar.setPercentage(this.coinsPercentage);

      let x = this.x;
      let y = this.y;
      let boughtBottle = new Bottle(undefined, x, y);
      this.bottles.push(boughtBottle);
      this.world.level.amountOfAllBottles++;

      this.updateBottlesPercentage();
      this.world.bootlesBar.setPercentage(this.bottlesPercentage);
    } else this.SOUND_NO_COIN_NO_BOTTLE.play();
  }

  buyHealth() {
    let coinForPayment = this.coins[this.coins.length - 1];
    if (coinForPayment != undefined && this.health < this.healthInitial) {
      this.lastBuyingHealth = new Date().getTime();

      coinForPayment.SOUND_BUY_BOTTLE.play();

      coinForPayment.canBeRemoved = true;
      this.updateCoinsPercentage();
      this.world.coinsBar.setPercentage(this.coinsPercentage);

      this.health++;
      if (this.health > this.healthInitial) this.health = this.healthInitial;

      this.updateHealthPercentage();
      this.world.healthBar.setPercentage(this.healthPercentage);
    } else this.SOUND_NO_COIN_NO_BOTTLE.play();
  }

  checkSetImages() {
    this.SOUND_SNOORING.pause();
    if (this.isDead()) this.changeImagesSetAndCurrentImg(this.IMAGES_PATHS_DEAD);
    else if (this.isInAnyStateUpdatingLastTimeStempOfLastMovement());
    else if (this.isInLongSleep())
      this.changeImagesSetAndCurrentImg(this.IMAGES_PATHS_IDLE_LONG), this.SOUND_SNOORING.play();
    else this.changeImagesSetAndCurrentImg(this.IMAGES_PATHS_IDLE_SHORT);
  }

  isInAnyStateUpdatingLastTimeStempOfLastMovement() {
    if (this.isHurt()) {
      this.changeImagesSetAndCurrentImg(this.IMAGES_PATHS_HURT);
      this.updateTimeStempOfLastMovement();
      return true;
    } else if (this.isAboveGround()) {
      this.SOUND_MOVE_LEFT_OR_RIGHT.pause();
      this.changeImagesSetAndCurrentImg(this.IMAGES_PATHS_JUMPING);
      this.updateTimeStempOfLastMovement();
      return true;
    } else if (this.isMovingLeftOrRightOrBuyingOrThrowing()) {
      this.updateTimeStempOfLastMovement();
      this.changeImagesSetAndCurrentImg(this.IMAGES_PATHS_WALKING);
      return true;
    }
    return false;
  }

  updateTimeStempOfLastMovement() {
    this.timeStempOflastMovement = new Date().getTime();
  }

  isInLongSleep() {
    let secondsPassed = (new Date().getTime() - this.timeStempOflastMovement) / 1000;
    return secondsPassed > 5;
  }

  isMovingLeftOrRightOrBuyingOrThrowing() {
    return (
      this.world.keyboard.RIGHT.isPressed ||
      this.world.keyboard.LEFT.isPressed ||
      this.world.keyboard.A.isPressed ||
      this.world.keyboard.S.isPressed ||
      this.world.keyboard.D.isPressed
    );
  }

  isCollidingOrPressingInJumpFallingDown(enemy) {
    if (!this.isHurt() && !enemy.isHurt()) {
      if (this.isPressing(enemy)) {
        enemy.hit();
        this.jump(15);
      } else this.hit();
    }
  }

  isPressing(enemy) {
    console.log(this.isAboveGround());
    console.log(this.speedY <= 0);
    console.log(!enemy instanceof Endboss);
    return this.isAboveGround() && this.speedY <= 0 && !(enemy instanceof Endboss);
  }
}

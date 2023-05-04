/**
 * An abstract class representing a movable object. Subclasses can provide their own implementations for the
 * '{@link checkMakeMovementIntervalHandler}' and '{@link checkSetImagesIntervalHandler}' methods.
 * @abstract
 * @class
 * @extends DrawableObject
 */
class MovableObject extends DrawableObject {
  /**
   * @type {number} speedX - Speed of horizontal motion animation.
   */
  speedX = 0.15;

  /**
   * @type {number} speedY - Speed and acceleration during jump / falling down.
   */
  speedY = 0;

  /**
   * @type {number} acceleration - Acceleration during jump / falling down.
   */
  acceleration = 1;

  /**
   * @type {boolean} canTurnAround - Determines if the object can turn around.
   */
  canTurnAround = false;

  /**
   * @type {boolean} otherDirection - Determines if the object is moving in the other direction.
   */
  otherDirection = false;

  /**
   * @type {number} currentImgIdx - The high counter of the iteration through the given 'images' array in the animate() function.
   */
  currentImgIdx = 0;

  /**
   * @type {Array<Image>} currentImagesSet - The current set of images used for animation.
   */
  currentImagesSet;

  /**
   * @type {number} health - Health of the movable object.
   */
  health = 5;

  /**
   * @type {number} healthInitial - Initial health of the movable object.
   */
  healthInitial = this.health;

  /**
   * @type {number} healthPercentage - Percentage of the current health.
   */
  healthPercentage = 100;

  /**
   * @type {number} lastHit - Timestamp of the last hit.
   */
  lastHit = 0;

  /**
   * @type {number} animationInterval_Part_Check_MakeMovement_Id - The ID for the animation interval part related to the checkMakeMovementIntervalHandler() function.
   */
  animationInterval_Part_Check_MakeMovement_Id;

  /**
   * @type {number} animationInverval_Part_ChecK_ChangingImg_Id - The ID for the animation interval part related to the checkSetImagesIntervalHandler() function.
   */
  animationInverval_Part_ChecK_ChangingImg_Id;

  /**
   * @type {boolean} animationInterval_Part_MakeMovement_IsOver - Indicates if the animation interval part related to make movement is over.
   */
  animationInterval_Part_MakeMovement_IsOver = false;

  /**
   * @type {boolean} animationInverval_Part_ChangingImg_IsOver - Indicates if the animation interval part related to changing images is over.
   */
  animationInverval_Part_ChangingImg_IsOver = false;

  /**
   * @type {boolean} moveAsDeadStarted - Indicates if the movement as dead has started.
   */
  moveAsDeadStarted = false;

  /**
   * @type {boolean} deadAnimation_Part_SetLastImg_IsOver - Indicates if the dead animation part related to setting the last image is over.
   */
  deadAnimation_Part_SetLastImg_IsOver = false;

  /**
   * @type {boolean} deadAnimation_Part_MakeMovement_IsOver - Indicates if the dead animation part related to making movement is over.
   */
  deadAnimation_Part_MakeMovement_IsOver = false;

  /**
   * @type {boolean} canBeRemoved - Indicates if the object can be removed from the game world.
   */
  canBeRemoved = false;

  /**
   * @type {Object} level - Reference to the level the object is in.
   */
  level;

  /**
   * Sets the gravity to the movable object.
   */
  applyGravity() {
    setStoppableInterval(() => {
      /**
       * Checks if the movable object reached the ground OR has a positive y-speed (in the initial started phase of the
       * jump / throw before reaching the highest point / falling down).
       */
      if (
        (this.health > 0 && (this.isAboveGround() || this.speedY > 0)) ||
        ((this instanceof Character || this instanceof Endboss) && this.isDead())
      ) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  /**
   * Checks if the object is above the ground level.
   * @returns {boolean} - True if the object is above the ground, false otherwise.
   */
  isAboveGround() {
    return this.y + this.height < this.yOfGroundLevel;
  }

  /**
   * Returns if movable object is dead (health amount is zero).
   * @returns {boolean} - True if the object is dead, false otherwise.
   */
  isDead() {
    return this.health == 0;
  }

  /**
   * Returns if movable object is hurt.
   * @returns {boolean} - True if the object is hurt, false otherwise.
   */
  isHurt() {
    let timePassed = new Date().getTime() - this.lastHit; // Difference in ms.
    timePassed = timePassed / 1000; // Difference in s.
    return timePassed < 1;
  }

  /**
   * Checks if the object is colliding with another object.
   * @param {MovableObject} obj - The object to check for collision.
   * @returns {boolean} - True if the objects are colliding, false otherwise.
   */
  isColliding(obj) {
    return (
      !this.isDead() &&
      !obj.isDead() &&
      this.x + this.width - this.offset.right >= obj.x + obj.offset.left && // R -> L. Compare the right character side width left object side considering the offset distances.
      this.y + this.height - this.offset.bottom >= obj.y + obj.offset.top && // T -> B. Compare the bottom character side width top object side considering the offset distances.
      this.x + this.offset.left <= obj.x + obj.width - obj.offset.right && // L -> R. Compare the left character side width right object side considering the offset distances.
      this.y + this.offset.top <= obj.y + obj.height - obj.offset.bottom // B -> T. Compare the top character side width bottom object side considering the offset distances.
    );
  }

  /**
   * Reduces movable object's health by colliding.
   */
  hit() {
    let soundType = this.getSoundTypeWhileHitting();
    if (soundType && !(this instanceof Bottle)) this.playHurtSoundWhileHitting(soundType);
    this.health--;
    // Check if the health is zero or negative.
    if (this.health <= 0) {
      // Yes, set it minimally to zero.
      this.health = 0;
      if (soundType) this.playDeadSoundWhileHitting(soundType);
    }
    this.lastHit = new Date().getTime();
    this.updateHealthPercentage();
  }

  /**
   * Returns the sound type based on the instance of the movable object.
   * @returns {string|null} The sound type, or null if no matching type is found.
   */
  getSoundTypeWhileHitting() {
    if (this instanceof Character) return 'character';
    if (this instanceof ChickenNormal || this instanceof ChickenSmall) return 'chicken';
    if (this instanceof Endboss) return 'endboss';
    if (this instanceof Bottle) return 'bottle';
    return null;
  }

  /**
   * Plays the hurt sound for the current movable object based on its instance.
   * @param {string} soundType - The sound type based on the instance of the movable object.
   */
  playHurtSoundWhileHitting(soundType) {
    sounds[soundType].hurt.currentTime = 0;
    sounds[soundType].hurt.play();
  }

  /**
   * Plays the dead sound for the current movable object when its health reaches zero or below.
   * @param {string} soundType - The sound type based on the instance of the movable object.
   */
  playDeadSoundWhileHitting(soundType) {
    sounds[soundType].dead.currentTime = 0;
    sounds[soundType].dead.play();
  }

  /**
   * Updates the object's health percentage.
   */
  updateHealthPercentage() {
    this.healthPercentage = (this.health / this.healthInitial) * 100;
  }

  /**
   * Abstract method that defines if the movable object can and how should change its position.
   * Subclasses can provide their own implementation of this method if they do
   * not want the default implementation provided by this class.
   * This is one of two possible partial animation interval handler executed in {@link animate} method
   * by this method {@link checkIf_Check_MakeMovement_Invervall_Exist_AndSetIt} .
   * @abstract
   */
  checkMakeMovementIntervalHandler() {
    // The default implementation does nothing.
  }

  /**
   * Abstract method that defines if the the movable object can and how should change its image.
   * Subclasses can provide their own implementation of this method if they do
   * not want the default implementation provided by this class.
   * This is one of two possible partial animation interval handler executed in {@link animate} method
   * by this method {@link checkIf_Check_SetImages_Interval_Exist_AndSetIt} .
   * @abstract
   */
  checkSetImagesIntervalHandler() {
    // The default implementation does nothing.
  }

  /**
   * Animates a motion of movable object changing its position and current played images every time interval.
   * This function relies on the implementation of abstract methods '{@link checkMakeMovementIntervalHandler}' and
   * '{@link checkSetImagesIntervalHandler}' provided by subclasses.
   * @param {number} [movementFrameRate=60] - The movement frame rate.
   * @param {number} [imgChangeFrameRate=20] - The image change frame rate.
   */
  animate(movementFrameRate = 60, imgChangeFrameRate = 20) {
    // Calculate time intervals for movement and changing images
    let movementTimeout = 1000 / movementFrameRate;
    let imgChangeTimeout = 1000 / imgChangeFrameRate;
    this.checkIf_Check_MakeMovement_Invervall_Exist_AndSetIt(movementTimeout);
    this.checkIf_Check_SetImages_Interval_Exist_AndSetIt(imgChangeTimeout);
    this.checkInLoopIfBothAnimationPartInvervalAreOver();
  }

  /**
   * Checks if the `checkMakeMovementIntervalHandler` method is implemented in the subclass and sets the movement interval accordingly.
   * @param {number} movementTimeout - The movement timeout calculated based on the movement frame rate.
   */
  checkIf_Check_MakeMovement_Invervall_Exist_AndSetIt(movementTimeout) {
    // Check if `checkMakeMovementIntervalHandler` is implemented in the subclass before setting interval.
    if (this.is_Check_MakeMovement_Interval_Handler_Implemented()) {
      // Yes, set animation part interval and save its id to 'animationInterval_Part_MakeMovement_Id'.
      this.animationInterval_Part_Check_MakeMovement_Id = setStoppableInterval(() => {
        // Check if the dead animation part interval = the last possible animation part interval, is not over, for the part 'Check_MakeMovement'.
        if (!this.deadAnimation_Part_MakeMovement_IsOver) {
          // Execute the animation part interval handler for part 'Check_MakeMovement'.
          this.checkMakeMovementIntervalHandler();
        } else {
          // Clear the animation part interval for part 'Check_MakeMovement'.
          clearInterval(this.animationInterval_Part_Check_MakeMovement_Id);
          // Set the storage that animation part interval for part 'Check_MakeMovement' is over.
          this.animationInterval_Part_MakeMovement_IsOver = true;
        }
      }, movementTimeout);
    }
  }

  /**
   * Checks if the `checkSetImagesIntervalHandler` method is implemented in the subclass and sets the movement interval accordingly.
   * @param {number} movementTimeout - The movement timeout calculated based on the movement frame rate.
   */
  checkIf_Check_SetImages_Interval_Exist_AndSetIt(imgChangeTimeout) {
    // Check if `checkSetImagesIntervalHandler` is implemented in the subclass before setting interval.
    if (this.is_Check_SetImages_Interval_Handler_Implemented()) {
      // Yes, set animation part interval and save its id to 'animationInverval_Part_ChecK_ChangingImg_Id'.
      this.animationInverval_Part_ChecK_ChangingImg_Id = setStoppableInterval(() => {
        // Check if the dead animation part interval = the last possible animation part interval, is not over, for the part 'Check_SetImages'.
        if (!this.deadAnimation_Part_SetLastImg_IsOver) {
          // Execute the animation part interval handler for part 'Check_SetImages'.
          this.checkSetImagesIntervalHandler();
        } else {
          // Clear the animation part interval for part 'Check_SetImages'.
          clearInterval(this.animationInverval_Part_ChecK_ChangingImg_Id);
          // Set the storage that animation part interval for part 'Check_SetImages' is over.
          this.animationInverval_Part_ChangingImg_IsOver = true;
        }
      }, imgChangeTimeout);
    }
  }

  /**
   * Continuously checks if both animation part intervals, movement and image change, are over.
   * If both intervals are over, the object can be removed.
   */
  checkInLoopIfBothAnimationPartInvervalAreOver() {
    if (this.are_BothCheckAnimationPart_Interval_Handler_Implemented()) {
      let checkInLoopIfBothDeadAnimationPartsAreOver_Inverval_Id = setStoppableInterval(() => {
        if (
          this.animationInterval_Part_MakeMovement_IsOver == true &&
          this.animationInverval_Part_ChangingImg_IsOver == true
        ) {
          this.canBeRemoved = true;
          clearInterval(checkInLoopIfBothDeadAnimationPartsAreOver_Inverval_Id);
        }
      }, 1000 / 60);
    }
  }

  /**
   * Checks if the checkSetImagesIntervalHandler is implemented in the subclass.
   * @returns {boolean} - True if the checkSetImagesIntervalHandler is implemented, false otherwise.
   */
  is_Check_MakeMovement_Interval_Handler_Implemented() {
    return typeof this.checkMakeMovementIntervalHandler === 'function';
  }

  /**
   * Checks if the checkSetImagesIntervalHandler is implemented in the subclass.
   * @returns {boolean} - True if the checkSetImagesIntervalHandler is implemented, false otherwise.
   */
  is_Check_SetImages_Interval_Handler_Implemented() {
    return typeof this.checkSetImagesIntervalHandler === 'function';
  }

  /**
   * Checks if both checkMakeMovementIntervalHandler and checkSetImagesIntervalHandler are implemented in the subclass.
   * @returns {boolean} - True if both handlers are implemented, false otherwise.
   */
  are_BothCheckAnimationPart_Interval_Handler_Implemented() {
    return (
      this.is_Check_MakeMovement_Interval_Handler_Implemented() &&
      this.is_Check_SetImages_Interval_Handler_Implemented()
    );
  }

  /**
   * Moves the movable object to the right.
   * Takes into account the level boundaries and whether the object can turn around.
   */
  moveRight() {
    if (this.canTurnAround) {
      if (this.x + this.width < this.level.end_x) this.x += this.speedX;
      else this.otherDirection = !this.otherDirection;
    } else this.x += this.speedX;
  }

  /**
   * Moves the movable object to the left.
   * Takes into account the level boundaries and whether the object can turn around.
   */
  moveLeft() {
    if (this.canTurnAround) {
      if (this.x > this.level.start_x) this.x -= this.speedX;
      else this.otherDirection = !this.otherDirection;
    } else this.x -= this.speedX;
  }

  /**
   * Makes the movable object jump with the specified vertical speed.
   * @param {number} speedY - The vertical speed for the jump.
   */
  jump(speedY) {
    this.speedY = speedY;
  }

  /**
   * Moves the object as if it is dead.
   */
  moveAsDead() {
    if (this.hasMoveAsDeadNotStarted()) this.startMoveAsDead();
    else if (this.isMovingDead()) this.moveInXDirection();
    else this.deadAnimation_Part_MakeMovement_IsOver = true;
  }

  /**
   * Checks if the move as dead animation has not started yet.
   * @returns {boolean} - Returns true if the move as dead animation has not started yet.
   */
  hasMoveAsDeadNotStarted() {
    return !this.moveAsDeadStarted;
  }

  /**
   * Starts the move as dead animation.
   */
  startMoveAsDead() {
    this.moveAsDeadStarted = true;
    // Set the horizontal and vertical speed for 'jump / falling down' as dead.
    this.setDirectionAsPerCanvasCenter();
    this.speedX = 5;
    this.jump(15);
    this.moveInXDirection();
  }

  /**
   * Sets the direction of the object towards the canvas center.
   */
  setDirectionAsPerCanvasCenter() {
    if (this.checkIfOnLeftOrRightCanvasHalf()) this.otherDirection = false;
    else this.otherDirection = true;
  }

  /**
   * Checks if the object is on the left or right half of the canvas.
   * @returns {string} - Returns 'left' or 'right' depending on the position of the object.
   */
  checkIfOnLeftOrRightCanvasHalf() {
    let xCanvasCenter = -this.world.camera_x + this.world.canvas.width / 2;
    let xMOCenter = this.x + this.width / 2;
    return xMOCenter > xCanvasCenter;
  }

  /**
   * Determines if the object is currently moving as dead.
   * @returns {boolean} - Returns true if the object is moving as dead.
   */
  isMovingDead() {
    return this.isTopImgContourVisible();
  }

  /**
   * Checks if the top image contour of the object is visible.
   * @returns {boolean} - Returns true if the top image contour is visible.
   */
  isTopImgContourVisible() {
    return this.y < 480;
  }

  /**
   * Checks if the top image contour of the object is visible.
   * @returns {boolean} - Returns true if the top image contour is visible.
   */
  moveInXDirection() {
    if (this.otherDirection == true) this.moveRight();
    else this.moveLeft();
    if (this instanceof Character) this.otherDirection = !this.otherDirection;
  }

  /**
   * Changes the image set and the current image of the object.
   * @param {Array} newCurrentImagesSet - The new image set to use.
   */
  changeImagesSetAndCurrentImg(newCurrentImagesSet) {
    if (this.currentImagesSet !== newCurrentImagesSet) {
      this.currentImagesSet = newCurrentImagesSet;
      this.currentImgIdx = 0;
    } else {
      /**
       * EXPLANATION FOR CIRCULATION THROUGH A RANGE OF INDICES BY MODULO DIVISION:
       * Modulo function returns ONLY the rest of the devision.
       * On the example of character with 6 images, possible return values: 6, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5, 0, 1, ...
       * let i = 0 % 6 => 0, Rest 0    let i = 1 % 6 => 0, Rest 1     let i = 2 % 6 => 0, Rest 2
       * let i = 6 % 6 => 1, Rest 0    let i = 7 % 6 => 1, Rest 1     let i = 8 % 6 => 1, Rest 2  ...
       * In this way 'i' can again be 0 after beeing equal to the given array lenght minus (here 6 - 1 = 5) one before it.
       * --> Continously incrementation of the counter oscilating between first and last index of the given array (here 0 and 5)..
       * Assign new value for i equal to the modulo function below in this interval.
       */
      this.currentImgIdx = this.currentImgIdx % this.currentImagesSet.length;
    }
    // Assign the current path from given 'images' array according to the 'i'.
    let path = this.currentImagesSet[this.currentImgIdx];
    // Assign new image object from 'imageCache' accroding the current iterated 'path' as the key.
    this.img = DrawableObject.imageCache[path];
    // Increase the iteration counter by one.
    if (this.currentImgIdx == this.currentImagesSet.length - 1) {
      if (!this.isDead()) this.currentImgIdx = 0;
      else this.deadAnimation_Part_SetLastImg_IsOver = true;
    } else this.currentImgIdx++;
  }
}

class MovableObject extends DrawableObject {
  // Speed of horizontal motion animation
  speedX = 0.15;
  otherDirection = false;
  // Speed and accelaration during jump / falling down.
  speedY = 0;
  acceleration = 1;
  // Variable, welche in der neuen nicht im Video benutzten Kollisionsformel verwendet wrid. Bedeutet y-Versatz. Wird wenigstens auf 0 von mir gesetzt, damit die neue besser Kollisionsformel überhaupt funktioniert.
  offsetY = 0;

  // High counter of the itaration through the given 'images' array the in the fuction animate()
  currentImgIdx = 0;

  health = 5;
  healthInitial = this.health;
  healthPercentage = 100;

  lastHit = 0;
  isMoveAsDeadStarted = false;

  check_MakeMovement_Interval_Handler;
  check_SetImages_Interval_Handler;

  deadAnimation_Part_SetLastImg_IsOver = false;
  deadAnimation_Part_MakeMovement_IsOver = false;
  canBeRemoved = false;

  currentImagesSet;
  world;
  level;

  canTurnAround = false;

  static allMovableObjectsInstances = [];

  constructor() {
    super();
/*     this.id = Object.keys(MovableObject.allMovableObjectsInstances).length + 1; // Set unique ID for each MovableObject instance
    MovableObject.allMovableObjectsInstances[this.id] = this; */
  }

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
   * Gets if the movable object is above the ground.
   * @returns {boolean} This returns true if movable object is above ground, false if not.
   */
  isAboveGround2() {
    // Check if the movable object is a throwable object.
    if (this instanceof bottle) {
      // Yes, returns true. --> Throwable object should always fall / not stop on the ground (y = 180px).
      return true;
    } else {
      // No, check if the movable object is above the ground (y = 180px). Return true if it is, no if it is not.
      return this.y + this.height < this.yOfGroundLine; // TODO: Create / improver definition of the ground line for all moving objects. It should be used initially by placing the MOs. Is is the border also, where jump should FOR ALL jumping m.o end.
    }
  }

  isAboveGround() {
    return this.y + this.height < this.yOfGround;
  }

  // Alte Formel, im Modul Video benutzt und erklärt.
  isColliding_ALT(mo) {
    return (
      this.x + this.width > mo.x && this.y + this.height > mo.y && this.x < mo.x + mo.width && this.y < mo.y + mo.height
    );
  }

  // Bessere Formel zur Kollisionsberechnung (Genauer)
  // Neuere bessere Formel, nicht im Modul Video benutzt
  // Syntax: z.B. character.isColliding(chicken)
  isColliding_ALT_2(obj) {
    return (
      this.x + this.width >= obj.x &&
      this.x <= obj.x + obj.width &&
      this.y + this.offsetY + this.height >= obj.y &&
      this.y + this.offsetY <= obj.y + obj.height
      // Optional: hiermit könnten wir schauen, ob ein Objekt sich in die richtige Richtung bewegt. Nur dann kollidieren wir. Nützlich bei Gegenständen, auf denen man stehen kann.
      // obj.onCollisionCourse
    );
  }
  s;
  // Noch bessere Formel zur Kollisionsberechnung (Noch Genauer)
  // Noch neuere bessere Formel, im FAQ Modul Video später mit Erläuterungsbild ergäntzt.
  // Syntax: z.B. character.isColliding(chicken)
  isColliding(obj) {
    return (
      !this.isDead() &&
      !obj.isDead() &&
      this.x + this.width - this.offset.right >= obj.x + obj.offset.left && // R -> L. Compare the right character side width left object side considering the offset distances.
      this.y + this.height - this.offset.bottom >= obj.y + obj.offset.top && // T -> B. Compare the bottom character side width top object side considering the offset distances.
      this.x + this.offset.left <= obj.x + obj.width - obj.offset.right && // L -> R. Compare the left character side width right object side considering the offset distances.
      this.y + this.offset.top <= obj.y + obj.height - obj.offset.bottom // B -> T. Compare the top character side width bottom object side considering the offset distances.
      // Optional: hiermit könnten wir schauen, ob ein Objekt sich in die richtige Richtung bewegt. Nur dann kollidieren wir. Nützlich bei Gegenständen, auf denen man stehen kann.
      // obj.onCollisionCourse
    );
  }

  /**
   * Reduces movable object's health by colliding.
   */
  hit() {
    if (this instanceof Character) {
      sounds.character.hurt.currentTime = 0;
      sounds.character.hurt.play();
    }
    if (this instanceof ChickenNormal || this instanceof ChickenSmall) {
      sounds.chicken.hurt.currentTime = 0;
      sounds.chicken.hurt.play();
    }
    if (this instanceof Endboss) {
      sounds.endboss.hurt.currentTime = 0;
      sounds.endboss.hurt.play();
    }
    this.health--;
    // Check if the health is zero or negative.
    if (this.health <= 0) {
      if (this instanceof Character) {
        sounds.character.dead.play();
      }
      if (this instanceof ChickenNormal || this instanceof ChickenSmall) {
        sounds.chicken.dead.currentTime = 0;
        sounds.chicken.dead.play();
      }
      if (this instanceof Endboss) {
        sounds.endboss.dead.play();
      }
      // Yes, set it minimally to zero.
      this.health = 0;
    }
    this.lastHit = new Date().getTime();
    this.updateHealthPercentage();
  }

  updateHealthPercentage() {
    this.healthPercentage = (this.health / this.healthInitial) * 100;
  }

  /**
   * Returns if movable object is hurt.
   */
  isHurt() {
    let timePassed = new Date().getTime() - this.lastHit; // Difference in ms.
    timePassed = timePassed / 1000; // Difference in s.
    return timePassed < 1;
  }

  /**
   * Returns if movable object is dead (health amount is zero).
   */
  isDead() {
    return this.health == 0;
  }

  isTopImgContourVisible() {
    return this.y < 480;
  }

  animationInterval_Part_Check_MakeMovement_Id;
  animationInverval_Part_ChecK_ChangingImg_Id;

  animationInterval_Part_MakeMovement_IsOver = false;
  animationInverval_Part_ChangingImg_IsOver = false;

  /**
   * Animates a motion of movable object changning its position and current played images every time interval.
   * @param {number} [movementFrameRate=60] - The movement frame rate
   * @param {number} [imgChangeFrameRate=20] - The image change frame rate
   */
  animate(movementFrameRate = 60, imgChangeFrameRate = 20) {
    // Calculate time intervals for movement and changing images
    let movementTimeout = 1000 / movementFrameRate;
    let imgChangeTimeout = 1000 / imgChangeFrameRate;
    this.checkIf_Check_MakeMovement_Invervall_Exist_AndSetIt(movementTimeout);
    this.checkIf_Check_SetImages_Interval_Exist_AndSetIt(imgChangeTimeout);
    this.checkInLoopIfBothAnimationPartInvervalAreOver();
  }

  checkMakeMovement() {}
  checkSetImages() {}

  // CHANGING POSITION OF MOVABLE OBJECT
  checkIf_Check_MakeMovement_Invervall_Exist_AndSetIt(movementTimeout) {
    // Check if `check_MakeMovement_Interval_Handler` is not undefined before setting interval
    if (typeof this.check_MakeMovement_Interval_Handler !== 'undefined') {
      // Yes, set animation part interval and save its id to 'animationInterval_Part_MakeMovement_Id'.
      this.animationInterval_Part_Check_MakeMovement_Id = setStoppableInterval(() => {
        /**
         * Check if the dead animation part interval = the last possible animation part interval, is not over, for the
         * part 'Check_MakeMovement'.
         */
        if (!this.deadAnimation_Part_MakeMovement_IsOver) {
          // Execute the animation part interval handler for part 'Check_MakeMovement'.
          this.check_MakeMovement_Interval_Handler();
        } else {
          // Clear the animation part interval for part 'Check_MakeMovement'.
          clearInterval(this.animationInterval_Part_Check_MakeMovement_Id);
          // Set the storage that animation part interval for part 'Check_MakeMovement' is over.
          this.animationInterval_Part_MakeMovement_IsOver = true;
        }
      }, movementTimeout);
    }
  }

  // CHANGING IMAGE OF MOVABLE OBJECT
  checkIf_Check_SetImages_Interval_Exist_AndSetIt(imgChangeTimeout) {
    // Check if `check_SetImages_Interval_Handler` is not undefined before setting interval
    if (typeof this.check_SetImages_Interval_Handler !== 'undefined') {
      // Yes, set animation part interval and save its id to 'animationInverval_Part_ChecK_ChangingImg_Id'.
      this.animationInverval_Part_ChecK_ChangingImg_Id = setStoppableInterval(() => {
        /**
         * Check if the dead animation part interval = the last possible animation part interval, is not over, for the
         * part 'Check_SetImages'.
         */
        if (!this.deadAnimation_Part_SetLastImg_IsOver) {
          // Execute the animation part interval handler for part 'Check_SetImages'.
          this.check_SetImages_Interval_Handler();
        } else {
          // Clear the animation part interval for part 'Check_SetImages'.
          clearInterval(this.animationInverval_Part_ChecK_ChangingImg_Id);
          // Set the storage that animation part interval for part 'Check_SetImages' is over.
          this.animationInverval_Part_ChangingImg_IsOver = true;
        }
      }, imgChangeTimeout);
    }
  }

  checkInLoopIfBothAnimationPartInvervalAreOver() {
    if (
      typeof this.check_MakeMovement_Interval_Handler !== 'undefined' &&
      typeof this.check_SetImages_Interval_Handler !== 'undefined'
    ) {
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

  changeImagesSetAndCurrentImg(newCurrentImagesSet) {
    if (this.currentImagesSet !== newCurrentImagesSet) {
      this.currentImagesSet = newCurrentImagesSet;
      this.currentImgIdx = 0;
    } else {
      this.currentImgIdx = this.currentImgIdx % this.currentImagesSet.length;
    }
    /**
     * Walk animation.
     *
     * Modulo function returns ONLY the rest of the devision.
     * On the example of character with 6 images, possible return values: 6, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5, 0, 1, ...
     * let i = 0 % 6 => 0, Rest 0    let i = 1 % 6 => 0, Rest 1     let i = 2 % 6 => 0, Rest 2
     * let i = 6 % 6 => 1, Rest 0    let i = 7 % 6 => 1, Rest 1     let i = 8 % 6 => 1, Rest 2  ...
     * In this way 'i' can again be 0 after beeing equal to the given array lenght minus (here 6 - 1 = 5) one before it.
     * --> Continously incrementation of the counter oscilating between first and last index of the given array (here 0 and 5)..
     * Assign new value for i equal to the modulo function below in this interval.
     */

    // Assign the current path from given 'images' array according to the 'i'.
    let path = this.currentImagesSet[this.currentImgIdx];
    // Assign new image object from 'imageCache' accroding the current iterated 'path' as the key.
    this.img = this.imageCache[path];
    // Increase the iteration counter by one.
    if (this.currentImgIdx == this.currentImagesSet.length - 1) {
      if (!this.isDead()) this.currentImgIdx = 0;
      else this.deadAnimation_Part_SetLastImg_IsOver = true;
    } else this.currentImgIdx++;
  }

  moveRight() {
    // if (this.x < this.level.end_x - this.width) this.x += this.speedX;
    // this.x += this.speedX;
    if (this.canTurnAround) {
      if (this.x + this.width < this.level.end_x) this.x += this.speedX;
      else this.otherDirection = !this.otherDirection;
    } else this.x += this.speedX;
  }

  /**
   * Moves the the movable object to the left.
   */
  moveLeft() {
    if (this.canTurnAround) {
      if (this.x > this.level.start_x) this.x -= this.speedX;
      else this.otherDirection = !this.otherDirection;
    } else this.x -= this.speedX;

    // this.x -= this.speedX;

    // this.x -= this.speedX;
  }

  jump(speedY) {
    this.speedY = speedY;
  }

  moveAsDead() {
    if (this.isPreparedToMoveAsDead()) this.startMoveAsDead();
    else if (this.isMovingDead()) this.moveInXDirection();
    else this.deadAnimation_Part_MakeMovement_IsOver = true;
  }

  isPreparedToMoveAsDead() {
    return !this.isMoveAsDeadStarted;
  }

  startMoveAsDead() {
    // No, set the state that character started to move as dead.
    this.isMoveAsDeadStarted = true;
    console.log('in in');
    // Set the horizontal and vertical speed for 'jump / falling down right' as dead.
    this.setDirectionAsPerCanvasCenter();
    this.speedX = 5;
    this.jump(15);
    this.moveInXDirection();
  }

  isMovingDead() {
    return this.isTopImgContourVisible();
  }

  setDirectionAsPerCanvasCenter() {
    if (this.checkIfOnLeftOrRightCanvasHalf()) this.otherDirection = false;
    else this.otherDirection = true;
  }

  checkIfOnLeftOrRightCanvasHalf() {
    let xCanvasCenter = -this.world.camera_x + this.world.canvas.width / 2;
    let xMOCenter = this.x + this.width / 2;
    return xMOCenter > xCanvasCenter;
  }

  moveInXDirection() {
    if (this.otherDirection == true) this.moveRight();
    else this.moveLeft();
    if (this instanceof Character) this.otherDirection = !this.otherDirection;
  }
}

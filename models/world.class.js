class World {
  // Current set level (with its settings) for the game world.
  level = level1;

  canvas;

  // Tool box / framework to present things ('context') on canvas.
  ctx;

  drawingForbidden = false;

  /**
   * Amount by which the image is moved during the character run.
   * --> The x-coordinate by which the canvas context will be translated bevor / after adding the objects to itself.
   * "The x-coordinate where the canvas BEGINS / ENDS to draw (place) objetcs."
   */
  camera_x_shift;
  camera_x_min;
  camera_x;
  camera_x_max;

  // Current degrees by which the image has already been rotated in the canvas.
  rotatedDegrees = 0;

  endbossDead = false;

  // Assigned keyboard instance.
  keyboard;

  constructor(canvas, keyboard) {
    // Get the context (which should be presented on) for the canvas.
    this.ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.setCharacter();
    this.setEndboss();
    this.setStatusBars();
    this.setCameraX();
  }

  setCharacter() {
    this.character = new Character();
  }

  setEndboss() {
    this.endboss = this.getEndbossObjFromLevelEnemyArray();
  }

  getEndbossObjFromLevelEnemyArray() {
    let endbossObjFromLevelEnemyArray = this.level.enemies.find((x) => x instanceof Endboss);
    return endbossObjFromLevelEnemyArray;
  }

  setStatusBars() {
    this.healthBar = new StatusBar(30, 0, IMAGES_PATHS_BAR_HEALTH, 100);
    this.bootlesBar = new StatusBar(30, 50, IMAGES_PATHS_BAR_BOTTLES, 0);
    this.coinsBar = new StatusBar(30, 100, IMAGES_PATHS_BAR_COINS, 0);
    this.endbossBar = new StatusBar(730, 0, IMAGES_PATHS_BAR_ENDBOSS, 100);
  }

  setCameraX() {
    this.camera_x_shift = 0;
    this.camera_x_shift = 150;
    this.camera_x_min = this.level.start_x;
    this.camera_x = -this.character.x + this.camera_x_shift;
    this.camera_x_max = this.level.end_x - this.canvas.width;
  }

  setWorld() {
    this.character.world = worldSingletonInstance;
    this.character.level = worldSingletonInstance.level;
    this.endboss.world = worldSingletonInstance;
  }

  run() {
    this.setWorld();
    this.applyGravityForAllGameCharacters();
    this.startAnimationsForAllGameCharacters();
    this.draw();
    setStoppableInterval(() => {
      if (!this.isCharacterOrEndbossRemoved()) {
        this.checkCharacterDeath();
        this.checkEndbossDeath();
        this.checkCollisions();
        this.checkRemovals();
      } else this.stopRun();
    }, 50);
  }

  applyGravityForAllGameCharacters() {
    this.character.applyGravity();
    this.applyGravityForJumpableLevelMovingObjects(this.level.enemies);
    this.applyGravityForJumpableLevelMovingObjects(this.level.coins);
  }

  applyGravityForJumpableLevelMovingObjects(levelPropertyArray) {
    levelPropertyArray.forEach((mo) => {
      if (mo instanceof ChickenSmall || mo instanceof Endboss) mo.applyGravity();
    });
  }

  startAnimationsForAllGameCharacters() {
    this.character.animate();
    this.startAnimationsForLevelMovingObjects(this.level.coins, undefined, 3);
    this.startAnimationsForLevelMovingObjects(this.level.enemies);
  }

  startAnimationsForLevelMovingObjects(levelPropertyArray, movementFrameRate, imgChangeFrameRate) {
    levelPropertyArray.forEach((mo) => mo.animate(movementFrameRate, imgChangeFrameRate));
  }

  draw() {
    if (!pause) {
      // Clears canvas before new drawing.
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Move the whole canvas context by camera_x amount to left before placing the objects.
      this.ctx.translate(this.camera_x, 0);

      /**
       * Um die Variablen explizit aus dieser Klasse zu verwenden, muss mit 'this' darauf zugegriffen werden,
       * genauso wie beim Zugriff explizit auf Klassen Funktionen.
       *
       * The objects are layered on top of each other on the canvas in this order.
       */
      this.addObjectsToMap(this.level.backgroundObjects);
      this.addObjectsToMap(this.level.clouds);
      /**
       * In order for the status bars (as a non-movable / fixed object) to be displayed parallel to the current
       * position of the character, the canvas context must first be moved by camera_x before it is displayed.
       * Then the canvas context has to be moved back bycamera_x in order to set the movable objects correctly, moved
       * according to the character's run.
       */
      this.ctx.translate(-this.camera_x, 0); // Back
      // ------ Space for fixed objects ------
      this.addToMap(this.healthBar);
      this.addToMap(this.bootlesBar);
      this.addToMap(this.coinsBar);
      this.addToMap(this.endbossBar);
      this.ctx.translate(this.camera_x, 0); // Forwards

      this.addObjectsToMap(this.level.enemies);
      this.addToMap(this.character);

      this.addObjectsToMap(this.level.coins);
      this.addObjectsToMap(this.level.bottlesInGround);
      this.addObjectsToMap(this.level.bottlesInFlight);

      // Move the whole canvas context back to the right by camera_x amount after placing the objects.
      this.ctx.translate(-this.camera_x, 0);
    }

    /**
     * Hack: 'this' is not recognized in requestAnimationFrame() function.
     * Therefore a variable 'self' containing 'this' is needed, used.
     */
    let self = this;
    // Draw() wird immer wieder aufgerufen (25 fps, 30 pfs etc. --> je nach Graphikkarte)
    /**
     * Updates an animation in the browser before the next repaint.
     * @param {FrameRequestCallback} callback - The draw() function itself as a callback function
     * to animate another frame at the next repaint. requestAnimationFrame() is 1 shot.
     */

    requestAnimationFrame(() => {
      /**
       * Hack: 'this' is not recognized here.
       * Therefore a variable 'self' containing 'this' is needed, used.
       */
      if (!worldSingletonInstance.drawingForbidden) {
        self.updateCameraX();
        self.draw();
      }
      // console.log('DRWAN');
    });
  }

  /**
   * Adds an array of objects to the map (canvas).
   * @param {Array} objects - An array of objects to add to the map.
   * @param {Boolean} [inclImgFrame=false] - This turns on / off the frame around the the object added to the map (canvas).
   * @param {Boolean} [inclImgOffsetFrame=false] - This turns on / off the offset frame around the the object added to the map (canvas).
   */
  addObjectsToMap(objects, inclImgFrame = false, inclImgOffsetFrame = false) {
    objects.forEach((object) => this.addToMap(object, inclImgFrame, inclImgOffsetFrame));
  }

  /**
   * Adds the object to the map (canvas).
   * @param {Object} mo - The movable object.
   * @param {Boolean} [inclImgFrame=false] - This turns on / off the frame around the the object added to the map (canvas).
   * @param {Boolean} [inclImgOffsetFrame=false] - This turns on / off the offset frame around the the object added to the map (canvas).
   */
  addToMap(mo, inclImgFrame = false, inclImgOffsetFrame = false) {
    if (mo != undefined && mo != null) {
      // Check if the movable object has other direction. If yes, flip the movable object image.
      if (mo.otherDirection) this.flipImage(mo);

      if ((mo instanceof Character && mo.health == 0) || (mo instanceof Endboss && mo.health == 0)) {
        this.rotateImage(mo);
      }

      // Pasting the image to the canvas with the settings from before.
      mo.draw(this.ctx);

      // Draw rectangle around object to analyse collisions.
      if (inclImgFrame) mo.drawFrame(this.ctx);

      // Draw rectangle around object reduced by its offset distances to analyse collisions.
      if (inclImgOffsetFrame) mo.draw_Offset_Frame(this.ctx);

      // Check if the image has beed already mirroed (equal to the check if the movable object has other direction). If yes, flip the movable object image back.
      if (mo.otherDirection) this.flipImageBack(mo);

      if ((mo instanceof Character && mo.health == 0) || (mo instanceof Endboss && mo.health == 0)) {
        this.rotateImageBack();
      }
    }
  }

  /**
   * Flips the movable object image.
   * @param {MovableObject} mo - The movable object image, that should be fliped.
   */
  flipImage(mo) {
    /**
     * Save the current canvas context settings (all properties of the context object before changing them)
     * in order to paste images later according the same settings / logic.
     */
    this.ctx.save();
    /**
     * Changing the way the image will be pasted in the canvas / Changing the canvas context.
     * First move the image by its width ONLY in x-direction to avoid a 'movement jump' after the rotation.
     */
    this.ctx.translate(mo.width, 0);
    /**
     * Mirror the image vertically / Rotating the image around the y-axis (around 180 degrees).
     * From here on, the images are inserted mirrored in the context.
     * The image is moved by its width after the mirroring / rotation. Therefore is has to be moved by its width before.
     */
    this.ctx.scale(-1, 1); // --> After the rotation is the x-coordinate to the right side.
    // Get the x-coordinate back to the left side. / Mirror the x-coordinate.
    mo.x = mo.x * -1;
  }

  /**
   * Flips the movable object image back.
   * @param {MovableObject} mo - The movable object image, that should be fliped back.
   */
  flipImageBack(mo) {
    /**
     * Reset (restore) the canvas settings from before (to the previous saved canvas context settings for pasting images not mirrored),
     * so that the another images like f.e. backgrouds, coins, cact etc. will not be pasted mirrored.
     * Changing the x-coordinate to the left side again is requied for pasting and positioning another not mirred images in right way /
     * Mirroring the x-coordinate.
     */
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  rotateImage(mo) {
    // Save the unrotated context of the canvas.
    this.ctx.save();
    // Set the pivot point in the centre of the effective image taking into account the offset distances.
    let moImgWidthMinusOffset = mo.width - mo.offset.left - mo.offset.right;
    let moImgHeightMinusOffset = mo.height - mo.offset.top - mo.offset.bottom;
    let moImgCenterX = mo.x + mo.offset.left + moImgWidthMinusOffset / 2;
    let moImgCenterY = mo.y + mo.offset.top + moImgHeightMinusOffset / 2;
    // Check if rotatedDegrees is greater or equal to 360 degrees. Yes set it to 0 degrees.
    if (this.rotatedDegrees >= 360) this.rotatedDegrees = 0;
    // Incrementate 'rotatedDegrees' by 10 degrees.
    this.rotatedDegrees += 10;
    // Move the canvas to the center of the moving object. Matrix transformation
    this.ctx.translate(moImgCenterX, moImgCenterY);
    // Rotate the canvas by 'rotatedDegrees'.
    this.ctx.rotate((Math.PI / 180) * this.rotatedDegrees);
    // Move the canvas back to the position before moving to the center of the moving object image. Matrix tranformation.
    this.ctx.translate(-moImgCenterX, -moImgCenterY);
  }

  rotateImageBack() {
    // Restore the unrotated context
    this.ctx.restore();
  }

  updateCameraX() {
    if (this.character) {
      if (this.character.x >= this.camera_x_max + this.camera_x_shift) this.camera_x = -this.camera_x_max;
      else if (this.character.x <= this.camera_x_min + this.camera_x_shift) this.camera_x = -this.camera_x_min;
      else this.camera_x = -this.character.x + this.camera_x_shift;
    }
  }

  /**
   * Gets if the character or endboss is removed.
   */
  isCharacterOrEndbossRemoved() {
    // Prepare the local variable for endboss, if it still exists, and store it under the variable.
    return !this.character || !this.endboss;
  }

  checkCharacterDeath() {
    if (this.character.isDead()) hideControllerButtons();
  }

  checkEndbossDeath() {
    if (!this.endbossDead) {
      if (this.endboss.isDead()) {
        this.endbossDead = true;
        this.character.movementPossible = false;
        hideControllerButtons();
        this.killAllEnemiesExceptEndboss();
      }
    }
  }

  killAllEnemiesExceptEndboss() {
    let array = this.level.enemies;
    array.forEach((enemy) => {
      if (!(enemy instanceof Endboss)) enemy.health = 0;
    });
  }

  checkCollisions() {
    this.checkIf_Character_IsColliding(
      'enemies',
      'isCollidingOrPressingInJumpFallingDown',
      'healthBar',
      'healthPercentage'
    );
    this.checkIf_Character_IsColliding('coins', 'takeCoin', 'coinsBar', 'coinsPercentage');
    this.checkIf_Character_IsColliding('bottlesInGround', 'takeBottle', 'bootlesBar', 'bottlesPercentage');
    this.checkIf_BottleInLFlight_IsColliding();
  }

  checkIf_Character_IsColliding(levelArrayProperty, fnToExeAfterCollision, statusBarToSet, characterPropertyToSet) {
    let array = this.level[levelArrayProperty];
    array.forEach((element) => {
      if (this.character.isColliding(element)) {
        this.character[fnToExeAfterCollision](element);
        this[statusBarToSet].setPercentage(this.character[characterPropertyToSet]);
        return;
      }
    });
  }

  checkIf_BottleInLFlight_IsColliding() {
    let arrayBottlesInFlight = this.level.bottlesInFlight;
    let arrayLevelEnemies = this.level.enemies;
    for (let i = 0; i < arrayBottlesInFlight.length; i++) {
      const bottle = arrayBottlesInFlight[i];
      //
      if (!bottle.isDead()) {
        for (let j = 0; j < arrayLevelEnemies.length; j++) {
          const collisionEnemy = arrayLevelEnemies[j];
          if (bottle.isColliding(collisionEnemy)) {
            bottle.hit();
            if (!collisionEnemy.isHurt()) collisionEnemy.hit();
            if (collisionEnemy instanceof Endboss) this.endbossBar.setPercentage(collisionEnemy.healthPercentage);
            break;
          } else if (bottle.isOnGroundAfterFlight()) {
            bottle.hit();
            break;
          }
        }
      }
    }
  }

  checkRemovals() {
    this.checkIf_ObjectsFromLevel_CanBeRemoved_And_RemoveThem(this.level.enemies);
    this.checkIf_ObjectsFromLevel_CanBeRemoved_And_RemoveThem(this.level.bottlesInFlight);
    this.checkIf_Character_CanBeRemoved_And_RemoveHim();
    this.checkIf_Endboss_CanBeRemoved_And_RemoveHim();
  }

  checkIf_ObjectsFromLevel_CanBeRemoved_And_RemoveThem(array) {
    array.forEach((obj) => {
      if (obj.canBeRemoved) this.removeFromLevel(obj, array);
    });
  }

  checkIf_Character_CanBeRemoved_And_RemoveHim() {
    // Check if character can be removed from the world and remove it if yes.
    if (this.character.canBeRemoved) this.removeCharacter();
  }

  checkIf_Endboss_CanBeRemoved_And_RemoveHim() {
    // Check if character can be removed from the world and remove it if yes.
    if (this.endboss.canBeRemoved) this.removeEndboss();
  }

  removeFromLevel(objToRemove, arrOfObj) {
    let index = arrOfObj.indexOf(objToRemove);
    if (index !== -1) arrOfObj.splice(index, 1);
  }

  removeCharacter() {
    this.character = null;
  }

  removeEndboss() {
    this.endboss = null;
  }

  stopRun() {
    playSoundsAtGameOver();
    this.stopDrawing();
    clearAllStoppableIntervals();
    if (this.endboss) setScreenBtnsAsPerGameState('loss');
    else setScreenBtnsAsPerGameState('win');
  }

  stopDrawing() {
    this.drawingForbidden = true;
  }
}

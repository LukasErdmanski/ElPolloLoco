/**
 * @class
 * Class representing the game world.
 */
class World {
  /**
   * Current set level (with its settings) for the game world.
   * @type {Object}
   */
  level = level1;

  /**
   * The canvas element on which the game is displayed.
   * @type {HTMLCanvasElement}
   */
  canvas;

  /**
   * Tool box / framework to present things ('context') on canvas.
   * @type {CanvasRenderingContext2D}
   */
  ctx;

  /**
   * Indicates whether drawing on the canvas is currently forbidden.
   * @type {boolean}
   */
  drawingForbidden = false;

  /**
   * Amount by which the image is moved during the character run.
   * @type {number}
   */
  camera_x_shift;

  /**
   * Minimal value of camera_x.
   * @type {number}
   */
  camera_x_min;

  /**
   * Current value of camera_x.
   * Amount by which the image is moved during the character run.
   * --> The x-coordinate by which the canvas context will be translated bevor / after adding the objects to itself.
   * "The x-coordinate where the canvas BEGINS / ENDS to draw (place) objetcs."
   * @type {number}
   */
  camera_x;

  /**
   * Maximal value of camera_x.
   * @type {number}
   */
  camera_x_max;

  /**
   * Current degrees by which the image has already been rotated in the canvas.
   * @type {number}
   */
  rotatedDegrees = 0;

  /**
   * Indicates whether the endboss has been defeated.
   * @type {boolean}
   */
  endbossDead = false;

  /**
   * Assigned keyboard instance.
   * @type {Keyboard}
   */
  keyboard;

  /**
   * Creates a new World instance.
   * @constructor
   * @param {HTMLCanvasElement} canvas - The canvas element on which the game is displayed.
   * @param {Keyboard} keyboard - The keyboard instance to use for user input.
   */
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

  /**
   * Creates a new character instance and assigns it to the `character` property.
   */
  setCharacter() {
    this.character = new Character();
  }

  /**
   * Sets the endboss instance based on the `level` property.
   */
  setEndboss() {
    this.endboss = this.getEndbossObjFromLevelEnemyArray();
  }

  /**
   * Returns the endboss object from the `enemies` array of the current level.
   * @returns {Endboss} - The endboss object.
   */
  getEndbossObjFromLevelEnemyArray() {
    let endbossObjFromLevelEnemyArray = this.level.enemies.find((x) => x instanceof Endboss);
    return endbossObjFromLevelEnemyArray;
  }

  /**
   * Creates new status bars for health, bottles and coins and assigns them to the corresponding properties.
   */
  setStatusBars() {
    this.healthBar = new StatusBar(30, 0, IMAGES_PATHS_BAR_HEALTH, 100);
    this.bootlesBar = new StatusBar(30, 50, IMAGES_PATHS_BAR_BOTTLES, 0);
    this.coinsBar = new StatusBar(30, 100, IMAGES_PATHS_BAR_COINS, 0);
    this.endbossBar = new StatusBar(730, 0, IMAGES_PATHS_BAR_ENDBOSS, 100);
  }

  /**
   * Sets the camera_x related properties based on the current level and character position.
   */
  setCameraX() {
    this.camera_x_shift = 0;
    this.camera_x_shift = 150;
    this.camera_x_min = this.level.start_x;
    this.camera_x = -this.character.x + this.camera_x_shift;
    this.camera_x_max = this.level.end_x - this.canvas.width;
  }

  /**
   * Sets the world property for character and endboss objects.
   * Also sets the level property for the character object.
   */
  setWorld() {
    this.character.world = worldSingletonInstance;
    this.character.level = worldSingletonInstance.level;
    this.endboss.world = worldSingletonInstance;
  }

  /**
   * Main loop that runs the game. It sets the world, applies gravity to all game characters,
   * starts animations for all game characters, draws the world, and checks for various conditions
   * such as character or endboss deaths, collisions, and removals.
   */
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

  /**
   * Applies gravity to all game characters.
   * Calls applyGravity() on the character, and applyGravityForJumpableLevelMovingObjects()
   * on enemies and coins arrays.
   */
  applyGravityForAllGameCharacters() {
    this.character.applyGravity();
    this.applyGravityForJumpableLevelMovingObjects(this.level.enemies);
    this.applyGravityForJumpableLevelMovingObjects(this.level.coins);
  }

  /**
   * Applies gravity to jumpable level moving objects within a specified array.
   * @param {Array} levelPropertyArray - An array of level moving objects.
   */
  applyGravityForJumpableLevelMovingObjects(levelPropertyArray) {
    levelPropertyArray.forEach((mo) => {
      if (mo instanceof ChickenSmall || mo instanceof Endboss) mo.applyGravity();
    });
  }

  /**
   * Starts animations for all game characters.
   * Calls animate() on the character, and startAnimationsForLevelMovingObjects()
   * on enemies and coins arrays.
   */
  startAnimationsForAllGameCharacters() {
    this.character.animate();
    this.startAnimationsForLevelMovingObjects(this.level.coins, undefined, 3);
    this.startAnimationsForLevelMovingObjects(this.level.enemies);
  }

  /**
   * Starts animations for level moving objects within a specified array.
   * @param {Array} levelPropertyArray - An array of level moving objects.
   * @param {Number} [movementFrameRate] - Frame rate for movement animation.
   * @param {Number} [imgChangeFrameRate] - Frame rate for image change animation.
   */
  startAnimationsForLevelMovingObjects(levelPropertyArray, movementFrameRate, imgChangeFrameRate) {
    levelPropertyArray.forEach((mo) => mo.animate(movementFrameRate, imgChangeFrameRate));
  }

  /**
   * Draws the game world by calling addAllObjectToMap() unless the game is paused.
   * Continuously calls itself through requestAnimationFrame() to update the world.
   */
  draw() {
    if (!pause) this.addAllObjectToMap();
    /**
     * Hack: 'this' is not recognized in requestAnimationFrame() function.
     * Therefore a variable 'self' containing 'this' is needed, used.
     */
    let self = this;
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
    });
  }

  /**
   * Adds all objects to the map (canvas) by first clearing the canvas and then translating
   * the canvas context according to camera_x before adding fixed and movable objects.
   */
  addAllObjectToMap() {
    // Clears canvas before new drawing.
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // Move the whole canvas context by camera_x amount to left before placing the objects.
    this.ctx.translate(this.camera_x, 0);
    this.addAllFixedObjetsToMap();
    this.addAllMovableObjetsToMap();
    // Move the whole canvas context back to the right by camera_x amount after placing the objects.
    this.ctx.translate(-this.camera_x, 0);
  }

  /**
   * Adds all fixed objects to the map (canvas) by first translating the canvas context back
   * by camera_x, then adding objects like healthBar, bootlesBar, coinsBar, and endbossBar,
   * and finally translating the canvas context forward by camera_x.
   */
  addAllFixedObjetsToMap() {
    // The objects are layered on top of each other on the canvas in this order.
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    /**
     * In order for the status bars (as a non-movable / fixed object) to be displayed parallel to the current
     * position of the character, the canvas context must first be moved by camera_x before it is displayed.
     * Then the canvas context has to be moved back by camera_x in order to set the movable objects correctly, moved
     * according to the character's run.
     */
    this.ctx.translate(-this.camera_x, 0); // Back
    //#region ================== Space for fixed objects (between translating operations) ===================
    this.addToMap(this.healthBar);
    this.addToMap(this.bootlesBar);
    this.addToMap(this.coinsBar);
    this.addToMap(this.endbossBar);
    //#endregion =============== Space for fixed objects (between translating operations) ===================
    this.ctx.translate(this.camera_x, 0); // Forwards
  }

  /**
   * Adds all movable objects to the map (canvas) by adding objects from various arrays
   * such as enemies, coins, bottlesInGround, and bottlesInFlight.
   */
  addAllMovableObjetsToMap() {
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottlesInGround);
    this.addObjectsToMap(this.level.bottlesInFlight);
    this.addObjectsToMap(this.level.enemies);
    this.addToMap(this.character);
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
    // Check if the movable object is undefined or null.
    if (mo != undefined && mo != null) {
      // Check if the movable object has other direction. If yes, flip the movable object image.
      if (mo.otherDirection) this.flipImage(mo);
      // Check if the movable object can be rotated. If yes, rotate the movable object image.
      if (this.canBeRotated(mo)) this.rotateImage(mo);
      // Pasting the image to the canvas with the settings from before.
      mo.draw(this.ctx);
      // Draw rectangle around object to analyse collisions.
      if (inclImgFrame) mo.drawFrame(this.ctx);
      // Draw rectangle around object reduced by its offset distances to analyse collisions.
      if (inclImgOffsetFrame) mo.draw_Offset_Frame(this.ctx);
      // Check if the image has beed already mirroed (equal to the check if the movable object has other direction). If yes, flip the movable object image back.
      if (mo.otherDirection) this.flipImageBack(mo);
      // Check if the movable object can be rotated. If yes, rotate the movable object image back.
      if (this.canBeRotated(mo)) this.rotateImageBack();
    }
  }

  /**
   * Checks if a given movable object (mo) can be rotated based on its class and health.
   * Returns true if the object is an instance of Character or Endboss and has a health of 0.
   * @param {MovableObject} mo - The movable object to check for rotation eligibility.
   * @returns {Boolean} - Returns true if the object is eligible for rotation, otherwise false.
   */
  canBeRotated(mo) {
    return (mo instanceof Character && mo.health == 0) || (mo instanceof Endboss && mo.health == 0);
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

  /**
   * Rotates the image of a given movable object (mo) around its center point.
   * The rotation is based on the value of 'rotatedDegrees'.
   * @param {MovableObject} mo - The movable object whose image should be rotated.
   */
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

  /**
   * Rotates the image of a given movable object (mo) around its center point.
   * The rotation is based on the value of 'rotatedDegrees'.
   * @param {MovableObject} mo - The movable object whose image should be rotated.
   */
  rotateImageBack() {
    // Restore the unrotated context
    this.ctx.restore();
  }

  /**
   * Updates the camera's x position based on the character's x position.
   * Ensures the character stays within the specified camera bounds.
   */
  updateCameraX() {
    if (this.character) {
      if (this.character.x >= this.camera_x_max + this.camera_x_shift) this.camera_x = -this.camera_x_max;
      else if (this.character.x <= this.camera_x_min + this.camera_x_shift) this.camera_x = -this.camera_x_min;
      else this.camera_x = -this.character.x + this.camera_x_shift;
    }
  }

  /**
   * Checks if the character or the endboss have been removed from the game.
   *
   * @returns {boolean} True if the character or the endboss is not present, false otherwise.
   */
  isCharacterOrEndbossRemoved() {
    return !this.character || !this.endboss;
  }

  /**
   * Checks if the character is dead and hides controller buttons if they are.
   */
  checkCharacterDeath() {
    if (this.character.isDead()) hideControllerButtons();
  }

  /**
   * Checks if the endboss is dead, if so, sets 'endbossDead' to true,
   * disables character movement, hides controller buttons, and kills
   * all enemies except the endboss.
   */
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

  /**
   * Sets the health of all enemies except the endboss to 0 (dead).
   */
  killAllEnemiesExceptEndboss() {
    let array = this.level.enemies;
    array.forEach((enemy) => {
      if (!(enemy instanceof Endboss)) enemy.health = 0;
    });
  }

  /**
   * Checks collisions between the character and various game objects
   * such as enemies, coins, and bottles.
   */
  checkCollisions() {
    this.checkIf_Character_IsColliding(
      'enemies',
      'isCollidingOrPressingInJumpFallingDown',
      'healthBar',
      'healthPercentage'
    );
    this.checkIf_Character_IsColliding('coins', 'takeCoin', 'coinsBar', 'coinsPercentage');
    this.checkIf_Character_IsColliding('bottlesInGround', 'takeBottle', 'bootlesBar', 'bottlesPercentage');
    this.checkIf_All_BottlesInLFlight_IsColliding();
  }

  /**
   * Checks if the character is colliding with game objects in the specified level array property.
   * Executes a function after the collision and sets the percentage of the specified status bar.
   * @param {string} levelArrayProperty - Property name of the level array to check for collisions.
   * @param {string} fnToExeAfterCollision - Function name to execute after the collision.
   * @param {string} statusBarToSet - Property name of the status bar to set the percentage.
   * @param {string} characterPropertyToSet - Property name of the character to set the percentage.
   */
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

  /**
   * Checks if all bottles in flight are colliding with enemies in the level.
   */
  checkIf_All_BottlesInLFlight_IsColliding() {
    let arrayBottlesInFlight = this.level.bottlesInFlight;
    let arrayLevelEnemies = this.level.enemies;
    for (let i = 0; i < arrayBottlesInFlight.length; i++) {
      const bottle = arrayBottlesInFlight[i];
      if (!bottle.isDead()) {
        for (let j = 0; j < arrayLevelEnemies.length; j++) {
          const collisionEnemy = arrayLevelEnemies[j];
          this.checkIf_Bottle_InLFlight_IsColliding(bottle, collisionEnemy);
        }
      }
    }
  }

  /**
   * Checks if a bottle in flight is colliding with a specified enemy.
   * If so, calls the hit() method for both the bottle and the enemy.
   * If the enemy is an Endboss, updates the endboss health bar.
   * @param {object} bottle - The bottle object in flight.
   * @param {object} collisionEnemy - The enemy object to check for collision.
   */
  checkIf_Bottle_InLFlight_IsColliding(bottle, collisionEnemy) {
    if (bottle.isColliding(collisionEnemy)) {
      bottle.hit();
      if (!collisionEnemy.isHurt()) collisionEnemy.hit();
      if (collisionEnemy instanceof Endboss) this.endbossBar.setPercentage(collisionEnemy.healthPercentage);
    } else if (bottle.isOnGroundAfterFlight()) {
      bottle.hit();
    }
  }

  /**
   * Checks if objects in the game (enemies, bottles in flight, character, and endboss)
   * can be removed and removes them if necessary.
   */
  checkRemovals() {
    this.checkIf_ObjectsFromLevel_CanBeRemoved_And_RemoveThem(this.level.enemies);
    this.checkIf_ObjectsFromLevel_CanBeRemoved_And_RemoveThem(this.level.bottlesInFlight);
    this.checkIf_Character_CanBeRemoved_And_RemoveHim();
    this.checkIf_Endboss_CanBeRemoved_And_RemoveHim();
  }

  /**
   * Checks if objects in the given array can be removed and removes them if necessary.
   * @param {Array} levelObjectsArray - The array of objects to check for removal.
   */
  checkIf_ObjectsFromLevel_CanBeRemoved_And_RemoveThem(levelObjectsArray) {
    levelObjectsArray.forEach((obj) => {
      if (obj.canBeRemoved) this.removeFromLevel(obj, levelObjectsArray);
    });
  }

  /**
   * Checks if the character can be removed from the game and removes it if necessary.
   */
  checkIf_Character_CanBeRemoved_And_RemoveHim() {
    if (this.character.canBeRemoved) this.removeCharacter();
  }

  /**
   * Checks if the endboss can be removed from the game and removes it if necessary.
   */
  checkIf_Endboss_CanBeRemoved_And_RemoveHim() {
    if (this.endboss.canBeRemoved) this.removeEndboss();
  }

  /**
   * Removes the specified object from the given array.
   *
   * @param {object} objToRemove - The object to be removed.
   * @param {Array} arrOfObj - The array from which the object should be removed.
   */
  removeFromLevel(objToRemove, arrOfObj) {
    let index = arrOfObj.indexOf(objToRemove);
    if (index !== -1) arrOfObj.splice(index, 1);
  }

  /**
   * Removes the character from the game by setting it to null.
   */
  removeCharacter() {
    this.character = null;
  }

  /**
   * Removes the endboss from the game by setting it to null.
   */
  removeEndboss() {
    this.endboss = null;
  }

  /**
   * Stops the game run, plays game over sounds, stops drawing, clears all stoppable intervals,
   * and updates the screen buttons based on the game state (win or loss).
   */
  stopRun() {
    playSoundsAtGameOver();
    this.stopDrawing();
    clearAllStoppableIntervals();
    if (this.endboss) setScreenBtnsAsPerGameState('loss');
    else setScreenBtnsAsPerGameState('win');
  }

  /**
   * Stops the drawing of game objects by setting the 'drawingForbidden' property to true.
   */
  stopDrawing() {
    this.drawingForbidden = true;
  }
}
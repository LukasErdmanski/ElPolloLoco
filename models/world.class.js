class World {
  // In der Klasse wird kein let, const, var für die Deklaration, Initialisierung ähnlich wie bei Fuktionen verwendet.
  character = new Character();

  // Current set level (with its settings) for the game world.
  level = level1;
  canvas;
  // Tool box / framework to present things ('context') on canvas.
  ctx;
  stopDrawing = false;
  // Assigned keyboard instance.
  keyboard;
  /**
   * Amount by which the image is moved during the character run.
   * --> The x-coordinate by which the canvas context will be translated bevor / after adding the objects to itself.
   * "The x-coordinate where the canvas BEGINS / ENDS to draw (place) objetcs."
   */

  camera_x_shift;

  camera_x_min;
  camera_x;
  camera_x_max;

  // Initialize status bars of character's health, bottles, coins and endboss' health.
  healthBar = new StatusBar(30, 0, IMAGES_PATHS_BAR_HEALTH, 100);
  bootlesBar = new StatusBar(30, 50, IMAGES_PATHS_BAR_BOTTLES, 0);
  coinsBar = new StatusBar(30, 100, IMAGES_PATHS_BAR_COINS, 0);
  endbossBar = new StatusBar(730, 0, IMAGES_PATHS_BAR_ENDBOSS, 100);
  // Array of the throwable objects in the world.
  throwableObjects = [];
  // Status if character or endboss is dead in the world.
  characterOrEndboosDead = false;
  // Current degrees by which the image has already been rotated in the canvas.
  rotatedDegrees = 0;

  constructor(canvas, keyboard) {
    // Get the context (which should be presented on) for the canvas.
    this.ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.keyboard = keyboard;

    this.camera_x_shift = 0;
    this.camera_x_shift = 150;

    this.camera_x_min = this.level.start_x;

    this.camera_x = -this.character.x + this.camera_x_shift;

    this.camera_x_max = this.level.end_x - canvas.width;

    /**
     * Um die Funktion explizit aus dieser Klasse zu verwenden, muss mit 'this' darauf zugegriffen werden,
     * genauso wie beim Zugriff explizit auf Klassen Variablen.
     */
    this.draw();

    // Execute a group of functions checking certain events in the world all the time.
    // this.run();
  }

  /**
   * Sets the reference of the movable object to the instance of the world class
   * (by assinging the movable objects property named 'world' to 'this' (= the instance of THIS class)).
   * In this way movable object knows/has access to the variable, methods of the instance of 'world' class like f.e. keyboard.
   */
  setWorld() {
    // this.character.world = this;
    this.character.world = worldSingletonInstance;
    let endboss = this.getOnlyEndbossObjFromLevelEnemyArray();
    // endboss.world = this;
    endboss.world = worldSingletonInstance;

    this.character.level = worldSingletonInstance.level;

    // this.setWorldLevelToAllMovalbleObjectsInLevel();
  }

  /**
   * Loops over all properties of the world level and checks whether its values are instances of a 'MovableObject'
   * class. If the value is an array, the function checks each element of the array.
   */
  setWorldLevelToAllMovalbleObjectsInLevel() {
    // Loop over all properties of the object.
    for (let key in this.level) {
      // Check whether the value of the property is an array or not.
      // If it's an array, assign it to the variable propertyValue directly,
      // otherwise create a new array with the value as its only element.
      const propertyAsArray = Array.isArray(this.level[key]) ? this.level[key] : [this.level[key]];

      // Loop over all values in the array propertyValue.
      propertyAsArray.forEach((element) => {
        // Check whether the value is an instance of the class MovableObject.
        if (element instanceof MovableObject) {
          // If it is, assingn the world and level property to its properties with the same names.
          element.world = this;
          element.level = this.level;
        }
      });
    }
  }

  /**
   * Group of functions checking certain events in the world all the time.
   */

  runInterval;
  run() {
    this.setWorld();
    this.startAllAnimationsOfMovableObjects();
    setStoppableInterval(() => {
      /*   if (this.character.oneBottleCollected && this.character.bottles.length == 0) {
        debugger;
      } */
      ///TODO: ZUM LÖSCHEN / ZWISCHENLÖSUNG DAMIT DER CHARACTER NIE STIBRT WERDEN PROGRMAMIERUNG / TESTING / SPIEL ZU ENDE GEHT
      // world.character.health = 5;
      // console.log('WIEDER IM RUN INTERVALL');
      if (!this.isCharacterOrEndbossRemoved()) {
        this.checkCollisions();
        this.checkRemovals();
      } else this.stopRun();
    }, 50);
  }

  startAllAnimationsOfMovableObjects() {
    // let array = MovableObject.allMovableObjectsInstances;

    this.character.applyGravity();
    this.aaaa(this.level.clouds);
    this.aaaa(this.level.enemies);
    this.aaaa(this.level.coins);
    // this.aaaa(this.level.bottlesInGround);

    this.character.animate();
    this.bbbb(this.level.enemies);
    // this.bbbb(this.level.bottlesInGround);
  }

  aaaa(levelPropertyArray) {
    levelPropertyArray.forEach((mo) => {
      if (mo instanceof Character || mo instanceof ChickenSmall || mo instanceof Endboss) mo.applyGravity();
    });
  }

  bbbb(levelPropertyArray) {
    levelPropertyArray.forEach((mo) => {
      mo.animate();
    });
  }

  stopRun() {
    playSoundsAtGameOver();
    // clearInterval(this.runInterval);
    clearAllStoppableIntervals();
    this.stopDrawing = true;
    setScreenBtnsAsPerGameState('over');
  }

  /**
   * Check if the character is colliding with any of the enemies, if so, reduce the character's health
   * and set the new percentage in the health status bar.
   */
  checkCollisions() {
    // CHARACTER VS. BROWN CHICKEN
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
    // THROWN BOTTLE VS. GROUND --> MIT BODEN KOOLISIONSPRÜFUNG UND SCHAUEN OB DIE KOLLISIONS DURCH WURLF / FLUG ENTSTANDEN IST
    let arrayBottlesInFlight = this.level.bottlesInFlight;
    let arrayLevelEnemies = this.level.enemies;

    for (let i = 0; i < arrayBottlesInFlight.length; i++) {
      const bottle = arrayBottlesInFlight[i];
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

  checkRemovals() {
    let endboss = this.getOnlyEndbossObjFromLevelEnemyArray();
    if (endboss.isDead()) this.removeAllEnemiesExceptEndboss();
    else this.checkIf_ObjectsFromLevel_CanBeRemoved_And_RemoveThem(this.level.enemies);
    this.checkIf_ObjectsFromLevel_CanBeRemoved_And_RemoveThem(this.level.bottlesInFlight);
    this.checkIf_ObjectsFromLevel_CanBeRemoved_And_RemoveThem(this.character.coins);
    this.checkIf_Character_Or_Endboss_CanBeRemoved_And_RemoveOneOfBoth();
  }

  removeAllEnemiesExceptEndboss() {
    let array = this.level.enemies;
    array.forEach((enemy) => {
      if (!(enemy instanceof Endboss)) this.removeFromLevel(enemy, array);
    });
  }

  checkIf_ObjectsFromLevel_CanBeRemoved_And_RemoveThem(array) {
    array.forEach((obj) => {
      if (obj.canBeRemoved) this.removeFromLevel(obj, array);
    });
  }

  checkIf_Character_Or_Endboss_CanBeRemoved_And_RemoveOneOfBoth() {
    // Check if character can be removed from the world and remove it if yes.
    if (this.character.canBeRemoved) this.removeCharacter();
    // Check if endboss can be removed from the world level and remove it if yes.
    let endboss = this.getOnlyEndbossObjFromLevelEnemyArray();
    let array = this.level.enemies;
    if (endboss.canBeRemoved) {
      this.removeFromLevel(endboss, array);
    }
  }

  /**
   * Gets if the character or endboss is removed.
   */
  isCharacterOrEndbossRemoved() {
    // Prepare the local variable for endboss, if it still exists, and store it under the variable.
    let endboss = this.getOnlyEndbossObjFromLevelEnemyArray();
    return !this.character || !endboss;
  }

  getOnlyEndbossObjFromLevelEnemyArray() {
    let endbossObjFromLevelEnemyArray = this.level.enemies.find((x) => x instanceof Endboss);
    return endbossObjFromLevelEnemyArray;
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
    requestAnimationFrame(function () {
      /**
       * Hack: 'this' is not recognized here.
       * Therefore a variable 'self' containing 'this' is needed, used.
       */

      if (!self.stopDrawing) {
        self.updateCameraX();
        self.draw();
        // console.log('DRWAN');
      }
    });
  }

  /**
   * TODO: ZUM ÄNDERN / ALTE BESCHREIBUNG ALS DIE METHODE NOCH BEI CHARACTER CLASS WAR, NUR ALS BASIS ZUR BEARBEITUNG ERST VERSCHOBEN.
   * Because of the world is referanced to the character (analogically f.e like the world's keyboard property),
   * the world's 'camera_x' property can be setted from here (character class) and the world is moved in parallel
   * to the character in the opposite x-direction.
   * The character should be ever placed by 100px moved from the left canvas border.
   * Check if character is not dead. Move the world only if character is not dead.
   */
  updateCameraX() {
    if (this.character) {
      if (this.character.x >= this.camera_x_max + this.camera_x_shift) this.camera_x = -this.camera_x_max;
      else if (this.character.x <= this.camera_x_min + this.camera_x_shift) this.camera_x = -this.camera_x_min;
      else this.camera_x = -this.character.x + this.camera_x_shift;
    }
  }

  /**
   * Adds an array of objects to the map (canvas).
   * @param {Array} objects - An array of objects to add to the map.
   */
  addObjectsToMap(objects) {
    objects.forEach((object) => {
      this.addToMap(object);
    });
  }

  /**
   * Adds the object to the map (canvas).
   * @param {Object} mo - The movable object.
   */
  addToMap(mo) {
    if (mo != undefined && mo != null) {
      // Check if the movable object has other direction
      if (mo.otherDirection) {
        // Yes, flip the movable object image.
        this.flipImage(mo);
      }

      if ((mo instanceof Character && mo.health == 0) || (mo instanceof Endboss && mo.health == 0)) {
        this.rotateImage(mo);
      }
      // Pasting the image to the canvas with the settings from before.
      mo.draw(this.ctx);
      // Draw rectangle around object to analyse collisions.
      mo.drawFrame(this.ctx);

      // Draw rectangle around object reduced by its offset distances to analyse collisions.
      mo.draw_Offset_Frame(this.ctx);

      // Check if the image has beed already mirroed (equal to the check if the movable object has other direction):
      if (mo.otherDirection) {
        // Yes, flip the movable object image back.
        this.flipImageBack(mo);
      }

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

  removeFromLevel(objToRemove, arrOfObj) {
    //TODO: ab hier weiter, character, endboss werden nicht gelöscht, bei objToRemove wird nur das Character/Endboss obj an sich weitergegeben, aber nicht die vairbale world.character entleert, die Reference bleibt bestehen. Vielleicht die Methode ändern
    let index = arrOfObj.indexOf(objToRemove);
    if (index !== -1) {
      arrOfObj.splice(index, 1);
    }
  }

  removeCharacter() {
    this.character = null;
  }
}

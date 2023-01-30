class World {
  // In der Klasse wird kein let, const, var für die Deklaration, Initialisierung ähnlich wie bei Fuktionen verwendet.
  character = new Character();
  // Current set level (with its settings) for the game world.
  level = level1;
  canvas;
  // Tool box / framework to present things ('context') on canvas.
  ctx;
  // Assigned keyboard instance.
  keyboard;
  /**
   * Amount by which the image is moved during the character run.
   * --> The x-coordinate by which the canvas context will be translated bevor / after adding the objects to itself.
   * "The x-coordinate where the canvas BEGINS / ENDS to draw (place) objetcs."
   */
  camera_x = 0;
  // Initialize status bars of character's health, bottles, coins and endboss' health.
  healthBar = new StatusBar(30, 0, IMAGES_PATHS_BAR_HEALTH, 100);
  bootlesBar = new StatusBar(30, 50, IMAGES_PATHS_BAR_BOTTLES, 0);
  coinsBars = new StatusBar(30, 100, IMAGES_PATHS_BAR_COINS, 0);
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
    /**
     * Um die Funktion explizit aus dieser Klasse zu verwenden, muss mit 'this' darauf zugegriffen werden,
     * genauso wie beim Zugriff explizit auf Klassen Variablen.
     */
    this.draw();
    this.setWorld();
    // Execute a group of functions checking certain events in the world all the time.
    this.run();
  }

  /**
   * Sets the reference of the movable object to the instance of the world class
   * (by assinging the movable objects property named 'world' to 'this' (= the instance of THIS class)).
   * In this way movable object knows/has access to the variable, methods of the instance of 'world' class like f.e. keyboard.
   */
  setWorld() {
    this.character.world = this;
  }

  /**
   * Group of functions checking certain events in the world all the time.
   */
  run() {
    setStoppableInterval(() => {
      this.checkCollisions();
      this.checkThrowObjects();
      this.checkIfCharacterOrEndbossDead();
    }, 200);
  }

  /**
   * Checks if the keyboard key 'D' was pressed to throw throwable objects from the array.
   */
  checkThrowObjects() {
    // Checks if the keyboard key 'D' was pressed.
    if (this.keyboard.D) {
      // Yes, initialize a new throwable object with character coordinates.
      let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
      /**
       * Yes, puth the new initialized throwable object to the 'throwableObjects' array.
       * This 'throwableObjects' array is displayed later via the draw function. --> In this way more preasures of key 'D' / initialized
       * throwable objects can be displayed later at the same time.
       */
      this.throwableObjects.push(bottle);
    }
  }

  /**
   * Check if the character is colliding with any of the enemies, if so, reduce the character's health
   * and set the new percentage in the health status bar.
   */
  checkCollisions() {
    this.level.enemies.forEach((enemy) => {
      // Check, if character collides the enemy
      if (this.character.isColliding(enemy)) {
        // Yes, reduces character's health and set new percentage in the health status bar..
        this.character.hit();
        this.healthBar.setPercentage(this.character.health);
      }
    });
  }

  /**
   * Checks if the character or endboss is dead. If yes, stops the game clearing ALL of running intervalls in the world
   * and set the screen screen and buttons for 'game over' state.
   */
  checkIfCharacterOrEndbossDead() {
    if (this.character.isDead() || this.level.enemies[3].isDead()) {
      this.characterOrEndboosDead = true;
      setTimeout(() => {
        // stopGame(); // TODO: Hier DA oder ISH Programmierer fragen, ob das clean / empfohlen / richtig ist, dass eine game.js Funktion benutzt wird.
        // setScreenBtnsAsPerGameState('over');
      }, 2000); // TODO: Die Zeit am Ende hier anpassen, dass die DIEING ANIMATION vom Character oder Endboss, WIN ANIMATION vom Character oder Endboss ausreichend zu Ende abgespielt wird. Erst dann soll over screen eintretten und stopGame (clearing all intervalls).
    }
  }

  draw() {
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
    this.addToMap(this.coinsBars);
    this.addToMap(this.endbossBar);
    this.ctx.translate(this.camera_x, 0); // Forwards

    this.addToMap(this.character);

    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.throwableObjects);

    // Move the whole canvas context back to the right by camera_x amount after placing the objects.
    this.ctx.translate(-this.camera_x, 0);

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
      self.draw();
    });
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
}

// TODO: 2. Die Animation für DEAD des Characters verbessern --> Aktuell Character immer noch angezeigt. Kann laufen. Spiel muss beendeet werden.

// 21 - Aufgaben:
// TODO: 3. Start Screen
// TODO: 4. Musik im Hintergrund und bei Aktionen.
// TODO: 5. Coins einsammeln.
// TODO: 6. Flaschen einsammeln.
// TODO: 7. Flaschen nur werfen, wenn sie vorhanden sind.
// TODO: 8. Collison der Flaschen mit kleinen und großen Enemies. --> TODO: Eventuell kann man auf die Gegner sprignen.
// TODO: 9. Endgegner besiegen. --> Er hat auch ne Energie. Z.b. wenn er 3x getroffen wird, wird er tod sein.
// TODO: 10. Game-Over Screen, wenn das Spiel zu Ende (Character Tod, Endgegner besiegt (Level zu Ende)).
// TODO: 11. Fullscreean Modus via Fullscreen Icon rechts unten im Canvas --> via canvas.requestFullscreen()
// TODO: 12. Erklärung der Tasten Steuerung unter Canvas: Up, Right, Left, Space ...
// TODO: 13. Rahmen entwerfen.
// TODO: 14. Geschwindigkeiten anpassen (FPS). Lauf soll flüssig sein. Flasche soll schnelle z.B. fliegen.
// TODO: 15. Eine Klasse auch für Layer Screen, Btns machen, damit nur game.js die Sachen initialisiert, ähnlich wie Program.cs bei C#.

// Anforderungn aus dem VORletzten Video "Wie sauberer Code aussehen sollte"
// TODO: 16./16.1 Die Methoden sollen nicht länger als 14 Zeilen sein.
// TODO: 16.2. In Bezug auf 16 z.B bei Arrow Function () => {this.BespielFunktionOderMethoder()} nur aus einer Zeile bestehen, können die {} gelöscht werden, da nicht weitere Statements danach ausgeüfhrt werden --> Kürzung des Codes der Arrow-Fn.
// TODO: 16.3  If Conditions in eine separate return Funktion auslagern und den Namen als eine Frage geben, z.B. canMoveRight() {return .....}.
// TODO: 16.4  Den Funktionsblock z.B der IfAbfrage canMoveRight() bei der Character Klasse in eine separate moveRight() auslagern. Wenn diese separate Fn auch eine Fn mit dem gleichen Namen ausführt, d.h. z.B. moveRight() führt eine moveRight() aus der vererbenden SuperKlasse movableObject.class.js aus, dann ist diese geerbte Fn, hier moveRight(), mittels super.moveRight() (zur Differeniezrung / "Kollision" bei gleicher FunktionsNamensGebung / Fehlervermeidung) innnerhalb der separaten Fn moveRight() auszuführen.
// TODO: 16.5  Die IfAbfrage kann auch auf eine Zeile ohne {} Klammern verkürzt werden, wenn nur ein Statement im IfAbfrageBlock vorhanden ist.
// TODO: 17.. FINACL CHECK / ES SOLL "PERFEKT": PORTFOLIO-READY SEIN!

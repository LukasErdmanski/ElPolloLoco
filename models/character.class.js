class Character extends MovableObject {
  x = 120;
  y = 80;
  width = 100;
  height = 250;
  offset = {
    top: 95,
    left: 15,
    right: 15,
    bottom: 12,
  };

  speed = 10;
  coins = 0;

  // Array of image paths of this class.
  IMAGES_WALKING = [
    'img/2_character_pepe/2_walk/W-21.png',
    'img/2_character_pepe/2_walk/W-22.png',
    'img/2_character_pepe/2_walk/W-23.png',
    'img/2_character_pepe/2_walk/W-24.png',
    'img/2_character_pepe/2_walk/W-25.png',
    'img/2_character_pepe/2_walk/W-26.png',
  ];

  IMAGES_JUMPING = [
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
  IMAGES_DEAD = [
    'img/2_character_pepe/5_dead/D-51.png',
    'img/2_character_pepe/5_dead/D-52.png',
    'img/2_character_pepe/5_dead/D-53.png',
    'img/2_character_pepe/5_dead/D-54.png',
    'img/2_character_pepe/5_dead/D-55.png',
    'img/2_character_pepe/5_dead/D-56.png',
    'img/2_character_pepe/5_dead/D-57.png',
  ];
  IMAGES_HURT = [
    'img/2_character_pepe/4_hurt/H-41.png',
    'img/2_character_pepe/4_hurt/H-42.png',
    'img/2_character_pepe/4_hurt/H-43.png',
  ];

  // Assigned world instance. --> In this way you can access f.e world.character.world.keyboard. ...
  world;
  walking_sound = new Audio('audio/running.mp3');
  jumping_sound = new Audio('audio/jump.mp3');

  checkMakeMovementInterval = () => this.checkMakeMovement();
  checkSetImagesInterval = () => this.checkSetImages();

  constructor() {
    // Via super() wird auf die Methode, hier z.B. loadImage() der Super Klasse zugegriffen.
    super().loadImage('img/2_character_pepe/2_walk/W-21.png');
    // Loads the 'imageCache' with the image objects for the WALKING animation according to the image path array 'IMAGES_WALKING'.
    this.loadImages(this.IMAGES_WALKING);
    // Loads the 'imageCache' with the image objects for the JUMP animation according to the image path array 'IMAGES_JUMP'.
    this.loadImages(this.IMAGES_JUMPING);
    // Loads the 'imageCache' with the image objects for the DEAD animation according to the image path array 'IMAGES_DEAD'.
    this.loadImages(this.IMAGES_DEAD);
    // Loads the 'imageCache' with the image objects for the HURT animation according to the image path array 'IMAGES_HURT'.
    this.loadImages(this.IMAGES_HURT);
    // Apply the gravity to the character.
    this.applyGravity();
    // Start character movement animation after the initialisation.
    this.animate();
  }

  takeItem(itemToTake, collection) {
    this.world.level[collection] = this.world.level[collection].filter((obj) => obj !== itemToTake);
    this[collection]++;
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
    this.walking_sound.pause();

    // Check if the character can move right. If yes, the character moves right.
    if (this.canMoveRight()) this.moveRight();

    // Check if the character can move left. If yes, the character moves left.
    if (this.canMoveLeft()) this.moveLeft();

    // Check if the character can jump. If yes, the character jumps.
    if (this.canJump()) this.jump();

    if (this.canMoveAsDead()) this.moveAsDead();

    /*       if (this.world.keyboard.D && !this.bottles[0].isAboveGround()) {
      this.bottles[0].throw();
      console.log('werfe');
    } */

    /**
     * Because of the world is referanced to the character (analogically f.e like the world's keyboard property),
     * the world's 'camera_x' property can be setted from here (character class) and the world is moved in parallel
     * to the character in the opposite x-direction.
     * The character should be ever placed by 100px moved from the left canvas border.
     * Check if character is not dead. Move the world only if character is not dead.
     */
    if (!this.isDead()) this.world.camera_x = -this.x + 100;
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
    return this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x;
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
    return this.world.keyboard.LEFT && this.x > 0;
  }

  /**
   * Checks if the character can jump.
   * @returns {boolean} This returns true if character can jump, otherwise false.
   */
  canJump() {
    /**
     * Check and return true if the up key is pressed on the assigned keyboard object and character is NOT above the
     * ground.
     */
    return this.world.keyboard.UP && !this.isAboveGround();
  }

  canMoveAsDead() {
    return this.isDead();
  }

  /**
   * Moves the character to the right.
   */
  moveRight() {
    // Diese Funktions enthält auch eine Funktionn mit dem gleichen Namen, d.h. z.B. moveRight() führt eine moveRight() aus der vererbenden SuperKlasse movableObject.class.js aus, dann ist diese geerbte Funktion, hier moveRight(), mittels super.moveRight() (zur Differeniezrung / "Kollision" bei gleicher FunktionsNamensGebung / Fehlervermeidung) innnerhalb der Funktion moveRight() auszuführen.
    super.moveRight();
    this.otherDirection = false;
    this.walking_sound.volume = 0.7;
    this.walking_sound.play();
  }

  /**
   * Moves the character to the left.
   */
  moveLeft() {
    super.moveLeft();
    this.otherDirection = true;
    this.walking_sound.volume = 0.7;
    this.walking_sound.play();
  }

  /**
   * Moves the character to the top.
   */
  jump() {
    super.jump();
    this.jumping_sound.volume = 0.32;
    this.jumping_sound.play();
  }

  /**
   * Moves the character as dead.
   */
  moveAsDead() {
    super.moveAsDead();
  }

  checkSetImages() {
    if (this.isDead()) {
      // DEAD animation
      this.changeImagesSetAndCurrentImg(this.IMAGES_DEAD);
    } else if (this.isHurt()) {
      // HURT animation
      this.changeImagesSetAndCurrentImg(this.IMAGES_HURT);
    } else if (this.isAboveGround()) {
      // JUMP animation
      this.changeImagesSetAndCurrentImg(this.IMAGES_JUMPING);
    } else {
      if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
        /**
         * Check if the right or left arrow key is pressed on the assigned keyboard object to animate the character motion,
         * here: change animation images
         */
        // WALK animation
        this.changeImagesSetAndCurrentImg(this.IMAGES_WALKING);
      }
    }
  }
}

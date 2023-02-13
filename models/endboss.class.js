class Endboss extends MovableObject {
  y = 55;
  width = 250;
  height = 400;
  offset = {
    top: 65,
    left: 7,
    right: 3,
    bottom: 13,
  };

  IMAGES_PATHS_WALKING = [
    'img/4_enemie_boss_chicken/1_walk/G1.png',
    'img/4_enemie_boss_chicken/1_walk/G2.png',
    'img/4_enemie_boss_chicken/1_walk/G3.png',
    'img/4_enemie_boss_chicken/1_walk/G4.png',
  ];

  IMAGES_PATHS_ALERT = [
    'img/4_enemie_boss_chicken/2_alert/G5.png',
    'img/4_enemie_boss_chicken/2_alert/G6.png',
    'img/4_enemie_boss_chicken/2_alert/G7.png',
    'img/4_enemie_boss_chicken/2_alert/G8.png',
    'img/4_enemie_boss_chicken/2_alert/G8.png',
    'img/4_enemie_boss_chicken/2_alert/G10.png',
    'img/4_enemie_boss_chicken/2_alert/G11.png',
    'img/4_enemie_boss_chicken/2_alert/G12.png',
  ];

  IMAGES_PATHS_ATTACK = [
    'img/4_enemie_boss_chicken/3_attack/G13.png',
    'img/4_enemie_boss_chicken/3_attack/G14.png',
    'img/4_enemie_boss_chicken/3_attack/G15.png',
    'img/4_enemie_boss_chicken/3_attack/G16.png',
    'img/4_enemie_boss_chicken/3_attack/G17.png',
    'img/4_enemie_boss_chicken/3_attack/G18.png',
    'img/4_enemie_boss_chicken/3_attack/G19.png',
    'img/4_enemie_boss_chicken/3_attack/G20.png',
  ];

  IMAGES_PATHS_HURT = [
    'img/4_enemie_boss_chicken/4_hurt/G21.png',
    'img/4_enemie_boss_chicken/4_hurt/G22.png',
    'img/4_enemie_boss_chicken/4_hurt/G23.png',
  ];

  IMAGES_PATHS_DEAD = [
    'img/4_enemie_boss_chicken/5_dead/G24.png',
    'img/4_enemie_boss_chicken/5_dead/G25.png',
    'img/4_enemie_boss_chicken/5_dead/G26.png',
  ];

  // Memory, if the character had already first contact with the endboss.
  hadFirstContact = false;

  check_MakeMovement_Interval_Handler = () => this.checkMakeMovement();
  check_SetImages_Interval_Handler = () => this.checkSetImages();

  constructor() {
    super().loadImage(this.IMAGES_PATHS_WALKING[0]);
    this.loadImages(this.IMAGES_PATHS_WALKING);
    this.loadImages(this.IMAGES_PATHS_ALERT);
    this.loadImages(this.IMAGES_PATHS_ATTACK);
    this.loadImages(this.IMAGES_PATHS_HURT);
    this.loadImages(this.IMAGES_PATHS_DEAD);
    this.x = 2500;
    this.applyGravity();
    this.animate();
  }

  animate2() {
    // Counter of played animation intervalls.
    let i = 0;
    setStoppableInterval(() => {
      /**
       * If the counter od played animation intervall is smaller than 'IMAGES_WALKING.length', the first animation of
       * the endboss width images of the 'IMAGES_WALKING' array will be showed. Otherwise the second animation of the
       * edboss width images of the 'IMAGES_ALERT' array will be showed.
       */
      if (i < this.IMAGES_PATHS_WALKING.length) {
        this.changeImagesSetAndCurrentImg(this.IMAGES_PATHS_WALKING);
      } else {
        this.changeImagesSetAndCurrentImg(this.IMAGES_PATHS_ALERT);
      }
      // Increasing the counter of played animation intervalls.
      i++;

      /**
       * The animation should not show images of the 'IMAGES_WALKING' array only directly after level initialisation,
       * but also when the character will have first contact with the endboss / after reaching a certain x-coordinate.
       * Therefore the counter of played animation intervall for this case has to be reseted and the first contact
       * between character and endboss saved as true.
       */
      if (world.character.x > 2000 && !this.hadFirstContact) {
        i = 0;
        this.hadFirstContact = true;
      }

      this.moveEndboss();
    }, 200); // 5 fps

    // CHANGING POSITION, WAY, SPEED, ACCELERATION OF CHARACTEER--> MOVING ENDBOSS
    /**
     * Separated changing of x-position with a higher speed than the changing of the animation images below
     * to created more fluent movement.
     */
    setStoppableInterval(() => this.moveEndboss(), 1000 / 60); // 60 fps
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  checkMakeMovement() {
    if (this.canMoveAsDead()) this.moveAsDead();
  }

  canMoveAsDead() {
    return this.isDead();
  }

  /**
   * Moves the endboss as dead.
   */
  moveAsDead() {
    super.moveAsDead();
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  checkSetImages() {}
}

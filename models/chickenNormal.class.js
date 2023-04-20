class ChickenNormal extends MovableObject {
  width = 100;
  height = 80;
  offset = {
    top: 3,
    left: 3,
    right: 2,
    bottom: 4,
  };
  health = 2;
  canTurnAround = true;

  IMAGES_PATHS_WALKING = [
    'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
  ];

  IMG_PATH_DEAD = ['img/3_enemies_chicken/chicken_normal/2_dead/dead.png'];

  constructor() {
    super().loadImageFromImageCache(this.IMAGES_PATHS_WALKING[0]);
    this.positionOnGround();
    this.setAnimateIntervalHandlers();
  }

  setAnimateIntervalHandlers() {
    this.check_MakeMovement_Interval_Handler = this.checkMakeMovement.bind(this);
    this.check_SetImages_Interval_Handler = this.checkSetImages.bind(this);
  }

  setStartXAndSpeedX() {
    /**
     * super() wird nur verwendet, wenn Methoden von der Super Klasse verwendet.
     * Auf Variablen von Super Klasse kann direkt zugegriffen werden (ohne super() davor).
     * Math.random() returnt eine Random Zahl zw. 0 und 1.
     */
    this.x = this.level.end_x * 0.15 + Math.random() * this.level.end_x * 0.5; // Random Zahl zwischen 200 und 700
    // Set random motion speed for instance of chicken class after the initialisation.
    this.speedX = 0.15 + Math.random() * 0.25;
  }

  checkMakeMovement() {
    if (this.isDead()) this.deadAnimation_Part_MakeMovement_IsOver = true;
    else this.moveInXDirection();
  }

  checkSetImages() {
    if (this.isDead()) {
      this.changeImagesSetAndCurrentImg(this.IMG_PATH_DEAD);
      this.deadAnimation_Part_SetLastImg_IsOver = true;
    } else if (this.isHurt()) {
      this.changeImagesSetAndCurrentImg(this.IMG_PATH_DEAD);
    } else this.changeImagesSetAndCurrentImg(this.IMAGES_PATHS_WALKING);
  }
}

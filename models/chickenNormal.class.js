class ChickenNormal extends MovableObject {
  y = 360;
  width = 80;
  height = 60;
  offset = {
    top: 3,
    left: 3,
    right: 2,
    bottom: 4,
  };

  health = 1;

  IMAGES_PATHS_WALKING = [
    'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
  ];

  IMG_PATH_DEAD = 'img/3_enemies_chicken/chicken_normal/2_dead/dead.png';

  check_MakeMovement_Interval_Handler = () => this.checkMakeMovement();
  check_SetImages_Interval_Handler = () => this.checkSetImages();

  constructor() {
    super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
    this.loadImages(this.IMAGES_PATHS_WALKING);

    /**
     * super() wird nur verwendet, wenn Methoden von der Super Klasse verwendet.
     * Auf Variablen von Super Klasse kann direkt zugegriffen werden (ohne super() davor).
     * Math.random() returnt eine Random Zahl zw. 0 und 1.
     */
    this.x = 200 + Math.random() * 500; // Random Zahl zwischen 200 und 700
    // Set random motion speed for instance of chicken class after the initialisation.
    this.speedX = 0.15 + Math.random() * 0.25;

    this.setYToPositionOnGround();

    this.animate();
  }

  checkMakeMovement() {
    if (this.isDead()) this.deadAnimation_Part_MakeMovement_IsOver = true;
    else this.moveLeft();
  }

  checkSetImages() {
    if (this.isDead()) {
      this.deadAnimation_Part_SetLastImg_IsOver = true;
      this.img.src = this.IMG_PATH_DEAD;
    } else this.changeImagesSetAndCurrentImg(this.IMAGES_PATHS_WALKING);
  }
}

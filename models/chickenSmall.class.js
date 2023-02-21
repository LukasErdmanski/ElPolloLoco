class ChickenSmall extends MovableObject {
  width = 60;
  height = 53;
  offset = {
    top: 3,
    left: 9,
    right: 8,
    bottom: 4,
  };
  health = 5;
  canTurnAround = true;
  lastDesireJump = new Date().getTime();

  IMAGES_PATHS_WALKING = [
    'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
    'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
    'img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
  ];

  IMG_PATH_DEAD = ['img/3_enemies_chicken/chicken_small/2_dead/dead.png'];

  constructor() {
    super().loadImage(this.IMAGES_PATHS_WALKING[0]);
    this.loadImages(this.IMAGES_PATHS_WALKING);
    this.loadImages(this.IMG_PATH_DEAD);
    this.positionOnGround();
    this.setAnimateIntervalHandlers();
    this.isLevelSet();
  }

  setAnimateIntervalHandlers() {
    this.check_MakeMovement_Interval_Handler = () => this.checkMakeMovement();
    this.check_SetImages_Interval_Handler = () => this.checkSetImages();
  }

  isLevelSet() {
    let isLevelSetInterval = setStoppableInterval(() => {
      if (this.level) {
        clearInterval(isLevelSetInterval);
        this.setStartXAndSpeedX();
        this.applyGravity();
        this.animate();
      }
    });
  }

  setStartXAndSpeedX() {
    this.x = this.level.end_x * 0.15 + Math.random() * this.level.end_x * 0.5;
    this.speedX = 0.5 + Math.random() * 0.25;
  }

  checkMakeMovement() {
    if (this.isDead()) this.deadAnimation_Part_MakeMovement_IsOver = true;
    else if (this.hasDesireToJump() && !this.isAboveGround()) super.jump(16);
    else if (this.otherDirection == true) this.moveRight();
    else this.moveLeft();
  }

  hasDesireToJump() {
    let timePassed = (new Date().getTime() - this.lastDesireJump) / 1000;
    if (timePassed > 3) {
      this.lastDesireJump = new Date().getTime();
      let zeroOrOne;
      zeroOrOne = Math.random();
      if (zeroOrOne > 0.5) {
        return true;
      }
    }
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

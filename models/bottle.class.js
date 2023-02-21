class Bottle extends MovableObject {
  // y = 360;
  offset = {
    top: 15,
    left: 23,
    right: 15,
    bottom: 10,
  };

  idxInBottlesGroup = 0;
  amountInBottlesInGroup;

  health = 1;

  isThrown = false;

  IMAGES_PATHS_ON_GROUND = [
    'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
    'img/6_salsa_bottle/2_salsa_bottle_on_ground.png',
  ];

  IMAGES_PATHS_ROTATION = [
    'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
    'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
    'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
    'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
  ];

  IMAGES_PATHS_SPLASH = [
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
  ];

  IMAGES_PATHS_DESTROYING = this.IMAGES_PATHS_SPLASH;

  /**
   * Initializes a new throwable object with the given start cooridates. Executes the throw directly afterwards.w
   * @param {number} x - The initial x position of the throwable object.
   * @param {number} y - The initial y position of the throwable object.
   */
  constructor(allBottlesArr, x, y) {
    // constructor(x, y) {
    let randomIdxInImagesPaths = Math.round(Math.random());
    super().loadImage(this.IMAGES_PATHS_ON_GROUND[randomIdxInImagesPaths]);
    // TODO: das tun ALLE DRAWABLE OBJEKTE DIE MEHRERE IMG ARRAYS HABEN, das soll in einem Schritt für alle DOs bei init mit einer Zeile gemacht werden, z.B. ein JSON mit mehreren IMAGES PATHS könnten geladen werden. IMG.PATH.JSON vielleicht auslager
    this.loadImages(this.IMAGES_PATHS_ON_GROUND);
    this.loadImages(this.IMAGES_PATHS_ROTATION);
    this.loadImages(this.IMAGES_PATHS_SPLASH);

    if (allBottlesArr) this.x = this.getX(allBottlesArr);
    else (this.x = x), (this.y = y);

    this.height = 80;
    this.width = 70;

    this.positionOnGround();

    this.speedY = 0;

    this.setAnimateIntervalHandlers();

    // Apply gravity.
    this.applyGravity();

    this.animate();
    // this.throw();
  }

  getX(allBottlesArr) {
    let maxAmoutInBottlesGroup = 5;
    let lastBottleObj = allBottlesArr[allBottlesArr.length - 1];

    if (lastBottleObj == undefined || lastBottleObj.idxInBottlesGroup == lastBottleObj.amountInBottlesInGroup) {
      this.idxInBottlesGroup = 0;
      this.amountInBottlesInGroup = Math.ceil(Math.random() * (maxAmoutInBottlesGroup - 1));
    } else {
      this.idxInBottlesGroup = (lastBottleObj.idxInBottlesGroup + 1) % (lastBottleObj.amountInBottlesInGroup + 1);
      this.amountInBottlesInGroup = lastBottleObj.amountInBottlesInGroup;
    }

    return this.setX(lastBottleObj);
  }

  setX(lastBottleObj) {
    let [x, distanceToNextBottle] = [500, 35];
    if (lastBottleObj != undefined && this.idxInBottlesGroup == 0) x = lastBottleObj.x + 300;
    else if (lastBottleObj != undefined) x = lastBottleObj.x + distanceToNextBottle;
    return x;
  }

  setAnimateIntervalHandlers() {
    this.check_MakeMovement_Interval_Handler = () => this.checkMakeMovement();
    this.check_SetImages_Interval_Handler = () => this.checkSetImages();
  }

  isOnGroundAfterFlight() {
    return !this.isAboveGround() && this.speedX > 0;
  }

  checkMakeMovement() {
    if (this.isThrown) this.fallDown();
    if (this.speedX > 0 && this.otherDirection) this.moveLeft();
    if (this.speedX > 0 && !this.otherDirection) this.moveRight();
    if (this.isDead()) this.deadAnimation_Part_MakeMovement_IsOver = true;
  }

  /**
   * Applies a throw to the throwable object.
   */
  fallDown() {
    this.isThrown = false;
    console.log('IST THROWNNNNnnnnn');
    this.speedX = 9 + Math.random() * 4;
    this.accelerationX = 0.1;
    this.speedY = 10;
  }

  moveLeft() {
    super.moveLeft();
    this.speedX -= this.accelerationX;
  }

  moveRight() {
    super.moveRight();
    this.speedX -= this.accelerationX;
  }

  stopFligt() {
    this.deadAnimation_Part_MakeMovement_IsOver = true;
  }

  checkSetImages() {
    if (this.isDead()) this.changeImagesSetAndCurrentImg(this.IMAGES_PATHS_SPLASH);
    else if (this.isAboveGround()) this.changeImagesSetAndCurrentImg(this.IMAGES_PATHS_ROTATION);
  }
}

class Endboss extends MovableObject {
  width = 250;
  height = 400;
  offset = {
    top: 65,
    left: 7,
    right: 3,
    bottom: 13,
  };

  xDistanceEndbossToLevelEnd = 500;

  wasCharacterOnceDeteckedNearby = false;

  canTurnAround = true;

  speedXInitial;
  accelerationX = 1;

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

  constructor() {
    super().loadImage(this.IMAGES_PATHS_ALERT[0]);
    this.loadImages(this.IMAGES_PATHS_ALERT);
    this.loadImages(this.IMAGES_PATHS_WALKING);
    this.loadImages(this.IMAGES_PATHS_ATTACK);
    this.loadImages(this.IMAGES_PATHS_HURT);
    this.loadImages(this.IMAGES_PATHS_DEAD);
    this.positionOnGround();
    this.setAnimateIntervalHandlers();
    this.isLevelSet();
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
    // this.x = this.level.end_x - this.xDistanceEndbossToLevelEnd;
    this.x = 800;
    this.speedX = 0.15 + Math.random() * 0.25; //TODO: speed START für Endboss anpassen, mit jedem Hurt soll es schneller werden
    this.speedXInitial = this.speedX;
  }

  setAnimateIntervalHandlers() {
    this.check_MakeMovement_Interval_Handler = () => this.checkMakeMovement();
    this.check_SetImages_Interval_Handler = () => this.checkSetImages();
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
    if (this.isDead()) super.moveAsDead();
    else if (this.isInAtack()) this.canRunOrStopRunToCharacter();
    else if (this.isInRunBack()) this.runBack();
    // else this.walk();
  }

  inAtack = false;

  startAttack() {
    this.inAtack = true;
    this.speedXInitial = this.speedX;
    this.speedX = 7;
  }

  isInAtack() {
    return this.inAtack;
  }

  canRunOrStopRunToCharacter() {
    if (this.canRunToCharacter()) this.runToCharacter();
    else this.stopRunToCharacterStartRunBack();
  }

  canRunToCharacter() {
    return !this.isColliding(this.world.character);
  }

  stopRunToCharacterStartRunBack() {
    this.inAtack = false;
    this.inRunBack = true;
  }

  runToCharacter() {
    if (!this.isAboveGround()) this.jump(12);
    this.setDirectionForAttack();
    this.moveLeftOrRight();
  }

  setDirectionForAttack() {
    let xCharacterCenter = this.world.character.x + this.width / 2;
    let xEndbossCenter = this.x + this.width / 2;
    // Checking in which direction is character
    if (xEndbossCenter > xCharacterCenter) this.otherDirection = false;
    else this.otherDirection = true;
  }

  moveLeftOrRight() {
    if (this.otherDirection == true) this.moveRight();
    else this.moveLeft();
  }

  inRunBack = false;

  isInRunBack() {
    return this.inRunBack;
  }

  runBack() {
    if (!this.isAlreadyTurnedAroundForRunBack()) this.startRunBack();
    // else if (!this.hasRunMaxXDistanceOfRunBack()) this.runBackOneXInterval();
    else this.stopRunBack();
  }

  isTurnedAroundForRunBack = false;

  isAlreadyTurnedAroundForRunBack() {
    return this.isTurnedAroundForRunBack;
  }

  startRunBack() {
    // this.x = this.world.character.x;

    //TODO: AN DIESER STELLE WEITER FUNKTION WELCHE JE NACH FALL
    // LINKS ODER RECHTSS
    // ZUERST ENDBOSS zu diesem Zustand weiter führt this.x = this.world.character.x;
    // ES MUSS EINE X BERECHNUNG DER DISTANZU FINDEN
    // ENDBOSS MUSS ZUERSR IM FLUG ODER UNTEN UM DIESE DISTANZ LINKS ODER RECHTSG GEZOGEN WERDEN
    // DANN IST X CHARACTER GLEICH X ENDBOSS
    // ERST DANN ERFOLGT DIE UMDRECHUNG BERECHNUNG CALC MAX.

    this.isTurnedAroundForRunBack = true;

    this.calcMaxXDistanceOfRunBack();
  }

  maxXDistanceOfRunBack;

  calcMaxXDistanceOfRunBack() {
    // Checking if endboss in left or right canvas half
    this.setDirectionForRunBack();

    //////////////////////
    let xCanvasCenter = -this.world.camera_x + this.world.canvas.width / 2;
    let xCharacterCenter = this.world.character.x + this.width / 2;

    // Checking if character in left or right canvas half.
    let checkResultCharacterOnLeftOrRightCanvasHalf = xCanvasCenter > xCharacterCenter;

    let maxXDistanceOfRunBack;
    let canvasWidth = this.world.canvas.width;
    let xCharacter = this.world.character.x;
    let xCanvasLeftBorder = -this.world.camera_x;
    let xDistanceToCanvasLeftBorder = xCharacter - xCanvasLeftBorder;
    let endbossWidth = this.width;
    let xEndboss = this.x;
    let xEndbossCenter = this.x + this.width / 2;

    let deltaCharacterXEndbossX = xEndboss - xCharacter;

    // let checkResultEndbossXGreaterThanCharacterX = xEndboss > xCharacter;

    if (checkResultCharacterOnLeftOrRightCanvasHalf)
      // if (checkResultEndbossXGreaterThanCharacterX)
      maxXDistanceOfRunBack = canvasWidth - xDistanceToCanvasLeftBorder - deltaCharacterXEndbossX - endbossWidth;
    // else maxXDistanceOfRunBack = canvasWidth - xDistanceToCanvasLeftBorder - deltaCharacterXEndbossX - endbossWidth;
    else maxXDistanceOfRunBack = xDistanceToCanvasLeftBorder + deltaCharacterXEndbossX;

    this.maxXDistanceOfRunBack = maxXDistanceOfRunBack;
  }

  setDirectionForRunBack() {
    // let xEndbossCenter = this.x + this.width / 2
    let xCharacterCenter = this.world.character.x + this.width / 2;
    let xCanvasCenter = -this.world.camera_x + this.world.canvas.width / 2;

    // Checking if character in left or right canvas half. This defindes the direction for run back.
    if (xCharacterCenter < xCanvasCenter) this.otherDirection = false;
    else this.otherDirection = true;
  }

  currentXDistanceOfRunBack = 0;

  hasRunMaxXDistanceOfRunBack() {
    return this.currentXDistanceOfRunBack >= this.maxXDistanceOfRunBack;
  }

  runBackOneXInterval() {
    this.moveLeftOrRight();

    this.currentXDistanceOfRunBack += this.speedX;
  }

  stopRunBack() {
    this.turnAround();
    this.currentXDistanceOfRunBack = 0;
    this.isTurnedAroundForRunBack = false;
    this.inRunBack = false;
  }

  turnAround() {
    this.otherDirection = !this.otherDirection;
  }

  walk() {
    this.speedX = this.speedXInitial;
    if (this.otherDirection == true) this.moveRight();
    else this.moveLeft();
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  checkSetImages() {
    if (!this.wasCharacterNearby()) this.changeImagesSetAndCurrentImg(this.IMAGES_PATHS_ALERT);
    else if (this.isDead()) this.changeImagesSetAndCurrentImg(this.IMAGES_PATHS_DEAD);
    else if (this.isHurt()) this.changeImagesSetAndCurrentImg(this.IMAGES_PATHS_HURT);
    else if (this.isAboveGround()) this.changeImagesSetAndCurrentImg(this.IMAGES_PATHS_ATTACK);
    else this.changeImagesSetAndCurrentImg(this.IMAGES_PATHS_WALKING);
  }

  wasCharacterNearby() {
    if (!this.wasCharacterOnceDeteckedNearby) this.isCharacterNearby();
    return this.wasCharacterOnceDeteckedNearby;
  }

  isCharacterNearby() {
    let nearXDistanceCharacterToEndboss = this.world.canvas.width - this.width;
    let xRightCharacterImgSide = this.world.character.x + this.world.character.width + this.world.camera_x_shift;
    let checkResult = xRightCharacterImgSide + nearXDistanceCharacterToEndboss >= this.x + 150;
    if (checkResult) this.wasCharacterOnceDeteckedNearby = true;
    return checkResult;
  }
}

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

  SOUND_ATTACK = new Sound('audio/endbossAttack.mp3', 0.7);
  SOUND_CHARACTER_DETECTED = new Sound('audio/endbossCharacterDetected.mp3', 0.7);
  SOUND_DEAD = new Sound('audio/endbossDead.mp3', 0.7);
  SOUND_HURT = new Sound('audio/endbossHURT.mp3', 0.7);

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
        // this.animate();
      }
    });
  }

  setStartXAndSpeedX() {
    // this.x = this.level.end_x - this.xDistanceEndbossToLevelEnd;
    this.x = 1200;
    this.speedX = 4 + Math.random() * 0.25;
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
    this.SOUND_ATTACK.pause();
    if (this.isDead()) {
      this.moveAsDead();
    } // TODO: NUR EINMAL SPIELEN NICHT IM LOOP
    else if (this.isCharacterAlive()) {
      if (this.isHurtAndNotPreparedToAttack()) this.prepareToAttack();
      else if (this.isPreparedToAttack()) this.startAttack();
      else if (this.isInAtack()) this.attack();
      else if (this.isPreparedToRunBack()) this.startRunBack();
      else if (this.isInRunBack()) this.runBack();
      else if (this.inInWalk()) this.walk();
    }
  }

  moveAsDead() {
    super.moveAsDead();
  }

  isCharacterAlive() {
    return this.world.character && !this.world.character.isDead();
  }

  /****************************** PREPARING ATTACK ******************************/
  preparedToAttack = false;

  isHurtAndNotPreparedToAttack() {
    return this.isHurt() && !this.preparedToAttack;
  }

  prepareToAttack() {
    this.stopCurrentArrack();
    this.preparedToAttack = true;
  }

  stopCurrentArrack() {
    this.speedX = this.speedXInitial;
    this.inAtack = false;
  }

  /****************************** STARTING ATTACK ******************************/
  isPreparedToAttack() {
    return this.preparedToAttack && !this.isHurt();
  }

  inAtack = false;

  startAttack() {
    this.preparedToAttack = false;
    this.inAtack = true;
    this.speedXInitial = this.speedX;
    this.speedX = this.speedXInitial * 2.5;
  }

  /****************************** ATTACKING ******************************/
  isInAtack() {
    return this.inAtack && !this.world.character.isHurt();
  }

  attack() {
    this.SOUND_ATTACK.play();
    if (!this.isAboveGround()) this.jump(12);
    this.setDirectionForAttack();
    this.moveInXDirection();
  }

  setDirectionForAttack() {
    // Checking in which direction is character
    if (this.checkIfCharacterOnLeftOrRightEndbossHalf()) this.otherDirection = false;
    else this.otherDirection = true;
  }

  // Checking if character in left or right endboss half. This defindes the direction for attack.
  checkIfCharacterOnLeftOrRightEndbossHalf() {
    let xCharacterCenter = this.world.character.x + this.world.character.width / 2;
    let xEndbossCenter = this.x + this.width / 2;
    return xEndbossCenter > xCharacterCenter;
  }

  /****************************** STARTING RUN BACK ******************************/
  inRunBack = false;

  isPreparedToRunBack() {
    return this.inAtack && this.world.character.isHurt() && !this.inRunBack;
  }

  startRunBack() {
    this.stopCurrentArrack();
    this.inRunBack = true;
  }

  /****************************** CHECKING RUN BACK STEP ******************************/
  isInRunBack() {
    return this.inRunBack;
  }

  runBack() {
    if (!this.isAlreadyJumpedSetDirectionCalcucaltedDistance()) this.jumpSetDirectionCalcucalteDistance();
    else if (!this.hasRunMaxXDistanceOfRunBack()) this.runBackOneXInterval();
    else this.stopRunBack();
  }

  /****************************** RUNNING BACK - 1. START JUMPING, SETTING DIRECTION AND DISTANCE ******************************/
  isTurnedAroundForRunBack = false;

  isAlreadyJumpedSetDirectionCalcucaltedDistance() {
    return this.isTurnedAroundForRunBack;
  }

  jumpSetDirectionCalcucalteDistance() {
    this.jump(15);
    this.setDirectionForRunBack();
    this.isTurnedAroundForRunBack = true;
    this.calcMaxXDistanceOfRunBack();
  }

  maxXDistanceOfRunBack;

  setDirectionForRunBack() {
    this.setDirectionAsPerCanvasCenter();
  }

  // Checking if character in left or right canvas half. This defindes the direction for run back.
  checkIfCharacterOnLeftOrRightCanvasHalf() {
    return this.world.character.checkIfOnLeftOrRightCanvasHalf();
  }

  calcMaxXDistanceOfRunBack() {
    let maxXDistanceOfRunBack;
    let canvasWidth = this.world.canvas.width;
    let xCharacter = this.world.character.x;
    let xCanvasLeftBorder = -this.world.camera_x;
    let xDistanceToCanvasLeftBorder = xCharacter - xCanvasLeftBorder;
    let endbossWidth = this.width;
    let xEndboss = this.x;
    let deltaCharacterXEndbossX = xEndboss - xCharacter;
    if (this.checkIfCharacterOnLeftOrRightCanvasHalf())
      maxXDistanceOfRunBack = xDistanceToCanvasLeftBorder + deltaCharacterXEndbossX;
    else maxXDistanceOfRunBack = canvasWidth - xDistanceToCanvasLeftBorder - deltaCharacterXEndbossX - endbossWidth;
    this.maxXDistanceOfRunBack = maxXDistanceOfRunBack;
  }

  /****************************** RUNNING BACK - 2. MOVING ******************************/
  currentXDistanceOfRunBack = 0;

  hasRunMaxXDistanceOfRunBack() {
    return this.currentXDistanceOfRunBack >= this.maxXDistanceOfRunBack;
  }

  runBackOneXInterval() {
    this.moveInXDirection();
    this.currentXDistanceOfRunBack += this.speedX;
  }

  /****************************** RUNNING BACK - 3. STOP AND TOURNING AROUND ******************************/
  stopRunBack() {
    this.turnAround();
    this.currentXDistanceOfRunBack = 0;
    this.isTurnedAroundForRunBack = false;
    this.inRunBack = false;
  }

  turnAround() {
    this.otherDirection = !this.otherDirection;
  }

  /****************************** WALKING ******************************/
  inInWalk() {
    return this.wasCharacterNearby() && this.isNotInMiddleOfCharacter() && !this.isHurt();
  }

  isNotInMiddleOfCharacter() {
    let xCharacterCenter = this.world.character.x + this.world.character.width / 2;
    let xEndboss = this.x;
    let xEndbossWidth = this.width;
    if (this.checkIfCharacterOnLeftOrRightEndbossHalf()) return xEndboss >= xCharacterCenter;
    else return xEndboss + xEndbossWidth <= xCharacterCenter;
  }

  walk() {
    this.speedX = this.speedXInitial;
    this.setDirectionForAttack();
    this.moveInXDirection();
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  checkSetImages() {
    if (this.isCharacterAlive()) {
      if (!this.wasCharacterNearby()) this.changeImagesSetAndCurrentImg(this.IMAGES_PATHS_ALERT);
      else if (this.isDead()) this.changeImagesSetAndCurrentImg(this.IMAGES_PATHS_DEAD);
      else if (this.isHurt()) this.changeImagesSetAndCurrentImg(this.IMAGES_PATHS_HURT);
      else if (this.isFlyingOrCollidingCharacter()) this.changeImagesSetAndCurrentImg(this.IMAGES_PATHS_ATTACK);
      else this.changeImagesSetAndCurrentImg(this.IMAGES_PATHS_WALKING);
    }
  }

  wasCharacterNearby() {
    if (!this.wasCharacterOnceDeteckedNearby) this.isCharacterNearby();
    return this.wasCharacterOnceDeteckedNearby;
  }

  isCharacterNearby() {
    let nearXDistanceCharacterToEndboss = this.world.canvas.width - this.width;
    let xRightCharacterImgSide = this.world.character.x + this.world.character.width;
    let checkResult = xRightCharacterImgSide + nearXDistanceCharacterToEndboss >= this.x * 1.15;
    if (checkResult) {
      this.wasCharacterOnceDeteckedNearby = true;
      this.SOUND_CHARACTER_DETECTED.play();
      changeBgMusic();
    }
    return checkResult;
  }

  isFlyingOrCollidingCharacter() {
    return this.isAboveGround() || this.isColliding(this.world.character);
  }
}

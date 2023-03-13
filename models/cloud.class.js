class Cloud extends MovableObject {
  y = 20;
  width = 500;
  height = 250;

  IMAGES_PATHS = ['img/5_background/layers/4_clouds/1.png', 'img/5_background/layers/4_clouds/2.png'];

  constructor() {
    let randomIdxZeroOrOne = Math.round(Math.random());
    super().loadImage(this.IMAGES_PATHS[randomIdxZeroOrOne]);
    this.setAnimateIntervalHandlers();
  }

  setAnimateIntervalHandlers() {
    this.check_MakeMovement_Interval_Handler = this.checkMakeMovement.bind(this);
  }

  setStartX() {
    this.x = 0 + Math.random() * this.level.end_x;
  }

  checkMakeMovement() {
    if (this.isDead()) this.deadAnimation_Part_MakeMovement_IsOver = true;
    else if (this.isBeyondLevelStartX()) this.moveToLevelEndX();
    else this.moveLeft();
  }

  isBeyondLevelStartX() {
    return this.x + this.width <= this.level.start_x;
  }

  moveToLevelEndX() {
    this.x = this.level.end_x;
  }
}

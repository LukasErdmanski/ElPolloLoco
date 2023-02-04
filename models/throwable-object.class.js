class ThrowableObject extends MovableObject {
  /**
   * Initializes a new throwable object with the given start cooridates. Executes the throw directly afterwards.w
   * @param {number} x - The initial x position of the throwable object.
   * @param {number} y - The initial y position of the throwable object.
   */
  constructor(x, y) {
    super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
    this.x = x;
    this.y = y;
    this.height = 60;
    this.width = 50;
    // this.throw();
  }

  /**
   * Applies a throw to the throwable object.
   */
  throw() {
    // Set the start y-speed.
    this.speedY = 10;
    // Apply gravity.
    this.applyGravity();
    // Set the x-speed.
    setStoppableInterval(() => {
      this.x += 10;
    }, 25);
  }
}

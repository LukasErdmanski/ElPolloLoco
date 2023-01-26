class MovableObject extends DrawableObject {
  // Speed of horizontal motion animation
  speed = 0.15;
  otherDirection = false;
  // Speed and accelaration during jump / falling down.
  speedY = 0;
  acceleration = 1;
  // Variable, welche in der neuen nicht im Video benutzten Kollisionsformel verwendet wrid. Bedeutet y-Versatz. Wird wenigstens auf 0 von mir gesetzt, damit die neue besser Kollisionsformel überhaupt funktioniert.
  offsetY = 0;
  energy = 100;
  lastHit = 0;
  dead = new Event('dead');

  /**
   * Sets the gravity to the movable object.
   */
  applyGravity() {
    setStoppableInterval(() => {
      /**
       * Checks if the movable object reached the ground OR has a positive y-speed (in the initial started phase of the
       * jump / throw before reaching the highest point / falling down).
       */
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  /**
   * Gets if the movable object is above the ground.
   * @returns {boolean} This returns true if movable object is above ground, false if not.
   */
  isAboveGround() {
    // Check if the movable object is a throwable object.
    if (this instanceof ThrowableObject) {
      // Yes, returns true. --> Throwable object should always fall / not stop on the ground (y = 180px).
      return true;
    } else {
      // No, check if the movable object is above the ground (y = 180px). Return true if it is, no if it is not.
      return this.y < 180;
    }
  }

  // Alte Formel, im Modul Video benutzt und erklärt.
  isColliding_ALT(mo) {
    return (
      this.x + this.width > mo.x && this.y + this.height > mo.y && this.x < mo.x + mo.width && this.y < mo.y + mo.height
    );
  }

  // Bessere Formel zur Kollisionsberechnung (Genauer)
  // Neuere bessere Formel, nicht im Modul Video benutzt
  // Syntax: z.B. character.isColliding(chicken)
  isColliding_ALT_2(obj) {
    return (
      this.x + this.width >= obj.x &&
      this.x <= obj.x + obj.width &&
      this.y + this.offsetY + this.height >= obj.y &&
      this.y + this.offsetY <= obj.y + obj.height
      // Optional: hiermit könnten wir schauen, ob ein Objekt sich in die richtige Richtung bewegt. Nur dann kollidieren wir. Nützlich bei Gegenständen, auf denen man stehen kann.
      // obj.onCollisionCourse
    );
  }
  s;
  // Noch bessere Formel zur Kollisionsberechnung (Noch Genauer)
  // Noch neuere bessere Formel, im FAQ Modul Video später mit Erläuterungsbild ergäntzt.
  // Syntax: z.B. character.isColliding(chicken)
  isColliding(obj) {
    return (
      this.x + this.width - this.offset.right >= obj.x + obj.offset.left && // R -> L. Compare the right character side width left object side considering the offset distances.
      this.y + this.height - this.offset.bottom >= obj.y + obj.offset.top && // T -> B. Compare the bottom character side width top object side considering the offset distances.
      this.x + this.offset.left <= obj.x + obj.width - obj.offset.right && // L -> R. Compare the left character side width right object side considering the offset distances.
      this.y + this.offset.top <= obj.y + obj.height - obj.offset.bottom // B -> T. Compare the top character side width bottom object side considering the offset distances.
      // Optional: hiermit könnten wir schauen, ob ein Objekt sich in die richtige Richtung bewegt. Nur dann kollidieren wir. Nützlich bei Gegenständen, auf denen man stehen kann.
      // obj.onCollisionCourse
    );
  }

  /**
   * Reduces movable object's energy by colliding.
   */
  hit() {
    this.energy -= 5;
    // Check if the energy is zero or negative.
    if (this.energy <= 0) {
      // Yes, set it minimally to zero.
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * Returns if movable object is hurt.
   */
  isHurt() {
    let timePassed = new Date().getTime() - this.lastHit; // Difference in ms.
    timePassed = timePassed / 1000; // Difference in s.
    return timePassed < 1;
  }

  /**
   * Returns if movable object is dead (energy amount is zero).
   */
  isDead() {
    return this.energy == 0;
  }

  playAnimation(images) {
    /**
     * Walk animation.
     *
     * Modulo function returns ONLY the rest of the devision.
     * On the example of character with 6 images, possible return values: 6, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5, 0, 1, ...
     * let i = 0 % 6 => 0, Rest 0    let i = 1 % 6 => 0, Rest 1     let i = 2 % 6 => 0, Rest 2
     * let i = 6 % 6 => 1, Rest 0    let i = 7 % 6 => 1, Rest 1     let i = 8 % 6 => 1, Rest 2  ...
     * In this way 'i' can again be 0 after beeing equal to the given array lenght minus (here 6 - 1 = 5) one before it.
     * --> Continously incrementation of the counter oscilating between first and last index of the given array (here 0 and 5)..
     * Assign new value for i equal to the modulo function below in this interval.
     */
    let i = this.currentImage % images.length;
    // Assign the current path from given 'images' array according to the 'i'.
    let path = images[i];
    // Assign new image object / element from 'imageCache' accroding the current iterated 'path' as the key.
    this.img = this.imageCache[path];
    // Increase the iteration counter by one.
    this.currentImage++;
  }

  moveRight() {
    this.x += this.speed;
  }

  /**
   * Moves the the movable object to the left.
   */
  moveLeft() {
    this.x -= this.speed;
  }

  jump() {
    this.speedY = 20;
  }
}

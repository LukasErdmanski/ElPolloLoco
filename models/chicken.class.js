class Chicken extends MovableObject {
  y = 360;
  height = 60;
  width = 80;
  offset = {
    top: 3,
    left: 3,
    right: 2,
    bottom: 4,
  };
  IMAGES_WALKING = [
    'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
  ];

  constructor() {
    super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
    this.loadImages(this.IMAGES_WALKING);

    /**
     * super() wird nur verwendet, wenn Methoden von der Super Klasse verwendet.
     * Auf Variablen von Super Klasse kann direkt zugegriffen werden (ohne super() davor).
     * Math.random() returnt eine Random Zahl zw. 0 und 1.
     */
    this.x = 200 + Math.random() * 500; // Random Zahl zwischen 200 und 700
    // Set random motion speed for instance of chicken class after the initialisation.
    this.speed = 0.15 + Math.random() * 0.25;

    this.animate();
  }

  /**
   * Changes the character image every set interval. --> Animate a character motion in this way.
   */
  animate() {
    setStoppableInterval(() => {
      this.moveLeft();
    }, 1000 / 60); // 60 fps

    setStoppableInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
    }, 200); // 5 fps
  }
}

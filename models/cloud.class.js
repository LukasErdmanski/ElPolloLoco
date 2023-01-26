class Cloud extends MovableObject {
  y = 20;
  width = 500;
  height = 250;

  constructor() {
    super().loadImage('img/5_background/layers/4_clouds/1.png');

    this.x = 0 + Math.random() * 500; // Random Zahl zwischen 200 und 700
    this.animate();
  }

  animate() {
    this.moveLeft();
  }
}

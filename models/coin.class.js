class Coin extends MovableObject {
  // Static property accessed when setting the x and y coordinates in the getXYForCoin() function of level.js. // TODO: @see setzten zu Funktion in level.js vpm Fktn getXYForCoin().
  static diameter = 100;
  width = Coin.diameter;
  height = Coin.diameter;
  offsetValue = 34;
  offset = {
    top: this.offsetValue,
    left: this.offsetValue,
    right: this.offsetValue,
    bottom: this.offsetValue,
  };

  IMAGES_PATH = ['img/8_coin/coin_1.png', 'img/8_coin/coin_2.png'];

  checkSetImagesInterval = () => this.changeImagesSetAndCurrentImg(this.IMAGES_PATH);

  constructor(x, y) {
    super().loadImage(this.IMAGES_PATH[0]);
    this.loadImages(this.IMAGES_PATH);
    this.x = x;
    this.y = y;
    this.animate(undefined, 3);
  }

  
}

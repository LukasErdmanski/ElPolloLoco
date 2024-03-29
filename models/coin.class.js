/**
 * Represents a coin object.
 * @class
 * @extends MovableObject
 */
class Coin extends MovableObject {
  /**
   * Static property, the coin diameter of 100, accessed when setting the x and y coordinates in the {@link Coin#setXY}
   * method of Coin.
   * @static
   * @type {number}
   */
  static diameter = 85;

  /**
   * The width of the coin.
   * @type {number}
   */
  width = Coin.diameter;

  /**
   * The height of the coin.
   * @type {number}
   */
  height = Coin.diameter;

  /**
   * The offset value for the coin.
   * @type {number}
   */
  offsetValue = 30;

  /**
   * The offset of the coin.
   * @type {{top: number, left: number, right: number, bottom: number}}
   */
  offset = {
    top: this.offsetValue,
    left: this.offsetValue,
    right: this.offsetValue,
    bottom: this.offsetValue,
  };

  /**
   * Image paths for the coin animation.
   * @type {string[]}
   */
  IMAGES_PATHS = ['img/8_coin/coin_1.png', 'img/8_coin/coin_2.png'];

  /**
   * Creates a new instance of the Coin class.
   * @constructor
   * @param {Array} allCoinsArr - The array of all the coins that have been created.
   */
  constructor(allCoinsArr) {
    super().loadImageFromImageCache(this.IMAGES_PATHS[0]);
    [this.x, this.y] = this.getXY(allCoinsArr);
  }

  /**
   * Returns an array with x and y coordinates for the next coin in a coin arc.
   * @param {Array} allCoinsArr - The array of all the coins that have been created.
   * @returns {number[]} The array with the x and y coordinates of the next coin in the coin arc.
   */
  getXY(allCoinsArr) {
    // Interator between 0 - 8
    let i = allCoinsArr.length % 9;
    /**
     * Initialize the direction memory (can be +1 or -1) to set the y-coordinate of the coins. For the first 5 coins in
     * the row of nine it is +1, for the last four it is -1.
     */
    let plusOrMinusOne = 1;
    /**
     * Check if five iteration has already beed done. Yes, change direction for setting the y-coordinate of the next
     * coins after the fourth of nine coins in a coin row (arc).
     */
    if (i >= 5) plusOrMinusOne = -1;
    // Save the last coin object from the coin array.
    let lastCoinObj = allCoinsArr[allCoinsArr.length - 1];
    // Set x and y coordinates for the next coin in a coin arc.
    return this.setXY(i, plusOrMinusOne, lastCoinObj);
  }

  /**
   * Sets the x and y coordinates for the next coin in a coin arc.
   * @param {number} i - The index of the coin in the array.
   * @param {number} plusOrMinusOne - The direction memory (can be +1 or -1) to set the y-coordinate of the coins.
   * For the first 5 coins in the row of nine it is +1, for the last four it is -1.
   * @param {Coin} lastCoinObj - The last coin object in the array.
   * @returns The array with the x and y coordinates of the next coin in the coin arc.
   */
  setXY(i, plusOrMinusOne, lastCoinObj) {
    /**
     * Initialize x-coordinate for the very first coin, y-coordinate for the first one in every row (arc) of nine coins
     * and the diameter value of a coin.
     */
    let [x, y, coinObjDiameter] = [500, 255, Coin.diameter];
    /**
     * Check if is the iteration for the first of nine coins in a coin row (arc) und if is not the first coin row (arc).
     * Yes, set the x-coordinate of the first coin by 500 more than the last coin of the last coin row (arc).
     */
    if (i == 0 && lastCoinObj != undefined) x = lastCoinObj.x + 500;
    // Otherwise check if there is a coin object in the array.
    else if (lastCoinObj != undefined) {
      // Set x and y coordinates for the next coin in a coin arc.
      x = lastCoinObj.x + coinObjDiameter / 1.1;
      y = lastCoinObj.y - plusOrMinusOne * (coinObjDiameter / 2);
    }
    return [x, y];
  }

  /**
   * Checks the interval for setting images and updates the current image for coin animation.
   * @override
   */
  checkSetImagesIntervalHandler() {
    this.changeImagesSetAndCurrentImg(this.IMAGES_PATHS);
  }
}

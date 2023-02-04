let level1;

let allCoins = [];

function initLevel() {
  initSoManyCoins(36);
  // debugger;
  level1 = new Level(
    // enemies
    [new Chicken(), new Chicken(), new Chicken(), new Endboss()],
    // clouds
    [new Cloud()],
    // background objects
    [
      /* Analogous to the next background objects and the background continuity during the character run, the previous ones are also needed.  */
      new BackgroundObject('img/5_background/layers/air.png', -719),
      new BackgroundObject('img/5_background/layers/3_third_layer/2.png', -719),
      new BackgroundObject('img/5_background/layers/2_second_layer/2.png', -719),
      new BackgroundObject('img/5_background/layers/1_first_layer/2.png', -719),

      /* The backgrounds are layered on top of each other on the canvas in this order. */
      new BackgroundObject('img/5_background/layers/air.png', 0),
      new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 0),
      new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 0),
      new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 0),
      /**
       * The next background objects are placed to the right of the first ones (initially not visible in the canvas
       * and moved by the applicable multiple of (the canvas width - 1px), here 1 x (720px - 1px) (to see no black
       * vertical connecting line)) to ensure a continuous background film when the first background  objects are moved
       * to the left in parallel to the character run.
       */
      new BackgroundObject('img/5_background/layers/air.png', 719),
      new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719),
      new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719),
      new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719),

      new BackgroundObject('img/5_background/layers/air.png', 719 * 2),
      new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719 * 2),
      new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719 * 2),
      new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719 * 2),

      new BackgroundObject('img/5_background/layers/air.png', 719 * 3),
      new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719 * 3),
      new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719 * 3),
      new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719 * 3),
    ],
    // coins
    allCoins
  );
}

function initSoManyCoins(amount) {
  for (let i = 0; i < amount; i++) {
    let [x, y] = getXYForCoin();
    let coin = new Coin(x, y);
    allCoins.push(coin);
  }
}

function getXYForCoin() {
  // Interator between 0 - 8
  let i = allCoins.length % 9;
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
  let lastCoinObj = allCoins[allCoins.length - 1];
  // Set x and y coordinates for the next coin in a coin arc.
  return setXYForCoin(i, plusOrMinusOne, lastCoinObj);
}

function setXYForCoin(i, plusOrMinusOne, lastCoinObj) {
  /**
   * Initialize x-coordinate for the very first coin, y-coordinate for the first one in every row (arc) of nine coins
   * and the diameter value of a coin.
   */
  let [x, y, coinObjDiameter] = [500, 255, Coin.diameter];
  /**
   * Check if is the iteration for the first of nine coins in a coin row (arc) und if is not the first coin row (arc).
   * Yes, set the x-coordinate of the first coin by 500 more than the last coin of the last coin row (arc).
   */
  if (i == 0 && allCoins.length != 0) x = lastCoinObj.x + 500;
  // Otherwise check if there is a coin object in the array.
  else if (allCoins.length != 0) {
    // Set x and y coordinates for the next coin in a coin arc.
    x = lastCoinObj.x + coinObjDiameter / 1.1;
    y = lastCoinObj.y - plusOrMinusOne * (coinObjDiameter / 2);
  }
  return [x, y];
}

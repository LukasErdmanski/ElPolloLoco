let level1;

let allCoins = [];

function initLevel() {
  initSoManyCoinsInArr(36, allCoins);
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

function initSoManyCoinsInArr(amount, allCoinsArr) {
  for (let i = 0; i < amount; i++) {
    let coin = new Coin(allCoinsArr);
    allCoins.push(coin);
  }
}
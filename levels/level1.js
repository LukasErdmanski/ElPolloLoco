/**
 * The first level of the game.
 * @type {Level}
 */
let level1;

/**
 * Initializes the first level of the game.
 */
function initLevel() {
  // Create a new Level object with the specified parameters
  level1 = new Level(
    initSoManyBackgroundObjectsGroups(3),
    initSoManyLevelObjects(Cloud, 10),
    initSoManyEnemies(5),
    initSoManyLevelObjects(Coin, 18),
    initSoManyLevelObjects(Bottle, 18),
  );
}

/**
 * Initializes an array of background objects based on the given amount.
 * @param {number} amount - The amount of background object groups to create.
 * @returns {BackgroundObject[]} An array of background objects.
 */
function initSoManyBackgroundObjectsGroups(amount) {
  let allBackgroundObjects = [];
  const xDistance = 719;
  let imgNum = 1;
  for (let i = -1; i <= amount * 2 - 2; i++) {
    let xCoordinate = xDistance * i;
    if (imgNum == 2) imgNum = 1; // Toggle between 1 and 2
    else imgNum = 2;
    // Push new BackgroundObjects for each layer in the game with adjusted xCoordinate
    allBackgroundObjects.push(new BackgroundObject('img/5_background/layers/air.png', xCoordinate));
    allBackgroundObjects.push(new BackgroundObject(`img/5_background/layers/3_third_layer/${imgNum}.png`, xCoordinate));
    allBackgroundObjects.push(
      new BackgroundObject(`img/5_background/layers/2_second_layer/${imgNum}.png`, xCoordinate)
    );
    allBackgroundObjects.push(new BackgroundObject(`img/5_background/layers/1_first_layer/${imgNum}.png`, xCoordinate));
  }
  return allBackgroundObjects;
}

/**
 * Initializes an array of level objects based on the given amount.
 * @param {function} levelObjectToInit - The constructor function for the level object to initialize.
 * @param {number} amount - The amount of level objects to create.
 * @returns {LevelObject[]} An array of level objects.
 */
function initSoManyLevelObjects(levelObjectToInit, amount) {
  let allObjectsArray = [];
  for (let i = 0; i < amount; i++) {
    // Create a new object with the specified constructor and add it to the array
    let createdItem = new levelObjectToInit(allObjectsArray);
    allObjectsArray.push(createdItem);
  }
  return allObjectsArray;
}

/**
 * Initializes an array of enemies based on the given amount.
 * @param {number} amount - The amount of enemies to create.
 * @returns {Enemy[]} An array of enemies.
 */
function initSoManyEnemies(amount) {
  // Create normal and small chickens
  let normalChickens = initSoManyLevelObjects(ChickenNormal, amount);
  let smallChcickens = initSoManyLevelObjects(ChickenSmall, amount);
  // Create the endboss
  let endboss = new Endboss();
  // Concatenate all enemy arrays
  // let enemies = normalChickens.concat(smallChcickens, endboss);
  let enemies = [endboss];
  return enemies;
}

let level1;
function initLevel() {
  level1 = new Level(
    initSoManyBackgroundObjectsGroups(3),
    initSoManyLevelObjects(Cloud, 10),
    // ChickenNormal, ChickenSmall, Endboss
    initSoManyEnemies(5),
    initSoManyLevelObjects(Coin, 18),
    // Bottles on ground
    initSoManyLevelObjects(Bottle, 18),
    // Bottles in flight
    initSoManyLevelObjects(Bottle, 0)
  );
}

function initSoManyBackgroundObjectsGroups(amount) {
  let allBackgroundObjects = [];
  let xDistance = 719;
  let imgNum = 1;
  for (let i = -1; i <= amount * 2 - 2; i++) {
    let xCoordinate = xDistance * i;
    if (imgNum == 2) imgNum = 1;
    else imgNum = 2;
    allBackgroundObjects.push(new BackgroundObject('img/5_background/layers/air.png', xCoordinate));
    allBackgroundObjects.push(new BackgroundObject(`img/5_background/layers/3_third_layer/${imgNum}.png`, xCoordinate));
    allBackgroundObjects.push(new BackgroundObject(`img/5_background/layers/2_second_layer/${imgNum}.png`, xCoordinate));
    allBackgroundObjects.push(new BackgroundObject(`img/5_background/layers/1_first_layer/${imgNum}.png`, xCoordinate));
  }
  return allBackgroundObjects;
}

function initSoManyLevelObjects(levelObjectToInit, amount) {
  let allObjectsArray = [];
  for (let i = 0; i < amount; i++) {
    let createdItem = new levelObjectToInit(allObjectsArray);
    allObjectsArray.push(createdItem);
  }
  return allObjectsArray;
}

function initSoManyEnemies(amount) {
  let normalChickens = initSoManyLevelObjects(ChickenNormal, amount);
  let smallChcickens = initSoManyLevelObjects(ChickenSmall, amount);
  let endboss = new Endboss();
  let enemies = normalChickens.concat(smallChcickens, endboss);
  return enemies;
}
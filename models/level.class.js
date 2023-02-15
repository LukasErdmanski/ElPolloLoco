class Level {
  character;
  enemies;
  clouds;
  backgroundObjects;
  coins;
  bottlesInGround;
  bottlesInFlight;
  amountOfAllCoins;
  amountOfAllBottles;
  // The end x-coordinate of the world level.
  amountOfBG = 5;
  start_x;
  end_x;

  constructor(backgroundObjects, clouds, enemies, coins, bottlesInGround, bottlesInFlight, amountOfAllBottles) {
    this.backgroundObjects = backgroundObjects;
    this.clouds = clouds;
    this.enemies = enemies;
    this.coins = coins;
    this.bottlesInGround = bottlesInGround;
    this.bottlesInFlight = bottlesInFlight;
    // TODO: DIE Anzahl der Coins bleibt nach Init KONSTANT, nicht wie bottles.
    this.amountOfAllCoins = amountOfAllBottles;
    // TODO: WENN SPÄTER DIE FUNKTIONS Umwandel Coins to Bottles muss sich das hier mit jedem Kauf dynamisch ädern damit die prozentuale Berechnung stimmt für Statusanzeige, da die unrsprünglichen 100% anwachsen.
    this.amountOfAllBottles = amountOfAllBottles;
    this.start_x = this.getLevelStartX();
    this.end_x = this.getLevelEndX();
    this.setLevel();
  }

  getLevelStartX() {
    let lelve_start_x = this.backgroundObjects[0].x;
    return lelve_start_x;
  }

  getLevelEndX() {
    let lastBGOInLevelArray = this.backgroundObjects[this.backgroundObjects.length - 1];
    let lastBG_start_x = lastBGOInLevelArray.x;
    let end_x = lastBG_start_x + lastBGOInLevelArray.width;
    return end_x;
  }

  setLevel() {
    this.enemies.forEach((enemy) => {
      enemy.level = this;
    });

    this.clouds.forEach((cloud) => {
      cloud.level = this;
    });
  }
}
